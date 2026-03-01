const decisionPoints = [
  {
    prompt: "Pick your favorite.",
    left: "Croissant",
    right: "Cupcakes",
    correct: "left",
    leftImg: "images/croissant.avif",
    rightImg: "images/cupcakes.webp",
    rightPopup: "I guess Bittu knows you love croissants.",
    wrongPopup: "How could you do this to croissants?"
  },
  {
    prompt: "Pick your favorite.",
    left: "Cocktail bar",
    right: "Undergrad bar",
    correct: "left",
    leftImg: "images/cocktail_bar.jpeg",
    rightImg: "images/undergrad_bar.jpg",
    rightPopup: "Not more than one cocktail, no?",
    wrongPopup: "You are full of surprises. A crowded undergrad bar?"
  },
  {
    prompt: "Pick your favorite.",
    left: "Vegas",
    right: "Rocky mountains",
    correct: "right",
    leftImg: "images/las_vegas.avif",
    rightImg: "images/rocky_mountains.jpg",
    rightPopup: "Rockies was something, wasn't it?",
    wrongPopup: "Really? You are going to pick Vegas over the Rockies? Do you hate Bittu?"
  },
  {
    prompt: "Pick your favorite.",
    left: "Coldplay",
    right: "OneRepublic",
    correct: "left",
    leftImg: "images/coldplay.jpg",
    rightImg: "images/one_direction.webp",
    rightPopup: "That night, the sky was full of stars. What a night that was!",
    wrongPopup: "Why would you pick this rando?"
  },
  {
    prompt: "Pick your favorite.",
    left: "Cashmere",
    right: "Polyester",
    correct: "left",
    leftImg: "images/cashmere.jpeg",
    rightImg: "images/fast_fashion.jpg",
    rightPopup: "That's right, we use cashmere.",
    wrongPopup: "Say no to fast fashion. I am with you on that."
  },
  {
    prompt: "Pick your favorite.",
    left: "Camping",
    right: "Resort",
    correct: "left",
    leftImg: "images/camping.jpg",
    rightImg: "images/resort.webp",
    rightPopup: "Camping can be relaxing and empowering at the same time, I agree.",
    wrongPopup: "Bittu doesn't know you well enough. He has not left the right clues."
  },
  {
    prompt: "Pick your favorite.",
    left: "Black cat",
    right: "Labrador",
    correct: "left",
    leftImg: "images/black_cat.jpeg",
    rightImg: "images/husky.jpeg",
    rightPopup: "Mogu mogu",
    wrongPopup: "This was difficult but Bittu wants you to choose what you'd prefer more"
  },
  {
    prompt: "Pick your favorite.",
    left: "Drug discovery",
    right: "Finance company",
    correct: "left",
    leftImg: "images/ML_healthcare.webp",
    rightImg: "images/palantir.png",
    rightPopup: "Using your knowledge to better the world? Hell yeah!",
    wrongPopup: "Fuck nooooo!"
  },
  {
    prompt: "Pick your favorite.",
    left: "Summer",
    right: "Winter",
    correct: "left",
    leftImg: "images/fall.jpg",
    rightImg: "images/winter.jpeg",
    rightPopup: "Isn't that where you both met?",
    wrongPopup: "Agree to disagree."
  },
  {
    prompt: "Pick your favorite.",
    left: "Bangs",
    right: "Long hair",
    correct: "both",
    leftImg: "images/bangs.jpeg",
    rightImg: "images/long_hair.jpeg",
    rightPopup: "Both are perfect. You are pretty in every way.",
    wrongPopup: "Both are correct here."
  }
];

const TILE = 28;
const GRID_W = 21;
const GRID_H = 13;
const CANVAS_W = GRID_W * TILE;
const CANVAS_H = GRID_H * TILE;
const PLAYER_SIZE = 20;
const START_CELL_X = 9;
const START_CELL_Y = 11;

const state = {
  step: 0,
  playing: true,
  finished: false,
  awaitingDoorRelease: false,
  pendingAdvance: false
};

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const stepCounter = document.getElementById("stepCounter");
const leftImg = document.getElementById("leftImg");
const rightImg = document.getElementById("rightImg");
const leftLabel = document.getElementById("leftLabel");
const rightLabel = document.getElementById("rightLabel");
const messageBox = document.getElementById("messageBox");
const endScreen = document.getElementById("endScreen");
const endTitle = document.getElementById("endTitle");
const endText = document.getElementById("endText");
const restartBtn = document.getElementById("restartBtn");
const funnyPopup = document.getElementById("funnyPopup");
const funnyPopupText = document.getElementById("funnyPopupText");
const popupOkBtn = document.getElementById("popupOkBtn");

canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false
};

const player = {
  x: (START_CELL_X + 0.5) * TILE - PLAYER_SIZE / 2,
  y: (START_CELL_Y + 0.5) * TILE - PLAYER_SIZE / 2,
  speed: 3.4,
  w: PLAYER_SIZE,
  h: PLAYER_SIZE
};

const spawn = {
  x: (START_CELL_X + 0.5) * TILE - PLAYER_SIZE / 2,
  y: (START_CELL_Y + 0.5) * TILE - PLAYER_SIZE / 2
};

let mazeGrid = [];
let route = null;
let leftChoiceImage = null;
let rightChoiceImage = null;
let leftChoiceSrc = "";
let rightChoiceSrc = "";
let currentCorrectSide = "left";
const playerIconImage = new Image();
playerIconImage.src = "images/icon.png";
const finalSceneImage = new Image();
finalSceneImage.src = "images/final_image.jpg";

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function makeDummyImage(label, base, accent) {
  const safe = label.replace(/&/g, "and");
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 200'>
      <rect width='320' height='200' fill='${base}'/>
      <circle cx='65' cy='65' r='38' fill='${accent}' opacity='0.45'/>
      <rect x='26' y='105' width='268' height='66' rx='14' fill='white' opacity='0.82'/>
      <text x='160' y='147' text-anchor='middle' font-size='26' font-family='Verdana' fill='#3c2a24'>${safe}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function palette(i) {
  const p = [
    ["#ffdcb8", "#f59e76"],
    ["#d5f0ff", "#79acd8"],
    ["#ffe1f0", "#ff8dbb"],
    ["#e2f6d5", "#83ba5b"]
  ];
  return p[i % p.length];
}

function resolveImg(path, label, idx) {
  if (typeof path === "string" && path.trim()) {
    return path;
  }
  const p = palette(idx);
  return makeDummyImage(label, p[0], p[1]);
}

function loadChoiceImages(d) {
  const shouldSwap = Math.random() < 0.5;

  const sourceLeft = shouldSwap ? { label: d.right, img: d.rightImg } : { label: d.left, img: d.leftImg };
  const sourceRight = shouldSwap ? { label: d.left, img: d.leftImg } : { label: d.right, img: d.rightImg };

  leftChoiceSrc = resolveImg(sourceLeft.img, sourceLeft.label, state.step);
  rightChoiceSrc = resolveImg(sourceRight.img, sourceRight.label, state.step + 1);

  leftChoiceImage = new Image();
  rightChoiceImage = new Image();
  leftChoiceImage.src = leftChoiceSrc;
  rightChoiceImage.src = rightChoiceSrc;

  leftImg.src = leftChoiceSrc;
  rightImg.src = rightChoiceSrc;
  leftLabel.textContent = sourceLeft.label;
  rightLabel.textContent = sourceRight.label;

  if (d.correct === "both") {
    currentCorrectSide = "both";
  } else if (!shouldSwap) {
    currentCorrectSide = d.correct;
  } else {
    currentCorrectSide = d.correct === "left" ? "right" : "left";
  }
}

function buildPerfectMaze() {
  const g = Array.from({ length: GRID_H }, () => Array.from({ length: GRID_W }, () => "#"));
  const dirs = [
    [2, 0],
    [-2, 0],
    [0, 2],
    [0, -2]
  ];

  function carve(cx, cy) {
    g[cy][cx] = ".";
    const order = shuffle([...dirs]);

    for (const [dx, dy] of order) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx <= 0 || nx >= GRID_W - 1 || ny <= 0 || ny >= GRID_H - 1) {
        continue;
      }
      if (g[ny][nx] === "#") {
        g[cy + dy / 2][cx + dx / 2] = ".";
        carve(nx, ny);
      }
    }
  }

  carve(START_CELL_X, START_CELL_Y);
  return g;
}

function findDoorColumns(grid) {
  const mid = Math.floor(GRID_W / 2);
  const leftCandidates = [];
  const rightCandidates = [];

  function pathDegree(x, y) {
    const n = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1]
    ];
    let count = 0;
    for (const [nx, ny] of n) {
      if (nx >= 0 && nx < GRID_W && ny >= 0 && ny < GRID_H && grid[ny][nx] === ".") {
        count += 1;
      }
    }
    return count;
  }

  for (let x = 1; x < GRID_W - 1; x += 2) {
    if (grid[1][x] !== ".") {
      continue;
    }
    if (pathDegree(x, 1) !== 1) {
      continue;
    }
    if (x < mid - 2) {
      leftCandidates.push(x);
    }
    if (x > mid + 2) {
      rightCandidates.push(x);
    }
  }

  if (!leftCandidates.length || !rightCandidates.length) {
    return null;
  }

  const pairOptions = [];
  for (const lx of leftCandidates) {
    for (const rx of rightCandidates) {
      if (rx - lx >= 6) {
        pairOptions.push({ leftX: lx, rightX: rx, distance: rx - lx });
      }
    }
  }

  if (!pairOptions.length) {
    return null;
  }

  pairOptions.sort((a, b) => b.distance - a.distance);
  const topSlice = pairOptions.slice(0, Math.min(8, pairOptions.length));
  const picked = topSlice[randomInt(0, topSlice.length - 1)];
  return { leftX: picked.leftX, rightX: picked.rightX };
}

function generateRouteLayout() {
  let attempts = 0;
  while (attempts < 200) {
    attempts += 1;
    const g = buildPerfectMaze();
    const doors = findDoorColumns(g);
    if (!doors) {
      continue;
    }

    g[0][doors.leftX] = "L";
    g[0][doors.rightX] = "R";

    return {
      grid: g,
      leftDoor: {
        x: doors.leftX * TILE,
        y: 0,
        w: TILE,
        h: TILE
      },
      rightDoor: {
        x: doors.rightX * TILE,
        y: 0,
        w: TILE,
        h: TILE
      }
    };
  }

  const fallback = Array.from({ length: GRID_H }, () => Array.from({ length: GRID_W }, () => "#"));
  const leftX = 3;
  const rightX = GRID_W - 4;
  const splitY = 3;

  for (let y = START_CELL_Y; y >= splitY; y -= 1) {
    fallback[y][START_CELL_X] = ".";
  }
  for (let x = leftX; x <= rightX; x += 1) {
    fallback[splitY][x] = ".";
  }
  for (let y = 1; y <= splitY; y += 1) {
    fallback[y][leftX] = ".";
    fallback[y][rightX] = ".";
  }
  fallback[0][leftX] = "L";
  fallback[0][rightX] = "R";

  return {
    grid: fallback,
    leftDoor: { x: leftX * TILE, y: 0, w: TILE, h: TILE },
    rightDoor: { x: rightX * TILE, y: 0, w: TILE, h: TILE }
  };
}

function rerollRoute() {
  route = generateRouteLayout();
  mazeGrid = route.grid;
}

function isWallAt(px, py) {
  if (px < 0 || py < 0 || px >= CANVAS_W || py >= CANVAS_H) {
    return true;
  }
  const gx = Math.floor(px / TILE);
  const gy = Math.floor(py / TILE);
  const t = mazeGrid[gy]?.[gx] ?? "#";
  return t === "#";
}

function collides(nx, ny) {
  const pad = 2;
  const points = [
    [nx + pad, ny + pad],
    [nx + player.w - pad, ny + pad],
    [nx + pad, ny + player.h - pad],
    [nx + player.w - pad, ny + player.h - pad]
  ];
  return points.some(([x, y]) => isWallAt(x, y));
}

function resetToSpawn() {
  player.x = spawn.x;
  player.y = spawn.y;
}

function updateHUD() {
  stepCounter.textContent = `${Math.min(state.step + 1, decisionPoints.length)} / ${decisionPoints.length}`;
}

function setMessage(text, kind = "") {
  messageBox.textContent = text;
  messageBox.classList.remove("good", "bad");
  if (kind) {
    messageBox.classList.add(kind);
  }
}

function showFunnyPopup(text) {
  funnyPopupText.textContent = text;
  funnyPopup.classList.remove("hidden");
  funnyPopup.classList.add("show");
}

function hideFunnyPopup() {
  funnyPopup.classList.remove("show");
  funnyPopup.classList.add("hidden");
}

function loadDecision({ randomizeRoute = true } = {}) {
  if (state.step >= decisionPoints.length) {
    return;
  }

  if (randomizeRoute) {
    rerollRoute();
  }

  const d = decisionPoints[state.step];
  loadChoiceImages(d);
  updateHUD();
  setMessage("Find the right image at the maze end and pick that gate.");
}

function rectIntersects(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function doorZones() {
  if (!route) {
    return {
      left: { x: -9999, y: -9999, w: 0, h: 0 },
      right: { x: -9999, y: -9999, w: 0, h: 0 }
    };
  }
  return {
    left: route.leftDoor,
    right: route.rightDoor
  };
}

function handleDoorChoice(side) {
  if (!state.playing || state.finished) {
    return;
  }

  const d = decisionPoints[state.step];
  if (!d) {
    return;
  }

  const isCorrect = currentCorrectSide === "both" || currentCorrectSide === side;
  if (isCorrect) {
    state.playing = false;
    state.awaitingDoorRelease = true;
    state.pendingAdvance = true;
    showFunnyPopup(d.rightPopup || "Correct!");
    setMessage("Correct turn. You moved deeper into the maze.", "good");
    return;
  }

  state.playing = false;
  state.awaitingDoorRelease = true;
  state.pendingAdvance = false;
  showFunnyPopup(d.wrongPopup || "Wrong gate.");
  setMessage("Wrong gate. Try again in the same maze.", "bad");
  updateHUD();
}

function showWinScreen() {
  endTitle.textContent = "You found me at the maze center!";
  endText.textContent = "Every choice was from the heart. Happy Valentine's Day ❤️";
  endScreen.classList.remove("hidden");
}

function drawTile(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
}

function drawRoundedRect(x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawDoorCard(door, img, label, tint) {
  const cardW = 124;
  const cardH = 84;
  const cardX = clamp(door.x + TILE / 2 - cardW / 2, 8, CANVAS_W - cardW - 8);
  const cardY = 6;

  ctx.fillStyle = "rgba(0,0,0,0.22)";
  drawRoundedRect(cardX + 2, cardY + 3, cardW, cardH, 10);
  ctx.fill();

  ctx.fillStyle = "#fffdf8";
  drawRoundedRect(cardX, cardY, cardW, cardH, 10);
  ctx.fill();

  ctx.strokeStyle = tint;
  ctx.lineWidth = 3;
  drawRoundedRect(cardX, cardY, cardW, cardH, 10);
  ctx.stroke();

  const imgX = cardX + 6;
  const imgY = cardY + 6;
  const imgW = cardW - 12;
  const imgH = 52;

  if (img && img.complete) {
    ctx.drawImage(img, imgX, imgY, imgW, imgH);
  } else {
    ctx.fillStyle = "#f2e0d2";
    ctx.fillRect(imgX, imgY, imgW, imgH);
  }

  ctx.fillStyle = "#3a2921";
  ctx.font = "bold 12px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText(label, cardX + cardW / 2, cardY + cardH - 10);
}

function drawMaze() {
  ctx.fillStyle = "#1b120f";
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  for (let y = 0; y < GRID_H; y += 1) {
    for (let x = 0; x < GRID_W; x += 1) {
      const t = mazeGrid[y]?.[x] ?? "#";
      if (t === "#") {
        drawTile(x, y, "#2b1c16");
      } else {
        drawTile(x, y, "#f4e2cc");
      }
    }
  }

  const d = decisionPoints[state.step] || decisionPoints[decisionPoints.length - 1];
  const doors = doorZones();

  ctx.fillStyle = "#b36d4e";
  ctx.fillRect(doors.left.x, 0, doors.left.w, TILE);
  ctx.fillRect(doors.right.x, 0, doors.right.w, TILE);
  ctx.strokeStyle = "#f8f0e4";
  ctx.lineWidth = 2;
  ctx.strokeRect(doors.left.x + 3, 3, doors.left.w - 6, TILE - 6);
  ctx.strokeRect(doors.right.x + 3, 3, doors.right.w - 6, TILE - 6);
  ctx.fillStyle = "#fff7ed";
  ctx.font = "bold 12px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText("L", doors.left.x + doors.left.w / 2, TILE / 2 + 4);
  ctx.fillText("R", doors.right.x + doors.right.w / 2, TILE / 2 + 4);

  const progressRatio = state.step / decisionPoints.length;
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(20, CANVAS_H - 26, CANVAS_W - 40, 10);
  ctx.fillStyle = "#ff8d5d";
  ctx.fillRect(20, CANVAS_H - 26, (CANVAS_W - 40) * progressRatio, 10);
}

function drawPlayer() {
  if (state.finished) {
    return;
  }

  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(player.x + player.w / 2, player.y + player.h + 4, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  if (playerIconImage.complete && playerIconImage.naturalWidth > 0) {
    const pad = 2;
    const drawX = player.x - pad;
    const drawY = player.y - pad;
    const drawW = player.w + pad * 2;
    const drawH = player.h + pad * 2;
    // Fixed center crop removes the dark vignette frame from this icon asset.
    const sourceW = playerIconImage.naturalWidth;
    const sourceH = playerIconImage.naturalHeight;
    const cropRatio = 0.68;
    const cropW = Math.floor(sourceW * cropRatio);
    const cropH = Math.floor(sourceH * cropRatio);
    const sx = Math.floor((sourceW - cropW) / 2);
    const sy = Math.floor((sourceH - cropH) / 2);
    ctx.drawImage(playerIconImage, sx, sy, cropW, cropH, drawX, drawY, drawW, drawH);
    return;
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "22px 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif";
  ctx.fillText("👧", player.x + player.w / 2, player.y + player.h / 2 + 1);
}

function drawCenterScene() {
  ctx.fillStyle = "#fff0de";
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  if (finalSceneImage.complete && finalSceneImage.naturalWidth > 0) {
    const frameW = Math.floor(CANVAS_W * 0.64);
    const frameH = Math.floor(CANVAS_H * 0.62);
    const frameX = Math.floor((CANVAS_W - frameW) / 2);
    const frameY = 16;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(frameX - 4, frameY - 4, frameW + 8, frameH + 8);
    ctx.drawImage(finalSceneImage, frameX, frameY, frameW, frameH);

    ctx.fillStyle = "#51342a";
    ctx.font = "bold 18px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText("Congrats on finding your way and saving Bittu.", CANVAS_W / 2, frameY + frameH + 34);
    ctx.fillText("He's lucky to have you", CANVAS_W / 2, frameY + frameH + 60);
    return;
  }

  ctx.fillStyle = "#51342a";
  ctx.font = "bold 34px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText("You found me!", CANVAS_W / 2, 120);
}

function updatePlayer() {
  if (!state.playing || state.finished) {
    return;
  }

  let vx = 0;
  let vy = 0;

  if (keys.ArrowUp || keys.w) vy -= player.speed;
  if (keys.ArrowDown || keys.s) vy += player.speed;
  if (keys.ArrowLeft || keys.a) vx -= player.speed;
  if (keys.ArrowRight || keys.d) vx += player.speed;

  if (vx !== 0 && vy !== 0) {
    const scale = Math.sqrt(0.5);
    vx *= scale;
    vy *= scale;
  }

  const nx = player.x + vx;
  if (!collides(nx, player.y)) {
    player.x = nx;
  }

  const ny = player.y + vy;
  if (!collides(player.x, ny)) {
    player.y = ny;
  }

  const doors = doorZones();
  const playerRect = { x: player.x, y: player.y, w: player.w, h: player.h };
  const touchingLeft = rectIntersects(playerRect, doors.left);
  const touchingRight = rectIntersects(playerRect, doors.right);

  if (state.awaitingDoorRelease) {
    if (!touchingLeft && !touchingRight) {
      state.awaitingDoorRelease = false;
    }
    return;
  }

  if (touchingLeft) {
    handleDoorChoice("left");
  } else if (touchingRight) {
    handleDoorChoice("right");
  }
}

function loop() {
  if (state.finished) {
    drawCenterScene();
  } else {
    updatePlayer();
    drawMaze();
    drawPlayer();
  }
  requestAnimationFrame(loop);
}

function restartGame() {
  state.step = 0;
  state.playing = true;
  state.finished = false;
  state.awaitingDoorRelease = false;
  state.pendingAdvance = false;
  endScreen.classList.add("hidden");
  hideFunnyPopup();
  resetToSpawn();
  loadDecision({ randomizeRoute: true });
}

window.addEventListener("keydown", (e) => {
  if (!funnyPopup.classList.contains("hidden") && e.key === "Enter") {
    popupOkBtn.click();
    e.preventDefault();
    return;
  }

  if (Object.prototype.hasOwnProperty.call(keys, e.key)) {
    keys[e.key] = true;
    e.preventDefault();
  }
});

window.addEventListener("keyup", (e) => {
  if (Object.prototype.hasOwnProperty.call(keys, e.key)) {
    keys[e.key] = false;
    e.preventDefault();
  }
});

restartBtn.addEventListener("click", restartGame);
popupOkBtn.addEventListener("click", () => {
  hideFunnyPopup();
  if (state.finished) {
    return;
  }

  if (state.pendingAdvance) {
    state.pendingAdvance = false;
    state.awaitingDoorRelease = false;
    state.step += 1;

    if (state.step >= decisionPoints.length) {
      state.finished = true;
      state.playing = false;
      showWinScreen();
      return;
    }

    resetToSpawn();
    loadDecision({ randomizeRoute: true });
    state.playing = true;
    return;
  }

  state.playing = true;
});

restartGame();
loop();
