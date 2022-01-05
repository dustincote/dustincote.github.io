const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const resolution = 15;
const width = Math.floor(window.innerWidth - (window.innerWidth % resolution));
const height = Math.floor(
  window.innerHeight - (window.innerHeight % resolution)
);

const playButton = document.getElementById("play");
const stopButton = document.getElementById("stop");
const clearButton = document.getElementById("clear");
const randomButton = document.getElementById("random");
const nextButton = document.getElementById("next");

playButton.addEventListener("click", playAnimation);
stopButton.addEventListener("click", stopAnimation);
clearButton.addEventListener("click", clearBoard);
randomButton.addEventListener("click", randomGrid);
nextButton.addEventListener("click", nextGrid);

function playAnimation() {
  play = true;
  getNextGeneration();
}

function stopAnimation() {
  play = false;
}

function clearBoard() {
  play = false;
  grid = getGrid(false);
  renderGrid();
}
function randomGrid() {
  play = false;
  grid = getGrid(true);
  renderGrid();
}
function nextGrid() {
  play = false;
  getNextGeneration();
}

console.log("width,height:", width, height);
canvas.width = width;
canvas.height = height;
let grid = getGrid(true);
console.log(grid);
let play = false;

function getGrid(random) {
  let arr = [];
  for (let i = 0; i < height / resolution; i++) {
    let innerArr = [];
    for (let j = 0; j < width / resolution; j++) {
      if (random) {
        innerArr.push(Math.floor(Math.random() * 2));
      } else {
        innerArr.push(0);
      }
    }
    arr.push(innerArr);
  }
  return arr;
}

function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  let row = Math.floor(y / resolution);
  let col = Math.floor(x / resolution);
  if (grid[row][col] === 0) {
    grid[row][col] = 1;
  } else {
    grid[row][col] = 0;
  }

  renderGrid();
  console.log("x: " + x + " y: " + y + `Row: ${row}, col:${col}`);
}

canvas.addEventListener("mousedown", function (e) {
  getCursorPosition(canvas, e);
});

function renderGrid() {
  ctx.clearRect(0, 0, width, height);
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      ctx.beginPath();
      ctx.rect(x * resolution, y * resolution, resolution, resolution);
      ctx.strokeStyle = "grey";
      ctx.lineWidth = 0.4;
      if (grid[y][x] === 1) {
        ctx.fill();
      }
      ctx.stroke();
    }
  }
}

function getNextGeneration() {
  let nextGen = [];
  for (let y = 0; y < grid.length; y++) {
    let row = [];
    for (let x = 0; x < grid[y].length; x++) {
      // console.log("reset neightbors");
      let neighbors = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (
            y + i >= 0 &&
            x + j >= 0 &&
            y + i <= height / resolution - 1 &&
            x + j <= width / resolution - 1
          ) {
            if (i === 0 && j === 0) {
              neighbors += 0;
            } else {
              // console.log("y:", y, "x:", x, "i:", i, "j:", j);
              neighbors += grid[y + i][x + j];
            }
          }
        }
      }
      // console.log(neighbors);
      if (neighbors < 2) {
        row.push(0);
      } else if (neighbors > 3) {
        row.push(0);
      } else if (neighbors === 3) {
        row.push(1);
      } else {
        row.push(grid[y][x]);
      }
    }
    nextGen.push(row);
  }
  // console.log(nextGen);
  // console.log(grid);
  grid = nextGen;
  renderGrid();
  if (play) {
    setTimeout(() => {
      getNextGeneration();
    }, 100);
  }
}
renderGrid();
