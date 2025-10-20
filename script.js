const difficultyScreen = document.getElementById('difficulty-screen');
const gameScreen = document.getElementById('game-screen');
const gameContainer = document.getElementById('game-container');
const jeff = document.getElementById('jeff');
const scoreDisplay = document.getElementById('score');

let distance = 0;
let speed = 3;
let obstacles = [];
let gameInterval;
let obstacleInterval;
let isJumping = false;
let velocity = 0;
let gravity = -0.4;

function startGame(difficulty) {
  difficultyScreen.classList.remove('active');
  gameScreen.classList.add('active');

  switch (difficulty) {
    case 'easy': speed = 3; break;
    case 'medium': speed = 5; break;
    case 'hard': speed = 7; break;
  }

  spawnObstacles();
  gameInterval = setInterval(updateGame, 20);
}

// Create scrolling background illusion
function updateGame() {
  distance += 0.05 * speed;
  scoreDisplay.textContent = `Distance: ${Math.floor(distance)} miles`;

  // Move obstacles to the left
  obstacles.forEach((ob) => {
    const left = parseInt(ob.style.left);
    ob.style.left = left - speed + 'px';
    if (left < -50) {
      ob.remove();
      obstacles = obstacles.filter(o => o !== ob);
    }

    // Collision detection
    const jeffRect = jeff.getBoundingClientRect();
    const obRect = ob.getBoundingClientRect();
    if (
      jeffRect.left < obRect.left + obRect.width &&
      jeffRect.left + jeffRect.width > obRect.left &&
      jeffRect.bottom > obRect.top
    ) {
      endGame();
    }
  });

  // Handle jump gravity
  if (isJumping) {
    velocity += gravity;
    let newBottom = parseInt(jeff.style.bottom) + velocity;
    if (newBottom <= 10) {
      newBottom = 10;
      isJumping = false;
      velocity = 0;
    }
    jeff.style.bottom = newBottom + 'px';
  }

  if (distance >= 100) endGame(true);
}

// Jump when pressing Space
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !isJumping) jump();
});

function jump() {
  isJumping = true;
  velocity = 8;
}

// Spawn obstacles periodically
function spawnObstacles() {
  obstacleInterval = setInterval(() => {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = gameContainer.offsetWidth + 'px';
    gameContainer.appendChild(obstacle);
    obstacles.push(obstacle);
  }, 2000);
}

function endGame(victory = false) {
  clearInterval(gameInterval);
  clearInterval(obstacleInterval);
  obstacles.forEach(o => o.remove());

  if (victory) {
    alert("🎉 Jeff reached 100 miles and delivered clean water! Thank you for playing!");
  } else {
    alert("💥 Jeff tripped on an obstacle! Try again!");
  }

  window.location.reload();
}
