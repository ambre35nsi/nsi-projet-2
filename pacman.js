let carte;
let pacmanX = 0;
let pacmanY = 0;

let fantomeX = 8;
let fantomeY = 8;

let pacmanRight = new Image();
pacmanRight.src = "pacmanRight.png";
let pacmanLeft = new Image();
pacmanLeft.src = "pacmanLeft.png";
let pacmanUp = new Image();
pacmanUp.src = "pacmanUp.png";
let pacmanDown = new Image();
pacmanDown.src = "pacmanDown.png";

let redGhost = new Image();
redGhost.src = "redGhost.png";

function start() {
    alert("")
  setInterval(refresh, 1000);
}

//fon,ction de rafraivhissement ou on appelle les fct necessaires
function refresh() {}

let pacman = new Image();
pacman.src = "pacmanRight.png";

let fantome;

carte = [
  "XXXXXXXXXXXXXXXXX",
  "XFOOOOXOOOXOOOOOX",
  "XOXXXOXOXOXOXXXOX",
  "XOXOOOXOXOXOOOXOX",
  "XOXOXOXOXOXOXOXOX",
  "XOXOXOXOXOXOXOXOX",
  "XOXOXOOOOOOOXOXOX",
  "XOOOOOXXXXXOOOOOX",
  "XXXXXOOOPOOOXXXXX",
  "XOOOOOXXXXXOOOOOX",
  "XOXOXOOOOOOOXOXOX",
  "XOXOXOXOXOXOXOXOX",
  "XOXOXOXOXOXOXOXOX",
  "XOXOOOXOXOXOOOXOX",
  "XOXXXOXOXOXOXXXOX",
  "XFOOOOXOOOXOOOOOX",
  "XXXXXXXXXXXXXXXXX",
];

pacman = {
  direction: null,
};

//fonction algo BFS a appeler dans la fonction de rafraichissement
function DirectionFantome() {}
