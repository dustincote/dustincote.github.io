const canvas = document.getElementById("canvas4");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let stopDraw = true;
const startColor = document.getElementById('startColor');
const numberOfColors = document.getElementById('colorNumbers');
const numberOfColorsText = document.getElementById('numberOfColors');
numberOfColorsText.innerHTML = numberOfColors.value
let numberToAdd = 360/numberOfColors.value
const hueNumber = document.getElementById('hueNumber');
hueNumber.innerHTML= startColor.value;
const clearCanvas = document.getElementById('clear');
const welcome = document.getElementById('welcome');
const menuButton = document.getElementById('menuButton');
const menu = document.getElementById('menu');
let shouldShowMenu = true;

numberOfColors.oninput = () => {
    numberOfColorsText.innerHTML = numberOfColors.value;
    numberToAdd = 360/numberOfColors.value;
    console.log(numberToAdd);
}

function showMenu (){
   menu.classList.toggle('hide');
}
menuButton.addEventListener('click', showMenu);


function exportPicture() {
    // IE/Edge support (png only)
    if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(canvas.msToBlob(), "generative-art.png");
    } else {
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = canvas.toDataURL();
        a.download = "generative-art.png";
        a.click();
        document.body.removeChild(a);
    }

}
document.getElementById('export').addEventListener('click', exportPicture);
const startButton = document.getElementById('start')
startButton.addEventListener('click', changeStart);
startButton.innerHTML = ('Start Drawing')

function changeStart(){
    welcome.remove();
    stopDraw = !stopDraw
    startButton.innerHTML = stopDraw? 'Start Drawing' : 'Stop Drawing' 
    console.log(startButton.innerHTML)
}
// ctx.globalCompositeOperation = "destination-over";

const edge = 300;
const particleScale = 50;
let color = Number(startColor.value);
let saturation = 100;
let hue = 50;
let drawing = false;
let shouldClearText = true;
startColor.oninput = () => { hueNumber.innerHTML = startColor.value, color= Number(startColor.value) }

// let particleArray = [];
// const mouse = {
//     x: null,
//     y: null,
//     radius: 40
// }
// ctx.fillStyle = 'white';
// ctx.font = '30px Verdana';
// ctx.fillText('Welcome to the DIY Generative Art.', 100,100);
// ctx.fillText('To make art simply hold your mouse button down and move the mouse.', 100, 150);
// ctx.fillText('each time you release mouse and click again the objects will be a different color.', 100, 200);
// ctx.fillText('click the mouse once to remove this message.', 100, 250);
// const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);

// class Particle {
//     constructor(x, y) {
//         this.x = x;
//         this.y = y;
//         this.size = 2;
//         this.baseX = x;
//         this.baseY = y;
//         this.density = (Math.random() * 30) + 1;
//     }
//     draw() {
//         ctx.fillStyle = 'white';
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
//         ctx.closePath();
//         ctx.fill();
//     }
//     update() {
//         let dx = mouse.x - this.x;
//         let dy = mouse.y - this.y;
//         let distance = Math.sqrt(dx * dx + dy * dy);
//         let forceDirectionX = dx / distance;
//         let forceDirectionY = dy / distance;
//         let maxDistance = mouse.radius;
//         let force = (maxDistance - distance) / maxDistance;
//         let directionX = forceDirectionX * force * this.density;
//         let directionY = forceDirectionY * force * this.density;
//         if (distance < mouse.radius + this.size) {
//             this.x -= directionX;
//             this.y -= directionY;
//         } else {
//             if (this.x !== this.baseX) {
//                 let dx = this.x - this.baseX;
//                 this.x -= dx / 10;
//             }
//             if( this.y !== this.baseY){
//                 let dy = this.y - this.baseY;
//                 this.y -= dy/10;
//             }
//         }
//     }
// }

// function init() {
//     particleArray = [];
//     for(let y = 0, y2= textCoordinates.height; y< y2; y++){
//         for( let x = 0, x2 = textCoordinates.width; x< x2; x++){

//         }
//     }
// }
// init();

// function animate() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     for (particle of particleArray) {
//         particle.draw();
//     }
// }


class Root {
    constructor(x, y, color, hue, saturation, centerX, centerY) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.hue = hue;
        this.saturation = saturation;
        this.speedX = 0;
        this.speedY = 0;
        this.centerX = centerX;
        this.centerY = centerY;
    }

    // THIS HAS TO BE AN ARROW FUNCTION :)
    draw = () => {
        this.saturation -= 0.2;
        this.hue += 0.02;
        this.speedX += (Math.random() - 0.5) / 2;
        this.speedY += (Math.random() - 0.5) / 2;
        this.x += this.speedX;
        this.y += this.speedY;

        const distX = this.x - this.centerX;
        const distY = this.y - this.centerY;
        const distance = Math.sqrt(distX ** 2 + distY ** 2);

        // a decaying particle size, for fun
        const radius = ((-distance / edge + 1) * edge) / particleScale;

        if (radius > 0) {
            requestAnimationFrame(this.draw); // use .bind if not using arrow functions
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = `hsl(${this.color}, ${this.saturation}%, ${this.hue}%  )`;
            ctx.fill();
            ctx.strokeStyle = "black";
            ctx.stroke();
        }
    };
}

const doArt = (event) => {
    const x = event.offsetX || event.layerX || event.x;
    const y = event.offsetY || event.layerY || event.y;
    for (let i = 0; i < 2; i++) {
        const root = new Root(x, y, color, hue, saturation, x, y);
        root.draw();
    }
};

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// window.addEventListener("click", doArt);

window.addEventListener("mousemove", (event) => {

    if (!drawing || stopDraw) return;
    // ctx.fillStyle = 'rgba(0, 0, 255, 0.03)';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    doArt(event);
});

window.addEventListener("mousedown", () => {
    drawing = true; 
    color += Number(numberToAdd)
    if(color > 359){ color = color - 360}
    console.log(color)
    if(shouldClearText){
        ctx.clearRect(0,0,canvas.width, canvas.height)
        shouldClearText = false;
    }
});
clearCanvas.addEventListener('click', ()=> {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
})
window.addEventListener("mouseup", () => (drawing = false));
