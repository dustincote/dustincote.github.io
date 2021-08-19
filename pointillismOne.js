const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
let start = true;
let firstClick = true;
let shouldStop = false;
let music = new Audio("background1.mp3");
music.onended = function () {
  console.log("music done"),
    (start = true),
    (firstClick = true),
    (shouldStop = false),
    console.log("start is:", start);
};

let mouse = {
  x: null,
  y: null,
  radius: 30,
};
window.addEventListener("mousemove", function (event) {
  mouse.x = event.x + canvas.clientLeft / 2;
  mouse.y = event.y + canvas.clientLeft / 2;
});

function drawImage() {
  let imageWidth = png.width;
  let imageHeight = png.height;
  const data = ctx.getImageData(0, 0, imageWidth * 3, imageHeight * 3);
  console.log(data);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  class particle {
    constructor(x, y, color, size) {
      (this.x = x + (canvas.width / 2 - imageWidth / 2)),
        (this.y = y + (canvas.height / 2 - imageHeight / 2)),
        // this.x = x + (canvas.width / 2 - (imageWidth / 2)) + (Math.cos(Math.random() * 10) * 200),
        //     this.y = y + (canvas.height / 2 - (imageHeight / 2)) + (Math.sin(Math.random() * 10) * 200),
        (this.color = color),
        (this.size = 0.85),
        (this.baseX = x + (canvas.width / 2 - imageWidth / 2)),
        (this.baseY = y + (canvas.height / 2 - imageHeight / 2)),
        (this.density = Math.random() * 120 + 2);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update() {
      ctx.fillStyle = this.color;

      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;

      const maxDistance = 50;
      let force = (maxDistance - distance) / maxDistance;
      if (force < 0) force = 0;

      let directionX = forceDirectionX * force * this.density * 0.9;
      let directionY = forceDirectionY * force * this.density * 0.9;

      if (distance < mouse.radius + this.size) {
        this.x -= directionX;
        this.y -= directionY;
      } else if (start) {
        if (this.x !== this.baseX) {
          let dx = this.x - this.baseX;
          this.x -= dx / 5;
        }
        if (this.y !== this.baseY) {
          let dy = this.y - this.baseY;
          this.y -= dy / 5;
        }
      } else {
        if (this.x < 0) {
          this.x = Math.random() * canvas.width;
        }
        if (this.x > canvas.width) {
          this.x = Math.random() * canvas.width;
        }
        if (this.y < 0) {
          this.y = Math.random() * canvas.height;
        }
        if (this.y > canvas.height) {
          this.y = Math.random() * canvas.height;
        }
        (this.x += Math.cos(Math.random() * 100) / 1.1),
          (this.y += Math.cos(Math.random() * 100) / 1.1);
      }

      this.draw();
    }
  }
  function init() {
    particleArray = [];
    for (let y = 0, y2 = data.height; y < y2; y++) {
      for (let x = 0, x2 = data.width; x < x2; x++) {
        if (data.data[y * 4 * data.width + x * 4 + 3] > 128) {
          let positionX = x;
          let positionY = y;
          let color =
            "rgb(" +
            data.data[y * 4 * data.width + x * 4] +
            "," +
            data.data[y * 4 * data.width + x * 4 + 1] +
            "," +
            data.data[y * 4 * data.width + x * 4 + 2] +
            ")";
          particleArray.push(new particle(positionX, positionY, color));
        }
      }
    }
  }
  function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particleArray.length; i++) {
      particleArray[i].update();
    }
  }
  init();
  animate();

  window.addEventListener("resize", function () {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    location.reload();
  });
}
window.addEventListener("click", function () {
  start = !start;
  console.log("start is:", start);
  if (shouldStop) {
    music.pause(),
      (music.currentTime = 0),
      (start = true),
      (shouldStop = false);
  }
  if (firstClick && !shouldStop) {
    music.play();
    shouldStop = true;
  }
  firstClick = !firstClick;

  console.log("firstClick:", firstClick);
});

const png = new Image();
png.src = "pointillism-4.jpg";

window.addEventListener("load", (event) => {
  console.log("page loaded");
  ctx.drawImage(png, 0, 0);
  drawImage();
});
window.addEventListener("mouseout", function () {
  mouse.x = undefined;
  mouse.y = undefined;
});
