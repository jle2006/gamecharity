let score = 0;
let waterSaved = 0;
let timeLeft = 150;
let carryingWater = false;
let direction = 1; // 1 = right, -1 = left
let jeffSpeed = 3;
let distance = 0;
let totalMiles = 0;
let isJumping = false;

const jeff = document.getElementById("jeff");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const waterDisplay = document.getElementById("waterSaved");
const obstacles = document.querySelectorAll(".obstacle");

let jeffX = 150;

// Countdown timer
const timer = setInterval(() => {
  timeLeft--;
  timeDisplay.textContent = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timer);
    alert(`⏰ Time's up! Jeff traveled ${totalMiles} miles and saved ${waterSaved}% of the water!`);
    location.reload();
  }
}, 1000);

// Jump function
function jump() {
  if (isJumping) return;
  isJumping = true;
  jeff.classList.add("jump");

  setTimeout(() => {
    jeff.classList.remove("jump");
    setTimeout(() => { isJumping = false; }, 200);
  }, 600);
}

// Listen for Spacebar or Up Arrow
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    jump();
  }
});

// Simple collision detection
function isColliding(aX, bX, bWidth) {
  return aX + 60 > bX && aX < bX + bWidth;
}

// Game loop
function update() {
  jeffX += jeffSpeed * direction;
  jeff.style.left = jeffX + "px";

  // Flip direction visually
  jeff.style.transform = direction === 1 ? "scaleX(1)" : "scaleX(-1)";

  const waterSourceX = 50;
  const bucketX = window.innerWidth - 200;

  // Collect water
  if (direction === -1 && jeffX <= waterSourceX + 20) {
    if (!carryingWater) {
      carryingWater = true;
      score += 10;
      scoreDisplay.textContent = score;
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
    }
    direction = -1;
  }

  // Obstacle collision (only if not jumping)
  if (!isJumping) {
    obstacles.forEach((obs) => {
      const obsX = parseInt(obs.style.left);
      if (isColliding(jeffX, obsX, 60)) {
        if (carryingWater) {
          carryingWater = false;
          score -= 10;
          scoreDisplay.textContent = score;
        }
      }
    });
  }

  requestAnimationFrame(update);
}

update();
