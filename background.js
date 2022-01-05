const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let shouldRunBackground = true;

let particleArray = [];

let mouse = {
  x: null,
  y: null,
  radius: canvas.width / 50,
};
// window.addEventListener("mousemove", function (event) {
//   mouse.x = event.x;
//   mouse.y = event.y;
// });

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = "rgba(224, 211, 243,1)";
    ctx.fill();
  }

  update() {
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.width || this.y < 0) {
      this.directionY = -this.directionY;
    }

    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
        this.x += 2;
      }
      if (mouse.x > this.x && this.x > this.size * 10) {
        this.x -= 2;
      }
      if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
        this.y += 2;
      }
      if (mouse.y > this.y && this.y > this.size * 10) {
        this.y -= 2;
      }
    }
    this.x += this.directionX;
    this.y += this.directionY;

    this.draw();
  }
}

function init() {
  particleArray = [];
  let numberOfParticles = (canvas.height * canvas.width) / 10000;
  for (let i = 0; i < numberOfParticles; i++) {
    let size = Math.random() * 3 + 2;
    let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
    let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
    let directionX = Math.random() * 2 - 1;
    let directionY = Math.random() * 2 - 1;
    let color = "white";

    particleArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

function animate() {
  if (shouldRunBackground) {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (particle of particleArray) {
      particle.update();
    }
    connect();
  }
}

function clearBackground() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
}

function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particleArray.length; a++) {
    for (let b = a; b < particleArray.length; b++) {
      let distance =
        (particleArray[a].x - particleArray[b].x) *
          (particleArray[a].x - particleArray[b].x) +
        (particleArray[a].y - particleArray[b].y) *
          (particleArray[a].y - particleArray[b].y);
      if (distance < (canvas.width / 5) * (canvas.height / 5)) {
        opacityValue = 1 - distance / 15000;
        ctx.strokeStyle = `rgba(230, 243, 211, ${opacityValue})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particleArray[a].x, particleArray[a].y);
        ctx.lineTo(particleArray[b].x, particleArray[b].y);
        ctx.stroke();
      }
    }
  }
}

init();
animate();

window.addEventListener("resize", function () {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  location.reload();
});

window.addEventListener("mouseout", function () {
  mouse.x = undefined;
  mouse.y = undefined;
});
