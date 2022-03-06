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
let shouldShowMenu = false;
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
    this.direction = Math.random() * 10;
    // this.speedX = this.direction > .52 ? (Math.random()-.5)/2:this.direction > .48 ? (Math.random()-.5)/2:0
    // this.speedY = this.direction < .48 ? (Math.random()-.5)/2:this.direction < .52 ? (Math.random()-.5)/2:0
    this.speedX = Math.random() - 0.5;
    this.speedY = Math.random() - 0.5;
    this.centerX = centerX;
    this.centerY = centerY;
    this.particleScaleInner = Math.random() * 65 + 30;
    this.edgeInner = Math.random() * 1200 + 100;
    this.radius = 0;
  }

  // THIS HAS TO BE AN ARROW FUNCTION :)
  draw = () => {
    // this.saturation -= 0.1;
    if (this.hue > 10) {
      this.hue -= 0.2;
    }
    this.speedX += this.calculateSpeedX();
    this.speedY += this.calculateSpeedY();
    this.x += Math.cos(this.speedX);
    this.y += Math.sin(this.speedY);

    const distX = this.x - this.centerX;
    const distY = this.y - this.centerY;
    const distance = Math.sqrt(distX ** 2 + distY ** 2);
    // edge=Math.random()*300 + 75;
    // particleScale=Math.random()*300;
    // a decaying particle size, for fun
    const radius =
      ((-distance / this.edgeInner + 1) * this.edgeInner) /
      this.particleScaleInner;

    if (radius > this.radius && this.radius > 0) {
      if (this.hue < 55) {
        this.hue += 2;
      }
    }

    this.radius = radius;
    this.direction -= 0.03;

    if (radius > 0) {
      requestAnimationFrame(this.draw); // use .bind if not using arrow functions
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = `hsl(${this.color}, ${this.saturation}%, ${this.hue}%  )`;
      ctx.fill();
      ctx.lineWidth = 0.7;
      ctx.strokeStyle = "black";
      ctx.stroke();
    } else {
      let reDrawNumber = Math.random();
      if (reDrawNumber > 0.85) {
        reSpawn(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight
        );
      }
      numberOfActiveParticles--;
      console.log("number of particles still going:", numberOfActiveParticles);
      if (numberOfActiveParticles === 0)
        alert("drawing is now finished please choose download as png in menu");
    }
  };
  calculateSpeedX = () => {
    if (this.x < 0) {
      return (this.x += Math.abs((Math.random() - 0.5) / 25));
    }
    if (this.x > window.innerWidth) {
      return (this.x -= Math.abs((Math.random() - 0.5) / 25));
    }
    return (Math.random() - 0.5) / 2;
  };
  calculateSpeedY = () => {
    if (this.y < 0) {
      return (this.y += Math.abs((Math.random() - 0.5) / 25));
    }
    if (this.y > window.innerHeight) {
      return (this.y -= Math.abs((Math.random() - 0.5) / 25));
    }
    return (Math.random() - 0.5) / 2;
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
    for (let i = 0; i < Math.random() * 4 + 1; i++) {
      const root = new Root(x, y, color, hue, 100, x, y);
      root.draw();
      numberOfActiveParticles++;
    }
  }
  console.log(numberOfActiveParticles);
};

const spawn = (x, y, initialColor) => {
  for (let i = 0; i < Math.random() * 4 + 1; i++) {
    const root = new Root(x, y, initialColor, hue, saturation, x, y);
    root.draw();
    numberOfActiveParticles++;
  }
  console.log(numberOfActiveParticles);
};

const randomDrawing = () => {
  if (startColor.value === 0) {
    color = Math.floor(Math.random() * 359);
    randNumberOfColors = Math.floor(Math.random() * 5) + 1;
    numberToAdd = 360 / randNumberOfColors;
  }
  for (let i = 0; i < getNumberOfParticlesToCreate(); i++) {
    let randX = Math.random() * window.innerWidth;
    let randY = Math.random() * window.innerHeight;
    if (i < 2) {
      spawn(randX, randY, color);
    } else {
      setTimeout(() => {
        spawn(randX, randY, color);
      }, i * 200);
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
  // if(shouldClearText){
  //     ctx.clearRect(0,0,canvas.width, canvas.height)
  //     shouldClearText = false;
  // }
});
clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
window.addEventListener("mouseup", () => (drawing = false));

function getNumberOfParticlesToCreate() {
  return 1;
  //Math.random() * 25
}
