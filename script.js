// SETTINGS
const ROWS = 25;
const COLS = 25;
const TILE_SIZE = 25;

const WIDTH = ROWS * TILE_SIZE;
const HEIGHT = COLS * TILE_SIZE;

// CANVAS
const canvas = document.getElementById("game");
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext("2d");

// SOUNDS
const eatSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-arcade-bonus-alert-767.mp3");
const gameOverSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-player-losing-or-failing-2042.mp3");

// TILE CLASS
class Tile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// GAME STATE
let snake, food, snakeBody, velocityX, velocityY, score, gameOver;
let speed, gameLoop;

// INIT
function initGame() {
  snake = new Tile(5 * TILE_SIZE, 5 * TILE_SIZE);
  food = new Tile(10 * TILE_SIZE, 10 * TILE_SIZE);
  snakeBody = [];
  velocityX = 0;
  velocityY = 0;
  score = 0;
  gameOver = false;
  speed = 150;

  document.getElementById("gameOverScreen").style.display = "none";

  clearInterval(gameLoop);
  gameLoop = setInterval(draw, speed);
}

initGame();

// CONTROLS (KEYBOARD)
document.addEventListener("keydown", e => {
  if (gameOver) return;

  if (e.key === "ArrowUp" && velocityY !== 1) {
    velocityX = 0; velocityY = -1;
  }
  if (e.key === "ArrowDown" && velocityY !== -1) {
    velocityX = 0; velocityY = 1;
  }
  if (e.key === "ArrowLeft" && velocityX !== 1) {
    velocityX = -1; velocityY = 0;
  }
  if (e.key === "ArrowRight" && velocityX !== -1) {
    velocityX = 1; velocityY = 0;
  }
});

// MOBILE CONTROLS
function setDirection(x, y) {
  if (gameOver) return;
  velocityX = x;
  velocityY = y;
}

// GAME LOGIC
function move() {
  if (gameOver) return;

  // WALL COLLISION
  if (
    snake.x < 0 || snake.x >= WIDTH ||
    snake.y < 0 || snake.y >= HEIGHT
  ) {
    endGame();
    return;
  }

  // BODY COLLISION
  for (let tile of snakeBody) {
    if (snake.x === tile.x && snake.y === tile.y) {
      endGame();
      return;
    }
  }

  // FOOD COLLISION
  if (snake.x === food.x && snake.y === food.y) {
    snakeBody.push(new Tile(food.x, food.y));
    food.x = Math.floor(Math.random() * COLS) * TILE_SIZE;
    food.y = Math.floor(Math.random() * ROWS) * TILE_SIZE;
    score++;
    eatSound.play();

    if (speed > 60) {
      speed -= 5;
      clearInterval(gameLoop);
      gameLoop = setInterval(draw, speed);
    }
  }

  // MOVE BODY
  for (let i = snakeBody.length - 1; i >= 0; i--) {
    if (i === 0) {
      snakeBody[i].x = snake.x;
      snakeBody[i].y = snake.y;
    } else {
      snakeBody[i].x = snakeBody[i - 1].x;
      snakeBody[i].y = snakeBody[i - 1].y;
    }
  }

  // MOVE HEAD
  snake.x += velocityX * TILE_SIZE;
  snake.y += velocityY * TILE_SIZE;
}

// DRAW
function draw() {
  move();
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // FOOD
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, TILE_SIZE, TILE_SIZE);

  // SNAKE
  ctx.fillStyle = "lime";
  ctx.fillRect(snake.x, snake.y, TILE_SIZE, TILE_SIZE);
  for (let tile of snakeBody) {
    ctx.fillRect(tile.x, tile.y, TILE_SIZE, TILE_SIZE);
  }

  // SCORE
  ctx.fillStyle = "white";
  ctx.font = "14px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);
}

// GAME OVER
function endGame() {
  gameOver = true;
  gameOverSound.play();
  clearInterval(gameLoop);

  document.getElementById("finalScore").innerText = `Final Score: ${score}`;
  document.getElementById("gameOverScreen").style.display = "flex";
}

// RESTART
function restartGame() {
  initGame();
}

// SCORE STORAGE
function saveScore() {
  const name = document.getElementById("playerName").value || "Player";
  let scores = JSON.parse(localStorage.getItem("snakeScores")) || [];

  scores.push({ name, score });
  scores.sort((a, b) => b.score - a.score);
  scores = scores.slice(0, 5);

  localStorage.setItem("snakeScores", JSON.stringify(scores));
  displayScores();
}

// DISPLAY SCORES
function displayScores() {
  const list = document.getElementById("scoreList");
  list.innerHTML = "";

  const scores = JSON.parse(localStorage.getItem("snakeScores")) || [];
  scores.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.name}: ${s.score}`;
    list.appendChild(li);
  });
}

displayScores();