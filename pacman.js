let carte;

let pacman = new Image();
pacman.src = "pacmanRight.png";
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
pacman.onload = function() {
    ctx.drawImage(pacman, 100, 100);
};

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

pacman={
    direction:null,
};

fantome={
    direction:null,
};

//fonction algo BFS a appeler dans la fonction de rafraichissement//
function DirectionFantome(){

}
