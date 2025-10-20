const difficultyScreen = document.getElementById('difficulty-screen');
const gameScreen = document.getElementById('game-screen');
const jeff = document.getElementById('jeff');
const bucket = document.getElementById('bucket');
const scoreDisplay = document.getElementById('score');
const gameContainer = document.getElementById('game-container');

let distance = 0;
let movingRight = true;
let gameSpeed = 2;
let gameInterval;
let obstacleInterval;
let isJumping = false;

function startGame(difficulty) {
  difficultyScreen.classList.remove('active');
  gameScreen.classList.add('active');

  switch (difficulty) {
    case 'easy': gameSpeed = 2; break;
    case 'medium': gameSpeed = 4; break;
    case 'hard': gameSpeed = 6; break;
  }

  spawnObstacles();
  gameInterval = setInterval(moveJeff, 20);
}

// Move Jeff back and forth automatically
function moveJeff() {
  const jeffLeft = parseInt(window.getComputedStyle(jeff).left);

  if (movingRight) {
    jeff.style.left = jeffLeft + gameSpeed + 'px';
    if (jeffLeft >= gameContainer.offsetWidth - jeff.offsetWidth - 100) {
      movingRight = false;
      distance++;
    }
  } else {
    jeff.style.left = jeffLeft - gameSpeed + 'px';
    if (jeffLeft <= 50) {
      movingRight = true;
      distance++;
    }
  }

  scoreDisplay.textContent = `Distance: ${distance} miles`;
  if (distance >= 100) endGame();
}

// Jumping function
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !isJumping) jump();
});

function jump() {
  isJumping = true;
  let jumpHeight = 0;
  const up = setInterval(() => {
    if (jumpHeight >= 80) {
      clearInterval(up);
      const down = setInterval(() => {
        if (jumpHeight <= 0) {
          clearInterval(down);
          isJumping = false;
        } else {
          jumpHeight -= 5;
          jeff.style.bottom = 10 + jumpHeight + 'px';
        }
      }, 20);
    } else {
      jumpHeight += 5;
      jeff.style.bottom = 10 + jumpHeight + 'px';
    }
  }, 20);
}

// Create random obstacles
function spawnObstacles() {
  obstacleInterval = setInterval(() => {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = Math.random() * (gameContainer.offsetWidth - 60) + 'px';
    gameContainer.appendChild(obstacle);

    setTimeout(() => obstacle.remove(), 5000);
  }, 2000);
}

// End game
function endGame() {
  clearInterval(gameInterval);
  clearInterval(obstacleInterval);
  alert("🎉 Jeff delivered 100 miles of clean water! Thank you for playing!");
  window.location.reload();
}
