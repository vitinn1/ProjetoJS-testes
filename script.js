const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const platformImage = new Image();
platformImage.src = "img/plataforma.png";

let player, gravity, keys, platforms, objective, currentLevel, movingPlatforms = [];
let timer = 30;
let trapCoin;
let timerInterval;


let paused = false;
let animationId = null;

const sprites = {
  idle: new Image(),
  run: new Image(),
  jump: new Image()
};

sprites.idle.src = 'img/IdleAstronaut.png';
sprites.run.src = 'img/RunAstronaut.png';
sprites.jump.src = 'img/JumpAstronaut.png';

const FRAME_WIDTH = 18;
const FRAME_HEIGHT = 24;
const TOTAL_FRAMES = 4;
let currentFrame = 0;
let frameCounter = 0;
const FRAME_DELAY = 10;

document.getElementById("fase1").addEventListener("click", () => startGame(1));
document.getElementById("fase2").addEventListener("click", () => startGame(2));
document.getElementById("fase3").addEventListener("click", () => startGame(3));
document.getElementById("fase4").addEventListener("click", () => startGame(4));
document.getElementById("fase5").addEventListener("click", () => startGame(5));


function startGame(level) {
  currentLevel = level;
  document.getElementById("menu").style.display = "none";
  canvas.style.display = "block";

  gravity = 0.3;
  keys = {};
  movingPlatforms = [];
  timer = 20;

  player = {
    x: 50,
    y: 300,
    width: 18,
    height: 24,
    dx: 0,
    dy: 0,
    jumping: false,
    facingLeft: false,
    state: "idle"
  };

  if (level === 1) {
    platforms = [
      { x: 0, y: 370, width: 800, height: 30 },
      { x: 200, y: 300, width: 100, height: 20 },
      { x: 400, y: 250, width: 100, height: 20 },
      { x: 550, y: 125, width: 100, height: 20 },
    ];
    objective = { x: 650, y: 90, width: 30, height: 30, color: "green" };

  } else if (level === 2) {
    platforms = [
      { x: 0, y: 370, width: 800, height: 30 },
      { x: 150, y: 320, width: 120, height: 20 },
      { x: 350, y: 280, width: 120, height: 20 },
      { x: 550, y: 240, width: 120, height: 20 },
    ];
    objective = { x: 680, y: 210, width: 30, height: 30, color: "purple" };

  } else if (level === 3) {
    platforms = [
      { x: 100, y: 230, width: 100, height: 20 },
      { x: 250, y: 300, width: 100, height: 20, moving: true, dir: 1, speed: 1 },
      { x: 400, y: 250, width: 100, height: 20, moving: true, dir: -1, speed: 1 },
      { x: 550, y: 200, width: 100, height: 20, moving: true, dir: 1, speed: 1 },
      { x: 700, y: 150, width: 100, height: 20, moving: true, dir: -1, speed: 2 },
      { x: 0, y: 500, width: 0, height: 0 } // chão invisível
    ];
    movingPlatforms = platforms.filter(p => p.moving);
    objective = { x: 850, y: 350, width: 30, height: 30, color: "gold" };
    player.x = 100;
    player.y = 200;
    } else if (level === 4) {
      platforms = [
      { x: 0, y: 550, width: 100, height: 20 },
      { x: 150, y: 480, width: 100, height: 20 },
      { x: 300, y: 410, width: 100, height: 20 },
      { x: 450, y: 340, width: 100, height: 20, type: "moving", direction: "vertical", speed: 1.5, range: 80, initial: 340 },
      { x: 600, y: 270, width: 100, height: 20, type: "moving", direction: "horizontal", speed: 2, range: 80, initial: 600 },
      { x: 750, y: 200, width: 100, height: 20, type: "falling", triggered: false, fallDelay: 30, fallSpeed: 4, timer: 0 },
      { x: 900, y: 130, width: 100, height: 20, type: "moving", direction: "horizontal", speed: 2.5, range: 100, initial: 900 },
      ];
      objective = { x: 1020, y: 100, width: 30, height: 30, color: "green" };
      trapCoin = { x: 320, y: 380, width: 20, height: 20, color: "yellow" };
      startTimer();
  
      } else if (level === 5) {
        platforms = [
          { x: 0, y: 370, width: 90, height: 30 },
          { x: 100, y: 320, width: 20, height: 15, type: "moving", direction: "vertical", speed: 4, range: 80, initial: 240 },
          { x: 220, y: 270, width: 20, height: 15, type: "moving", direction: "vertical", speed: 6, range: 80, initial: 240 },
          { x: 370, y: 220, width: 20, height: 15, type: "moving", direction: "vertical", speed: 8, range: 80, initial: 240 },
          { x: 520, y: 170, width: 20, height: 15, type: "moving", direction: "vertical", speed: 10, range: 80, initial: 240 },
          { x: 680, y: 200, width: 10, height: 430, type: "falling", triggered: false, fallDelay: 2, fallSpeed: 5}, // Essa aqui
          { x: 770, y: 550, width: 20, height: 15, type: "falling", triggered: false, fallDelay: 2, fallSpeed: 5},
          { x: 910, y: 550, width: 20, height: 15, type: "falling", triggered: false, fallDelay: 2, fallSpeed: 5},
          { x: 1050, y: 550, width: 20, height: 15, type: "falling", triggered: false, fallDelay: 2, fallSpeed: 5},
        ];
        objective = { x: 1130, y: 500, width: 30, height: 30, color: "gold"};
      }


  animationId = requestAnimationFrame(update);
}

document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

function update() {
  if (keys["ArrowLeft"] || keys["KeyA"]) {
    player.dx = -2;
    player.facingLeft = true;
  } else if (keys["ArrowRight"] || keys["KeyD"]) {
    player.dx = 2;
    player.facingLeft = false;
  } else {
    player.dx = 0;
  }

  // verica acao para trocar sprite
  if (player.jumping || player.dy !== 0) {
    player.state = "jump";
  } else if (player.dx !== 0) {
    player.state = "run";
  } else {
    player.state = "idle";
  }

  if ((keys["ArrowUp"] || keys["KeyW"]) && !player.jumping) {
    player.dy = -7;
    player.jumping = true;
  }

  player.dy += gravity;
  player.x += player.dx;
  player.y += player.dy;

  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  if (player.y + player.height > canvas.height) {
        clearInterval(timerInterval);
        showGameOver("Game Over!");
        return;
      }

  frameCounter++;
  if (frameCounter >= FRAME_DELAY) {
    frameCounter = 0;
    currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
  }

  if (currentLevel === 1 || currentLevel === 2) updateLevel1And2();
  else if (currentLevel === 3) updateLevel3();
  else if (currentLevel === 5) updateLevel5();
  else if (currentLevel === 4) updateLevel4();
}

function updateLevel1And2() {
  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.jumping = false;
  }
  if (player.y < 0) {
    player.y = 0;
    player.dy = 0;
  }

  for (let plat of platforms) {
    if (
      player.x < plat.x + plat.width &&
      player.x + player.width > plat.x &&
      player.y < plat.y + plat.height &&
      player.y + player.height > plat.y
    ) {
      player.y = plat.y - player.height;
      player.dy = 0;
      player.jumping = false;
    }
  }

  drawGame();

  if (checkVictory()) {
    showVictoryMessage();
    return;
  }

  animationId = requestAnimationFrame(update);
}

function updateLevel3() {
  if (player.y < 0) {
    player.y = 0;
    player.dy = 0;
  }

  for (let plat of movingPlatforms) {
    plat.y += plat.dir * plat.speed;
    if (plat.y <= 50 || plat.y >= 350) plat.dir *= -1;
  }

  let onPlatform = false;

  for (let plat of platforms) {
    if (
      player.x < plat.x + plat.width &&
      player.x + player.width > plat.x &&
      player.y + player.height >= plat.y &&
      player.y + player.height <= plat.y + plat.height &&
      player.dy >= 0
    ) {
      player.y = plat.y - player.height;
      player.dy = 0;
      player.jumping = false;
      onPlatform = true;
    }
  }

  const ground = platforms.find(p => p.y === 500);
  if (player.y + player.height >= ground.y && !onPlatform) {
    showGameOver();
    return;
  }

  drawGame();

  if (checkVictory()) {
    showVictoryMessage();
    return;
  }

  animationId = requestAnimationFrame(update);
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer--;
    if (timer <= 0) {
      clearInterval(timerInterval);
      showGameOver("Tempo esgotado!");
    }
  }, 1000);
}

function updateLevel4() {

  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  if (player.y + player.height > canvas.height) {
    clearInterval(timerInterval);
    showGameOver("Game Over!");
    return;
  }

  if (player.y < 0) {
    player.y = 0;
    player.dy = 0;
  }

  const prevTop = player.y - player.dy;

  for (let plat of platforms) {
    // === Plataformas móveis ===
    if (plat.type === "moving") {
      if (plat.direction === "vertical") {
        plat.y += plat.speed;
        if (plat.y > plat.initial + plat.range || plat.y < plat.initial - plat.range) {
          plat.speed *= -1;
        }
      } else if (plat.direction === "horizontal") {
        plat.x += plat.speed;
        if (plat.x > plat.initial + plat.range || plat.x < plat.initial - plat.range) {
          plat.speed *= -1;
        }
      }
    }

    // === Plataformas que caem ===
    if (plat.type === "falling") {
      const touching = (
        player.x < plat.x + plat.width &&
        player.x + player.width > plat.x &&
        player.y + player.height > plat.y &&
        player.y < plat.y + plat.height
      );

      if (touching && !plat.triggered) {
        plat.triggered = true;
        plat.timer = -1;
      }

      if (plat.triggered) {
        plat.timer++;
        if (plat.timer >= plat.fallDelay) {
          plat.y += plat.fallSpeed;
        }
      }
    }

  if (
  player.x < plat.x + plat.width &&
  player.x + player.width > plat.x &&
  player.y < plat.y + plat.height &&
  player.y + player.height > plat.y
) {
  // Colisão por cima
  if (player.dy >= 0 && player.y + player.height - player.dy <= plat.y) {
    player.y = plat.y - player.height;
    player.dy = 0;
    player.jumping = false;

    if (plat.type === "moving" && plat.direction === "vertical") {
      player.y += plat.speed; // move o jogador junto com a plataforma
    }
  }
  // Colisão por baixo
  else if (prevTop >= plat.y + plat.height && player.dy < 0) {
    player.y = plat.y + plat.height;
    player.dy = 0;
  }
  // Colisão lateral esquerda (jogador à direita da plataforma)
  else if (player.dx > 0 && player.x + player.width > plat.x && player.x < plat.x) {
    player.x = plat.x - player.width;
    player.dx = 0;
  }
  // Colisão lateral direita (jogador à esquerda da plataforma)
  else if (player.dx < 0 && player.x < plat.x + plat.width && player.x + player.width > plat.x + plat.width) {
    player.x = plat.x + plat.width;
    player.dx = 0;
  }
}

    
  }

  // Colisão com moeda maldita
  if (
    player.x < trapCoin.x + trapCoin.width &&
    player.x + player.width > trapCoin.x &&
    player.y < trapCoin.y + trapCoin.height &&
    player.y + player.height > trapCoin.y
  ) {
    player.x = player.startX;
    player.y = player.startY;
    player.dy = 0;
  }

  // Colisão com objetivo
  if (
    player.x < objective.x + objective.width &&
    player.x + player.width > objective.x &&
    player.y < objective.y + objective.height &&
    player.y + player.height > objective.y
  ) {
    clearInterval(timerInterval);
    showVictoryMessage();
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.fillText(`${timer}`, 580, 580);

  ctx.fillStyle = trapCoin.color;
  ctx.fillRect(trapCoin.x, trapCoin.y, trapCoin.width, trapCoin.height);


if (player.y + player.height > canvas.height && !onPlatform) {
    showGameOver();
    return;
  }

  drawGame();

  if (checkVictory()) {
    showVictoryMessage();
    return;
  }

  animationId = requestAnimationFrame(update);
}


function updateLevel5() {
  if (player.y < 0) {
    player.y = 0;
    player.dy = 0;
  }

  let onPlatform = false;

  for (let plat of platforms) {
    if (
      player.x < plat.x + plat.width &&
      player.x + player.width > plat.x &&
      player.y + player.height >= plat.y &&
      player.y + player.height <= plat.y + plat.height &&
      player.dy >= 0
    ) {
      player.y = plat.y - player.height;
      player.dy = 0;
      player.jumping = false;
      onPlatform = true;
    }
  }

  for (let plat of platforms) {
    if (plat.type === "moving") {
      if (plat.direction === "vertical") {
        plat.y += plat.speed;
        if (plat.y > plat.initial + plat.range || plat.y < plat.initial - plat.range) {
          plat.speed *= -1;
        }
      }
    }

    if (plat.type === "falling") {
      const touching = (
        player.x < plat.x + plat.width &&
        player.x + player.width > plat.x &&
        player.y + player.height >= plat.y &&
        player.y + player.height <= plat.y + plat.height &&
        player.dy >= 0
      );

      if (touching && !plat.triggered) {
        plat.triggered = true;
        plat.timer = 0;
      }

      if (plat.triggered) {
        if (plat.timer < plat.fallDelay) {
          plat.timer++;
        } else {
          plat.y += plat.fallSpeed;
        }
      }
    }
  }

  platforms = platforms.filter(plat => plat.y < canvas.height + 100);

 
  if (player.y + player.height > canvas.height && !onPlatform) {
    showGameOver();
    return;
  }

  drawGame();

  if (checkVictory()) {
    showVictoryMessage();
    return;
  }

  animationId = requestAnimationFrame(update);
}


function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const sprite = sprites[player.state];

  ctx.save();
  if (player.facingLeft) {
    ctx.translate(player.x + player.width, player.y);
    ctx.scale(-1, 1);
    ctx.drawImage(
      sprite,
      currentFrame * FRAME_WIDTH, 0,
      FRAME_WIDTH, FRAME_HEIGHT,
      0, 0,
      player.width, player.height
    );
  } else {
    ctx.drawImage(
      sprite,
      currentFrame * FRAME_WIDTH, 0,
      FRAME_WIDTH, FRAME_HEIGHT,
      player.x, player.y,
      player.width, player.height
    );
  }
  ctx.restore();

  // === Desenha todas as plataformas ===
  for (let plat of platforms) {
    if (platformImage.complete) {
      ctx.drawImage(platformImage, plat.x, plat.y, plat.width, plat.height);
    } else {
      ctx.fillStyle = "#fff";
      ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
    }
  }

  // === Desenha o objetivo (depois das plataformas!) ===
  ctx.fillStyle = objective.color;
  ctx.fillRect(objective.x, objective.y, objective.width, objective.height);
}

function checkVictory() {
  return (
    player.x < objective.x + objective.width &&
    player.x + player.width > objective.x &&
    player.y < objective.y + objective.height &&
    player.y + player.height > objective.y
  );
}

function showVictoryMessage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "36px sans-serif";
  const message = "Você completou a fase!";
  const textWidth = ctx.measureText(message).width;
  const x = (canvas.width - textWidth) / 2;
  const y = canvas.height / 2;
  ctx.fillText(message, x, y);

  // Marca botão da fase como completa
  const button = document.getElementById(`fase${currentLevel}`);
  if (button) {
    button.classList.add("fase-completa");
  }

  setTimeout(() => {
    canvas.style.display = "none";
    document.getElementById("menu").style.display = "block";
  }, 2000);
}

function showGameOver() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  ctx.font = "36px sans-serif";
  const message = "Game Over!";
  const textWidth = ctx.measureText(message).width;
  const x = (canvas.width - textWidth) / 2;
  const y = canvas.height / 2;
  ctx.fillText(message, x, y);
  setTimeout(() => {
    canvas.style.display = "none";
    document.getElementById("menu").style.display = "block";
  }, 2000);
}

document.addEventListener("keydown", e => {
  if (e.code === "Escape" && canvas.style.display === "block") {
    togglePause();
  }
});

function togglePause() {
  paused = !paused;
  const pauseMenu = document.getElementById("pauseMenu");

  if (paused) {
    pauseMenu.style.display = "block";
    cancelAnimationFrame(animationId); // Pausa a animação
  } else {
    pauseMenu.style.display = "none";
    animationId = requestAnimationFrame(update); // Retoma a animação
  }
}

document.getElementById("btnContinue").addEventListener("click", () => {
  paused = false;
  document.getElementById("pauseMenu").style.display = "none";
  animationId = requestAnimationFrame(update);
});

document.getElementById("btnBackToMenu").addEventListener("click", () => {
  paused = false;
  document.getElementById("pauseMenu").style.display = "none";
  canvas.style.display = "none";
  document.getElementById("menu").style.display = "block";
});
