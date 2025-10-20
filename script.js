// Game state
let score = 0;
let waterSaved = 0;
let timeLeft = 150;
let carryingWater = false;
let direction = 1; // 1 = right, -1 = left
let jeffSpeed = 3; // controls auto movement
let distance = 0; // track "miles"
let totalMiles = 0;

const jeff = document.getElementById("jeff");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const waterDisplay = document.getElementById("waterSaved");
const obstacles = document.querySelectorAll(".obstacle");

let jeffX = 150;
let jeffY = 60;

// Timer countdown
const timer = setInterval(() => {
  timeLeft--;
  timeDisplay.textContent = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timer);
    alert(`Time's up! Jeff traveled ${totalMiles} miles and saved ${waterSaved}% of the water!`);
  }
}, 1000);

// Collision detection helper
function isColliding(aX, aY, bX, bWidth) {
  return aX + 60 > bX && aX < bX + bWidth && Math.abs(aY - 60) < 30;
}

// Main game loop
function update() {
  // Move Jeff automatically
  jeffX += jeffSpeed * direction;
  distance += Math.abs(jeffSpeed) / 2;

  // Flip Jeff visually depending on direction
  jeff.style.transform = direction === 1 ? "scaleX(1)" : "scaleX(-1)";

  // Boundaries and direction changes
  const waterSourceX = 80;
  const bucketX = window.innerWidth - 200;

  // Hit water source
  if (direction === -1 && jeffX <= waterSourceX + 20) {
    if (!carryingWater) {
      carryingWater = true;
      score += 10;
      scoreDisplay.textContent = score;
    }
    direction = 1; // go right
  }

  // Hit bucket
  if (direction === 1 && jeffX >= bucketX) {
    if (carryingWater) {
      carryingWater = false;
      score += 20;
      waterSaved += 10;
      totalMiles += 100;
      scoreDisplay.textContent = score;
      waterDisplay.textContent = waterSaved + "%";
    }
    direction = -1; // go back left
  }

  // Collision with obstacles
  obstacles.forEach((obs) => {
    const obsX = parseInt(obs.style.left);
    if (isColliding(jeffX, jeffY, obsX, 60)) {
      if (carryingWater) {
        carryingWater = false;
        score -= 10;
        scoreDisplay.textContent = score;
      }
    }
  });

  // Update Jeff’s position
  jeff.style.left = jeffX + "px";

  requestAnimationFrame(update);
}

update();
