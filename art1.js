const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let start = true;
let firstClick = true;
let shouldStop = false;
let music = new Audio('background2.mp3');
music.onended = function () {
    start = true;
    firstClick = true;
    shouldStop = false;
};

const mouse = { x: -9999, y: -9999, radius: 50 };

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Tuning: DOT_SIZE controls rendered dot width, TARGET_PARTICLES caps count for performance
const DOT_SIZE = 2;
const TARGET_PARTICLES = 400000;

// SoA (Structure-of-Arrays) particle storage — typed arrays for cache locality
let particleCount = 0;
let posX, posY, baseX, baseY, density;
let colorR, colorG, colorB;

// Fibonacci spiral target positions
let spiralX, spiralY;
let spiralMode = false;
let spiralAngleOffset = 1;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const SPIRAL_LERP = .02;
const SPIRAL_ROTATION_SPEED = 0.03;
const PIXEL_RETURN_SPEED = 0.02;

// Color-grouped spirals
const N_SPIRALS = 12;
const INNER_SPIRAL_ACTIVE = 0.02;
const OUTER_SPIRAL_ACTIVE = 0.20;
let groupId, groupIndex, groupCount, spiralActive;

// Wave distortion mode
let waveMode = false;
let waveTime = 0;
const WAVE_AMP = 40;
const WAVE_FREQ = 0.015;
const WAVE_SPEED = 0.05;

// Single ImageData buffer reused every frame
let imageData, pixels;

function rgbToHue(r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    if (d === 0) return 0;
    let h;
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
    return h;
}

function initParticles() {
    const w = canvas.width;
    const h = canvas.height;

    // Scale image to 60% of viewport and center it
    const scale = 0.6;
    const imgW = Math.round(w * scale);
    const imgH = Math.round(h * scale);
    const offsetX = Math.round((w - imgW) / 2);
    const offsetY = Math.round((h - imgH) / 2);

    // Auto-compute stride so particle count stays near TARGET_PARTICLES
    const totalPixels = imgW * imgH;
    const stride = Math.max(1, Math.round(Math.sqrt(totalPixels / TARGET_PARTICLES)));

    ctx.drawImage(png, offsetX, offsetY, imgW, imgH);
    const data = ctx.getImageData(offsetX, offsetY, imgW, imgH);
    const d = data.data;
    ctx.clearRect(0, 0, w, h);

    // Count visible sampled pixels
    let count = 0;
    for (let y = 0; y < imgH; y += stride) {
        for (let x = 0; x < imgW; x += stride) {
            if (d[((y * imgW) + x) * 4 + 3] > 128) count++;
        }
    }

    // Allocate flat typed arrays for all particle data
    particleCount = count;
    posX = new Float32Array(count);
    posY = new Float32Array(count);
    baseX = new Float32Array(count);
    baseY = new Float32Array(count);
    density = new Float32Array(count);
    colorR = new Uint8Array(count);
    colorG = new Uint8Array(count);
    colorB = new Uint8Array(count);

    let pi = 0;
    for (let y = 0; y < imgH; y += stride) {
        for (let x = 0; x < imgW; x += stride) {
            const idx = ((y * imgW) + x) * 4;
            if (d[idx + 3] > 128) {
                posX[pi] = x + offsetX;
                posY[pi] = y + offsetY;
                baseX[pi] = x + offsetX;
                baseY[pi] = y + offsetY;
                density[pi] = (Math.random() * 120) + 2;
                colorR[pi] = d[idx];
                colorG[pi] = d[idx + 1];
                colorB[pi] = d[idx + 2];
                pi++;
            }
        }
    }

    imageData = ctx.createImageData(w, h);
    pixels = new Uint32Array(imageData.data.buffer);

    // Assign each particle to a color-based spiral group by hue
    groupId = new Uint8Array(count);
    groupIndex = new Uint32Array(count);
    groupCount = new Uint32Array(N_SPIRALS);
    spiralActive = new Uint8Array(count);

    for (let i = 0; i < count; i++) {
        const hue = rgbToHue(colorR[i], colorG[i], colorB[i]);
        groupId[i] = Math.floor(hue / 360 * N_SPIRALS) % N_SPIRALS;
        const isInner = groupId[i] < 6;
        const threshold = isInner ? INNER_SPIRAL_ACTIVE : OUTER_SPIRAL_ACTIVE;
        spiralActive[i] = Math.random() < threshold ? 1 : 0;
    }
    for (let i = 0; i < count; i++) {
        groupIndex[i] = groupCount[groupId[i]];
        groupCount[groupId[i]]++;
    }

    // Pre-compute Fibonacci spiral target positions
    computeSpiralTargets();
}

function computeSpiralTargets() {
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const n = particleCount;

    spiralX = new Float32Array(n);
    spiralY = new Float32Array(n);

    // Inner ring: groups 0–5, outer ring: groups 6–11
    const INNER_COUNT = Math.floor(N_SPIRALS / 2);
    const innerOrbit = Math.min(w, h) * 0.15;
    const outerOrbit = Math.min(w, h) * 0.87;
    const innerSpiralMax = Math.min(w, h) * 0.30;
    const outerSpiralMax = Math.min(w, h) * 0.62;

    for (let i = 0; i < n; i++) {
        const g = groupId[i];
        const gi = groupIndex[i];
        const gc = groupCount[g] || 1;

        const isInner = g < INNER_COUNT;
        const ringIndex = isInner ? g : g - INNER_COUNT;
        const ringCount = INNER_COUNT;
        const orbit = isInner ? innerOrbit : outerOrbit;
        const maxR = isInner ? innerSpiralMax : outerSpiralMax;
        // Inner ring spins one direction, outer ring spins opposite
        const orbitDir = isInner ? 1 : -1;

        const centerAngle = (ringIndex / ringCount) * Math.PI * 2 + spiralAngleOffset * 0.3 * orbitDir;
        const spiralCX = cx + orbit * Math.cos(centerAngle);
        const spiralCY = cy + orbit * Math.sin(centerAngle);

        const spacing = maxR / Math.sqrt(gc);
        const angle = gi * GOLDEN_ANGLE + spiralAngleOffset * orbitDir;
        const r = spacing * Math.sqrt(gi);

        spiralX[i] = spiralCX + r * Math.cos(angle);
        spiralY[i] = spiralCY + r * Math.sin(angle);
    }
}

function animate() {
    requestAnimationFrame(animate);

    const w = canvas.width;
    const h = canvas.height;
    const mx = mouse.x;
    const my = mouse.y;
    const mRadiusSq = mouse.radius * mouse.radius;
    const maxDist = 60;
    const n = particleCount;
    const dot = DOT_SIZE;
    const isWave = waveMode;
    const isStart = start;
    const isSpiralMode = spiralMode;

    // Advance wave time
    if (isWave) waveTime += WAVE_SPEED;

    // Slowly rotate spiral each frame
    if (isSpiralMode) {
        spiralAngleOffset += SPIRAL_ROTATION_SPEED;
        computeSpiralTargets();
    }

    // Clear pixel buffer to opaque black (ABGR little-endian)
    pixels.fill(0xFF000000);

    for (let i = 0; i < n; i++) {
        let px = posX[i];
        let py = posY[i];

        // Squared-distance avoids Math.sqrt unless particle is near mouse
        const dx = mx - px;
        const dy = my - py;
        const distSq = dx * dx + dy * dy;

        if (distSq < mRadiusSq && distSq > 0.001) {
            const dist = Math.sqrt(distSq);
            let force = (maxDist - dist) / maxDist;
            if (force > 0) {
                const fd = force * density[i] * 0.9;
                px -= (dx / dist) * fd;
                py -= (dy / dist) * fd;
            }
        } else if (isSpiralMode) {
            px -= (px - spiralX[i]) * SPIRAL_LERP;
            py -= (py - spiralY[i]) * SPIRAL_LERP;
        } else if (isStart) {
            const waveOffset = isWave ? WAVE_AMP * Math.sin(baseX[i] * WAVE_FREQ + waveTime) : 0;
            px -= (px - baseX[i]) * PIXEL_RETURN_SPEED;
            py -= (py - (baseY[i] + waveOffset)) * PIXEL_RETURN_SPEED;
        } else {
            if (px < 0 || px >= w) px = Math.random() * w;
            if (py < 0 || py >= h) py = Math.random() * h;
            px += Math.cos(Math.random() * 400) * 6;
            py += Math.cos(Math.random() * 400) * 6;
        }

        posX[i] = px;
        posY[i] = py;

        // Write dot directly into pixel buffer (skip inactive particles in spiral mode)
        if (isSpiralMode && !spiralActive[i]) continue;
        const ix = (px + 0.5) | 0;
        const iy = (py + 0.5) | 0;
        if (ix >= 0 && ix < w && iy >= 0 && iy < h) {
            const color = 0xFF000000 | (colorB[i] << 16) | (colorG[i] << 8) | colorR[i];
            const endRX = Math.min(ix + dot, w);
            const endRY = Math.min(iy + dot, h);
            for (let ry = iy; ry < endRY; ry++) {
                const row = ry * w;
                for (let rx = ix; rx < endRX; rx++) {
                    pixels[row + rx] = color;
                }
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

// Click handler — toggles wander/settle mode and music
window.addEventListener('click', function () {
    start = !start;
    if (shouldStop) {
        music.pause();
        music.currentTime = 0;
        start = true;
        shouldStop = false;
    }
    if (firstClick && !shouldStop) {
        music.play();
        shouldStop = true;
    }
    firstClick = !firstClick;
});

const png = new Image();
png.src = "sundayAfternoon.jpg";

window.addEventListener('load', function () {
    initParticles();
    animate();
});

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    location.reload();
});

window.addEventListener('mouseout', function () {
    mouse.x = -9999;
    mouse.y = -9999;
});

window.addEventListener('keydown', function (event) {
    if (event.key === 'f' || event.key === 'F') {
        spiralMode = !spiralMode;
    }
    if (event.key === 'w' || event.key === 'W') {
        waveMode = !waveMode;
    }
});










