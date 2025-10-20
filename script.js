const jeff = document.getElementById('jeff');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const waterSavedDisplay = document.getElementById('water-saved');
const jeffStatus = document.getElementById('jeff-status');
const gameArea = document.getElementById('game-area');
const difficultyScreen = document.getElementById('difficulty-screen');
const gameContainer = document.getElementById('game-container');

let score = 0;
let timeLeft = 100;
let waterSaved = 0;
let carryingWater = false;
let gameRunning = false;
let moveDirection = 'right';
let speed = 3;

// Difficulty selection
document.querySelectorAll('.difficulty-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    speed = parseInt(btn.dataset.speed);
    difficultyScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    startGame();
  });
});

function startGame() {
  gameRunning = true;
  moveJeff();
  spawnObstacles();
  startTimer();
}

// Movement
function moveJeff() {
  let position = jeff.offsetLeft;

  const moveInterval = setInterval(() => {
    if (!gameRunning) return clearInterval(moveInterval);

    if (moveDirection === 'right') position += speed;
    else position -= speed;

    jeff.style.left = position + 'px';
    gameArea.scrollLeft = position - gameArea.clientWidth / 2;

    if (position + jeff.offsetWidth >= gameArea.clientWidth - 80) {
      if (carryingWater) {
        carryingWater = false;
        score += 10;
        waterSaved += 5;
        jeffStatus.textContent = 'Empty';
        scoreDisplay.textContent = `${score} points`;
        waterSavedDisplay.textContent = `${waterSaved}%`;
      }
      moveDirection = 'left';
    } else if (position <= 80) {
      if (!carryingWater) {
        carryingWater = true;
        jeffStatus.textContent = 'Full';
      }
      moveDirection = 'right';
    }

    // ✅ Collision detection: Jeff loses points if he hits an obstacle
    const jeffRect = jeff.getBoundingClientRect();
    document.querySelectorAll('.obstacle').forEach(obstacle => {
      const obsRect = obstacle.getBoundingClientRect();
      if (
        jeffRect.left < obsRect.right &&
        jeffRect.right > obsRect.left &&
        jeffRect.bottom > obsRect.top &&
        jeffRect.top < obsRect.bottom
      ) {
        score = Math.max(0, score - 5); // lose 5 points but not below 0
        scoreDisplay.textContent = `${score} points`;
        obstacle.remove(); // remove obstacle after collision
      }
    });
  }, 20);
}

// Timer
function startTimer() {
  const timer = setInterval(() => {
    if (!gameRunning) return clearInterval(timer);
    timeLeft--;
    timeDisplay.textContent = `${timeLeft}s`;
    if (timeLeft <= 0) {
      gameRunning = false;
      alert('Time up! Jeff saved ' + waterSaved + '% water!');
      location.reload();
    }
  }, 1000);
}

// Jump
document.addEventListener('keydown', e => {
  if (e.code === 'Space' && !jeff.classList.contains('jump')) {
    jeff.classList.add('jump');
    setTimeout(() => jeff.classList.remove('jump'), 600);
  }
});

// Obstacles
function spawnObstacles() {
  setInterval(() => {
    if (!gameRunning) return;
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = Math.random() * (gameArea.clientWidth - 50) + 'px';
    gameArea.appendChild(obstacle);
    setTimeout(() => obstacle.remove(), 8000);
  }, 3000);
}
