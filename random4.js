const canvas = document.getElementById("canvas4");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let stopDraw = true;
const startColor = document.getElementById("startColor");
const numberOfColors = document.getElementById("colorNumbers");
const numberOfColorsText = document.getElementById("numberOfColors");
const edgeInput = document.getElementById("edge");
const particleScaleInput = document.getElementById("particleScale");
numberOfColorsText.innerHTML = numberOfColors.value;
let numberToAdd = 360 / numberOfColors.value;
const hueNumber = document.getElementById("hueNumber");
hueNumber.innerHTML = startColor.value;
const clearCanvas = document.getElementById("clear");
const welcome = document.getElementById("welcome");
const menuButton = document.getElementById("menuButton");
const menu = document.getElementById("menu");
let shouldShowMenu = true;
let numberOfActiveParticles = 0;

numberOfColors.oninput = () => {
  numberOfColorsText.innerHTML = numberOfColors.value;
  numberToAdd = 360 / numberOfColors.value;
  console.log(numberToAdd);
};

function showMenu() {
  menu.classList.toggle("hide");
}
menuButton.addEventListener("click", showMenu);

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
document.getElementById("export").addEventListener("click", exportPicture);
const startButton = document.getElementById("start");
startButton.addEventListener("click", changeStart);
startButton.innerHTML = "Start Drawing";

function changeStart() {
  welcome.remove();
  stopDraw = !stopDraw;
  startButton.innerHTML = stopDraw ? "Start Drawing" : "Stop Drawing";
  console.log(startButton.innerHTML);
}
// ctx.globalCompositeOperation = "destination-over";

let edge = Number(edgeInput.value);
let particleScale = Number(particleScaleInput.value);
let color = Number(startColor.value);
let saturation = 100;
let hue = 50;
let drawing = false;
let shouldClearText = true;
startColor.oninput = () => {
  (hueNumber.innerHTML = startColor.value), (color = Number(startColor.value));
};

edgeInput.oninput = (e) => {
  edge = Number(e.target.value);
  edgeNumber.innerHTML = e.target.value;
};
particleScaleInput.oninput = (e) => {
  particleScale = Number(e.target.value);
  particleScaleNumber.innerHTML = e.target.value;
};

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
    this.particleScaleInner = Math.random() * 65 + 30;
    this.edgeInner = Math.random() * 400 + 100;
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
    // edge=Math.random()*300 + 75;
    // particleScale=Math.random()*300;
    // a decaying particle size, for fun
    const radius =
      ((-distance / this.edgeInner + 1) * this.edgeInner) /
      this.particleScaleInner;

    if (radius > 0) {
      requestAnimationFrame(this.draw); // use .bind if not using arrow functions
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = `hsl(${this.color}, ${this.saturation}%, ${this.hue}%  )`;
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.stroke();
    } else {
      let reDrawNumber = Math.random();
      if (reDrawNumber > 0.93) {
        reSpawn(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight
        );
      }
      numberOfActiveParticles--;
    }
  };
}

const doArt = (event) => {
  const x = event.offsetX || event.layerX || event.x;
  const y = event.offsetY || event.layerY || event.y;
  for (let i = 0; i < Math.random() * 10 + 1; i++) {
    const root = new Root(x, y, color, hue, saturation, x, y);
    root.draw();
    numberOfActiveParticles++;
  }
  console.log(numberOfActiveParticles);
};

const reSpawn = (x, y) => {
  color += Number(numberToAdd);
  if (color > 359) {
    color = color - 360;
  }
  // console.log(color)
  if (numberOfActiveParticles < 1000) {
    for (let i = 0; i < Math.random() * 20 + 1; i++) {
      const root = new Root(x, y, color, hue, saturation, x, y);
      root.draw();
      numberOfActiveParticles++;
    }
  }
  console.log(numberOfActiveParticles);
};

const spawn = (x, y, initialColor) => {
  console.log(x, y);
  for (let i = 0; i < Math.random() * 20 + 1; i++) {
    const root = new Root(x, y, initialColor, hue, saturation, x, y);
    root.draw();
    numberOfActiveParticles++;
  }
  console.log(numberOfActiveParticles);
};

const randomDrawing = () => {
  color = Math.floor(Math.random() * 359);
  randNumberOfColors = Math.floor(Math.random() * 3) + 1;
  numberToAdd = 360 / randNumberOfColors;
  let randX = Math.random() * window.innerWidth;
  let randY = Math.random() * window.innerHeight;
  for (let i = 0; i < Math.random() * 500; i++) {
    if (i < 2) {
      spawn(randX + i, randY + i, color);
      randX++;
      randY++;
    } else {
      setTimeout(() => {
        spawn(randX + i, randY + i, color);
      }, i * 250);
      randX++;
      randY++;
    }
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
  color += Number(numberToAdd);
  if (color > 359) {
    color = color - 360;
  }
  // console.log(color)
  if (shouldClearText) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shouldClearText = false;
  }
});
clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
window.addEventListener("mouseup", () => (drawing = false));
