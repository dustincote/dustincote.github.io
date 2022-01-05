const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;
let particleArray2 = [];
let start = false;
let shouldStopMusic = false;
let firstClick = true;
let secondClick = false;
let touchEvent = "ontouchstart" in window ? "touchstart" : "dblclick";
let shouldRunRick = true;
let music = new Audio("NeverGonnaGiveYouUpOriginal.mp3");
music.onended = function () {
  console.log("music done"),
    (start = false),
    (firstClick = false),
    (shouldStopMusic = false),
    (secondClick = true),
    console.log("start is:", start);
  ctx2.fillStyle = "rgba(0,0,0,1)";
  ctx2.fillRect(0, 0, innerWidth, innerHeight);
  for (let i = 0; i < particleArray2.length; i++) {
    let pixel = particleArray2[i];
    pixel.x = Math.random() * canvas2.width;
    pixel.y = Math.random() * canvas2.height;
    pixel.update();
  }
  shouldRunBackground = true;
  shouldRunRick = false;
  animate();
};
let mouse2 = {
  x: null,
  y: null,
  radius: 30,
};
// window.addEventListener("mousemove", function (event) {
//   mouse2.x = event.x + canvas2.clientLeft / 2;
//   mouse2.y = event.y + canvas2.clientLeft / 2;
// });

function drawImage() {
  let imageWidth = png.width;
  let imageHeight = png.height;
  const data = ctx2.getImageData(0, 0, imageWidth * 3, imageHeight * 3);
  console.log(data);
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

  class particle {
    constructor(x, y, color, size) {
      // this.x = Math.random() * canvas2.width * 1.2,
      //     this.y = Math.random() * canvas2.height * 1.2,
      (this.x = x + Math.random() - 0.5 * canvas2.width),
        (this.y = y + Math.random() - 0.5 * canvas2.height),
        (this.color = color),
        (this.size = 0.8),
        (this.baseX = x + (canvas2.width / 2 - imageWidth / 2)),
        (this.baseY = y + (canvas2.height / 1.3 - imageHeight / 1.3)),
        (this.density = Math.random() * 120 + 2);
    }
    draw() {
      ctx2.beginPath();
      ctx2.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx2.closePath();
      ctx2.fill();
    }

    update() {
      ctx2.fillStyle = this.color;

      let dx = mouse2.x - this.x;
      let dy = mouse2.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;

      const maxDistance = 500;
      let force = (maxDistance - distance) / maxDistance;
      if (force < 0) force = 0;

      let directionX = forceDirectionX * force * this.density * 0.9;
      let directionY = forceDirectionY * force * this.density * 0.9;

      if (distance < mouse2.radius + this.size) {
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
          this.x = Math.random() * canvas2.width;
        }
        if (this.x > canvas2.width) {
          this.x = Math.random() * canvas2.width;
        }
        if (this.y < 0) {
          this.y = Math.random() * canvas2.height;
        }
        if (this.y > canvas2.height) {
          this.y = Math.random() * canvas2.height;
        }
        (this.x += Math.cos(Math.random() * 200) * (Math.random() * 5)),
          (this.y += Math.cos(Math.random() * 200) * (Math.random() * 5));
      }

      this.draw();
    }
  }
  function init() {
    particleArray2 = [];
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
          particleArray2.push(new particle(positionX, positionY, color));
        }
      }
    }
    for (let i = 0; i < particleArray2.length; i++) {
      particleArray2[i].update();
    }
  }

  init();
  // runRick();

  window.addEventListener("resize", function () {
    canvas2.width = innerWidth;
    canvas2.height = innerHeight;
    location.reload();
  });
}

function runRick() {
  if (shouldRunRick) {
    ctx2.fillStyle = "rgba(0,0,0,1)";
    ctx2.fillRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particleArray2.length; i++) {
      particleArray2[i].update();
    }
    requestAnimationFrame(runRick);
  }
}
// window.addEventListener(touchEvent, function(){
//     if (secondClick) {
//         console.log('second click running')
//         music.play();
//         start = !start;
//         secondClick = false;
//         setTimeout(() => {
//             shouldStopMusic=true
//         }, 50);
//     }
//     if(shouldStopMusic){music.pause(), music.currentTime=0, secondClick = true, start = !start, shouldStopMusic=false, console.log('music stopped') }

//     if(firstClick){
//         start = !start;
//         setTimeout((event) => {
//             console.log('trying to play', start, 'what the heck')
//             music.play();
//             start = !start;
//             firstClick = false;
//         }, 2200);
//         shouldStopMusic = true;
//     }
//     console.log('shouldStop', shouldStopMusic);
// })

const png = new Image();
png.src = "rickAstley.png";

window.addEventListener("load", (event) => {
  console.log("page loaded");
  ctx2.drawImage(png, 0, 0);
  drawImage();
});

function rickRoll() {
  shouldRunRick = true;
  shouldRunBackground = false;
  music.play();
  runRick();
  start = !start;
  setTimeout((event) => {
    console.log("trying to play", start, "what the heck");
    start = !start;
    firstClick = false;
  }, 10000);
  shouldStopMusic = true;
}
// a key map of allowed keys
var allowedKeys = {
  ArrowLeft: "ArrowLeft",
  ArrowUp: "ArrowUp",
  ArrowRight: "ArrowRight",
  ArrowDown: "ArrowDown",
  a: "a",
  b: "b",
};

// the 'official' Konami Code sequence
var konamiCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

// a variable to remember the 'position' the user has reached so far.
var konamiCodePosition = 0;

// add keydown event listener
document.addEventListener("keydown", function (e) {
  console.log(e.key);
  // get the value of the key code from the key map
  var key = allowedKeys[e.key];
  // get the value of the required key from the konami code
  var requiredKey = konamiCode[konamiCodePosition];

  // compare the key with the required key
  if (key == requiredKey) {
    console.log("One key closer to the secret");
    // move to the next key in the konami code sequence
    konamiCodePosition++;

    // if the last key is reached, activate cheats
    if (konamiCodePosition == konamiCode.length) {
      rickRoll();
      konamiCodePosition = 0;
    }
  } else {
    console.log("oops try again");
    konamiCodePosition = 0;
  }
});
