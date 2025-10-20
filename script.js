let score = 0;
let waterSaved = 0;
let timeLeft = 150;
let carryingWater = false;
let direction = 1;
let jeffSpeed = 3;
let totalMiles = 0;
let isJumping = false;
let timer = null;

const jeff = document.getElementById("jeff");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const waterDisplay = document.getElementById("waterSaved");
const progressBar = document.getElementById("progressBar");
const collectSound = document.getElementById("collectSound");
const loseSound = document.getElementById("loseSound");
const difficultySelect = document.getElementById("difficulty");
const startButton = document.getElementById("startGame");

let jeffX = 150;

function setDifficulty(level) {
  switch (level) {
    case "easy":
      jeffSpeed = 2;
      timeLeft = 200;
      break;
    case "normal":
      jeffSpeed = 3;
      timeLeft = 150;
      break;
    case "hard":
      jeffSpeed = 4.5;
      timeLeft = 100;
      break;
  }
  timeDisplay.textContent = timeLeft;
}

// Jump
function jump() {
  if (isJumping) return;
  isJumping = true;
  jeff.classList.add("jump");
  setTimeout(() => {
    jeff.classList.remove("jump");
    setTimeout(() => (isJumping = false), 200);
  }, 700);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") jump();
});

function isColliding(aX, bX, bWidth) {
  return aX + 60 > bX && aX < bX + bWidth;
}

function startGame() {
  score = 0;
  waterSaved = 0;
  totalMiles = 0;
  jeffX = 150;
  carryingWater = false;
  direction = 1;

  setDifficulty(difficultySelect.value);

  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert(`Time's up! Jeff traveled ${totalMiles} miles and saved ${waterSaved}% of the water!`);
      location.reload();
    }
  }, 1000);

  update();
}

startButton.addEventListener("click", startGame);

function update() {
  jeffX += jeffSpeed * direction;
  jeff.style.left = jeffX + "px";
  jeff.style.transform = direction === 1 ? "scaleX(1)" : "scaleX(-1)";

  const waterSourceX = 50;
  const bucketX = window.innerWidth - 200;
  const obstacles = document.querySelectorAll(".obstacle");

  // Collect water
  if (direction === -1 && jeffX <= waterSourceX + 20) {
    if (!carryingWater) {
      carryingWater = true;
      score += 10;
      scoreDisplay.textContent = score;
      collectSound.play();
    }
    direction = 1;
  }

  // Drop water into bucket
  if (direction === 1 && jeffX >= bucketX) {
    if (carryingWater) {
      carryingWater = false;
      score += 20;
      waterSaved += 10;
      totalMiles += 100;
      scoreDisplay.textContent = score;
      waterDisplay.textContent = waterSaved + "%";
      progressBar.style.height = Math.min(waterSaved, 100) + "%";

      if (waterSaved === 50) alert("Halfway there! Keep saving water! 💧");
      if (waterSaved >= 100) alert("Amazing! You’ve filled the well completely! 🪣");
    }
    direction = -1;
  }

  // Obstacle collisions
  if (!isJumping) {
    obstacles.forEach((obs) => {
      const obsX = parseInt(obs.style.left);
      if (isColliding(jeffX, obsX, 60)) {
        if (carryingWater) {
          carryingWater = false;
          score -= 10;
          loseSound.play();
          scoreDisplay.textContent = score;
        }
      }
    });
  }

  requestAnimationFrame(update);
}
