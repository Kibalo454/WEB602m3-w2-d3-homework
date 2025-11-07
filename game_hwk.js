// on page load -> generate game board
window.addEventListener("load", () => {
  console.log("Page Loaded");
  setRandomTileOrder(12);
  setTiles();
});

// globals
let i = 0;
let clicks = 0;
let timeScore = 0;
let count = 0;
let timer = null;
let n = 0;

let randomOrderArray = [];

// controls
const startButton = document.getElementById("startGame");
document.getElementById("endGame").addEventListener("click", endGame);
startButton.addEventListener("click", startGame);

// tiles NodeList
const tiles = document.querySelectorAll(".gametile");

// icons
const football = `<i class="fas fa-football-ball"></i>`;
const mask = `<i class="fas fa-ufo"></i>`;
const pizza = `<i class="fas fa-pizza-slice"></i>`;
const lightning = `<i class="far fa-bolt"></i>`;
const bulb = `<i class="fal fa-lightbulb"></i>`;
const rocket = `<i class="fas fa-rocket"></i>`;
const bacteria = `<i class="fas fa-bacterium"></i>`;
const kiwi = `<i class="fas fa-kiwi-bird"></i>`;
const cocktail = `<i class="fas fa-cocktail"></i>`;

let selectedTile = "";
let tileIcon;
let tileIcons = [];
let tileIds = [];

/* ----- game flow ----- */

const startGame = () => {
  // fresh state
  clearInterval(timer);
  document.getElementById("timer").textContent = "0";
  document.getElementById("clicks").textContent = "0";
  document.getElementById("score").textContent = "0";

  clicks = 0;
  timeScore = 0;
  count = 0;
  n = 0;
  tileIcons = [];
  tileIds = [];

  // new board
  randomOrderArray = [];
  setRandomTileOrder(12);
  setTiles();
  resetTiles();

  // listeners
  tiles.forEach((tile) => tile.addEventListener("click", displayTile, { once: false }));

  startButton.disabled = true;
  startTimer();
};

const endGame = () => {
  const endTimer = () => {
    const tText = document.getElementById("timer").textContent;
    const parsed = parseInt(tText, 10);
    timeScore = Number.isNaN(parsed) ? 60 : parsed; // if "Game Over", treat as 60
    clearInterval(timer);
    timer = null;
  };

  endTimer();
  startButton.textContent = "New Game";
  startButton.disabled = false;
  calculateScore();
};

/* ----- helpers ----- */

const setRandomTileOrder = (numberOfTiles) => {
  while (randomOrderArray.length < numberOfTiles) {
    const randomNum = Math.floor(Math.random() * numberOfTiles) + 1; // unbiased 1..N
    if (!randomOrderArray.includes(randomNum)) randomOrderArray.push(randomNum);
  }
};

const setTiles = () => {
  i = 0; // reset index each time
  for (const tile of tiles) {
    tile.innerHTML = randomOrderArray[i];
    const num = Number(tile.textContent);
    i++;

    if (num < 3) {
      tile.innerHTML = rocket;
      tile.setAttribute("icon", "rocket");
    } else if (num < 5) {
      tile.innerHTML = bacteria;
      tile.setAttribute("icon", "bacteria");
    } else if (num < 7) {
      tile.innerHTML = cocktail;
      tile.setAttribute("icon", "cocktail");
    } else if (num < 9) {
      tile.innerHTML = football;
      tile.setAttribute("icon", "football");
    } else if (num < 11) {
      tile.innerHTML = pizza;
      tile.setAttribute("icon", "pizza");
    } else if (num < 13) {
      tile.innerHTML = kiwi;
      tile.setAttribute("icon", "kiwi");
    } else {
      console.log("Error: too many tiles");
    }
  }
};

const startTimer = () => {
  clearInterval(timer);
  count = 0;
  timer = setInterval(() => {
    count += 1;
    document.getElementById("timer").textContent = String(count);

    if (count === 60) {
      clearInterval(timer);
      timer = null;
      document.getElementById("timer").textContent = "Game Over";
    }
  }, 1000);
};

const displayTile = (e) => {
  const tileEl = e.currentTarget;

  tileEl.classList.remove("hideTile");
  tileEl.classList.add("displayTile");

  tileIcon = tileEl.getAttribute("icon");
  tileIcons.push(tileIcon);

  const tileId = tileEl.getAttribute("id");
  tileIds.push(tileId);

  countMoves();

  if (tileIcons.length % 2 === 0) {
    checkMatch(tileIcons, tileIds, n);
    n += 2;
  }
};

const checkMatch = (icons, ids, idx) => {
  if (icons[idx] !== icons[idx + 1]) {
    setTimeout(() => {
      const a = document.getElementById(ids[idx]);
      const b = document.getElementById(ids[idx + 1]);
      a.classList.remove("displayTile");
      b.classList.remove("displayTile");
      a.classList.add("hideTile");
      b.classList.add("hideTile");
    }, 1000);
  } else {
    const a = document.getElementById(ids[idx]);
    const b = document.getElementById(ids[idx + 1]);
    a.style.backgroundColor = "green";
    b.style.backgroundColor = "green";
    a.setAttribute("guess", "correct");
    b.setAttribute("guess", "correct");
    a.removeEventListener("click", displayTile);
    b.removeEventListener("click", displayTile);
  }
};

const countMoves = () => {
  clicks = n; // preserves original semantics
  document.getElementById("clicks").textContent = String(clicks);
};

const clearTiles = () => {
  for (let k = 0; k < tiles.length; k++) {
    tiles[k].style.fontSize = "0em";
    tiles[k].style.backgroundColor = "#44445a";
  }
};

const calculateScore = () => {
  const t = parseInt(timeScore, 10);
  const safeTime = Number.isNaN(t) ? 60 : t;
  const calculatedScore = safeTime + (clicks || 0);
  console.log(calculatedScore);
  document.querySelector("#score").textContent = String(calculatedScore);
};

let newRGB;
const generateRGBVal = () => {
  const generateRandomColor = () => Math.round(Math.random() * 255);
  const rgbValue = [generateRandomColor(), generateRandomColor(), generateRandomColor()];
  newRGB = `rgb(${rgbValue[0]},${rgbValue[1]},${rgbValue[2]})`;
  return newRGB;
};

const resetTiles = () => {
  for (const tile of tiles) {
    tile.style.backgroundColor = "#44445a";
    tile.removeAttribute("state");
    tile.classList.add("hideTile");
    tile.classList.remove("displayTile");
  }
};
