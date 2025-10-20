// Game state
let score = 0;
let waterSaved = 0;
let timeLeft = 150;
let carryingWater = false;

const jeff = document.getElementById("jeff");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const waterDisplay = document.getElementById("waterSaved");

let jeffX = 150;
let jeffY = 60;
let velocityY = 0;
let gravity = 0.6;
let jumping = false;

// Timer countdown
const timer = setInterval(() => {
  timeLeft--;
  timeDisplay.textContent = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timer);
    alert("Time's up! Jeff saved " + waterSaved + "% of the water!");
  }
}, 1000);

// Controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") jeffX += 20;
  if (e.key === "ArrowLeft") jeffX -= 20;
  if (e.key === " " && !jumping) {
    velocityY = 10;
    jumping = true;
  }
});

// Game loop
function update() {
  // Jump physics
  if (jumping) {
    jeffY += velocityY;
    velocityY -= gravity;
    if (jeffY <= 60) {
      jeffY = 60;
      jumping = false;
    }
  }

  // Update Jeff’s position
  jeff.style.left = jeffX + "px";
  jeff.style.bottom = jeffY + "px";

  // Boundaries
  if (jeffX < 0) jeffX = 0;
  if (jeffX > window.innerWidth - 100) jeffX = window.innerWidth - 100;

  // Interaction zones
  const waterSourceX = 80;
  const bucketX = window.innerWidth - 200;

  // Collect water
  if (!carryingWater && Math.abs(jeffX - waterSourceX) < 60) {
    carryingWater = true;
    score += 10;
    scoreDisplay.textContent = score;
  }

  // Deliver water
  if (carryingWater && Math.abs(jeffX - bucketX) < 60) {
    carryingWater = false;
    waterSaved += 10;
    score += 20;
    scoreDisplay.textContent = score;
    waterDisplay.textContent = waterSaved + "%";
  }

  requestAnimationFrame(update);
}

update();
