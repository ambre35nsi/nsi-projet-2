const tailleCase = 35;
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

// carte codée en dur 17x17
carte1 = [
  "XXXXXXXXXXXXXXXXX",
  "XOOOOOXOOOXOOOOOX",
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

carte2 = [
	"XXXXXXXXXXXXXXXXX",
	"XOOOOXOOOOOXXXOOX",
	"XOXOXOXOXOXOXOXOX",
	"XOXOOOXOXOXOOOXOX",
	"XOXOXOXXXXXOXOXOX",
	"XOXOXOXOOOOOXOXOX",
	"XOXOXOOOOOOOXOXOX",
	"XOOOOOXXXOOOOOOOX",
	"XXXOOOPOOOOXXXFXX",
	"XOOOOOXXXOOOOOOOX",
	"XOXOXOOOOOOOXOXOX",
	"XOXOXOXOXOXOXOXOX",
	"XOXOXOXOXOXOXOXOX",
	"XOXOOOXOXOXOOOXOX",
	"XOXXXOXOXOXOXXXOX",
	"XOOOOOXOOOXOOOOOX",
	"XXXXXXXXXXXXXXXXX",
];

function changerCaseCarte(x, y, valeur) {
	let ligne = carte[y];
	carte[y] = ligne.substring(0, x) + valeur + ligne.substring(x + 1);
}

// compteurs de pastilles
let pastilleMangee = 0;
let pastilleTotal = 0;
// musique de fond
let gameMusic = null;

function updateCountersDisplay() {
	const textPastilleMangee = document.getElementById('spanPastilleMangee');
	const textPastilleMangeeTotal = document.getElementById('spanPastilleTotal');
	if (textPastilleMangee) textPastilleMangee.textContent = pastilleMangee;
	if (textPastilleMangeeTotal) textPastilleMangeeTotal.textContent = pastilleTotal;
}

function countTotalPastilles() {
	let c = 0;
	for (let y = 0; y < carte.length; y++) {
		for (let x = 0; x < carte[y].length; x++) {
			if (carte[y][x] === 'O') c++;
		}
	}
	return c;
}

function start() {

	let boutonStart = document.getElementById("btnStart");
	let boutonRestart = document.getElementById("btnRestart");

	if (boutonStart) {
		boutonStart.style.display = "none";
	}
	if (boutonRestart) {
		boutonRestart.style.display = "inline-block";
	}
	hideMessage();
	setMapButtonsDisabled(true);
	playMusic();
	if (window.gameInterval) clearInterval(window.gameInterval);
  	window.gameInterval = setInterval(refresh, 180);
}

function showMessage(msg) {
	const el = document.getElementById('gameMessage');
	if (el) {
		el.textContent = msg;
		el.style.display = 'block';
	}
}

function hideMessage() {
	const el = document.getElementById('gameMessage');
	if (el) {
		el.style.display = 'none';
		el.textContent = '';
	}
}

function setMapButtonsDisabled(disabled) {
	const b1 = document.getElementById('btnCarte1');
	const b2 = document.getElementById('btnCarte2');
	if (b1) b1.disabled = disabled;
	if (b2) b2.disabled = disabled;
}

function playMusic() {
	try {
		if (!gameMusic) {
			gameMusic = new Audio('pacman.mp3');
			gameMusic.loop = true;
		}
		gameMusic.currentTime = 0;
		// play() returns a promise — ignore rejections caused by autoplay policies
		gameMusic.play().catch(function() {});
	} catch (e) {
		console.log('Impossible de jouer la musique :', e);
	}
}

function stopMusic() {
	try {
		if (gameMusic) {
			gameMusic.pause();
			gameMusic.currentTime = 0;
		}
	} catch (e) {
		console.log('Impossible d arreter la musique :', e);
	}
}

function recommencer() {
	location.reload();
}

function dessiner() {
	const canvas = document.getElementById("game");
	const ctx = canvas.getContext("2d");

	// on dessine la carte case par case
	for (let y = 0; y < carte.length; y++) {
		for (let x = 0; x < carte[y].length; x++) {
			let px = x * tailleCase;
			let py = y * tailleCase;

			if (carte[y][x] === "X") {
				ctx.fillStyle = "#1a2cff";
				ctx.fillRect(px, py, tailleCase, tailleCase);
			} else {
				ctx.fillStyle = "#000000";
				ctx.fillRect(px, py, tailleCase, tailleCase);

				if (carte[y][x] === "O") {
					ctx.fillStyle = "#f7e85c";
					ctx.beginPath();
					ctx.arc(px + tailleCase / 2, py + tailleCase / 2, 4, 0, Math.PI * 2);
					ctx.fill();
				}
			}
		}
	}

	// on place pacman et le fantome
	let imagePacman = pacmanRight;
	if (pacman.direction === "gauche") imagePacman = pacmanLeft;
	if (pacman.direction === "haut") imagePacman = pacmanUp;
	if (pacman.direction === "bas") imagePacman = pacmanDown;

	ctx.drawImage(imagePacman, pacmanX * tailleCase, pacmanY * tailleCase, tailleCase, tailleCase);
	ctx.drawImage(redGhost, fantomeX * tailleCase, fantomeY * tailleCase, tailleCase, tailleCase);
}

function chargerCarte() {
	// on cherche les positions de depart dans la carte
	for (let y = 0; y < carte.length; y++) {
		for (let x = 0; x < carte[y].length; x++) {
			if (carte[y][x] === "P") {
				pacmanX = x;
				pacmanY = y;
			}
			if (carte[y][x] === "F") {
				fantomeX = x;
				fantomeY = y;
			}
		}
	}

	// compter le nombre total de pastilles et initialiser le compteur mangé
	pastilleTotal = countTotalPastilles();
	pastilleMangee = 0;
	updateCountersDisplay();

	dessiner();
}

// charger la carte 1 (par défaut)
function chargerCarte1() {
	carte = [...carte1];
	chargerCarte();
	hideMessage();
}

// charger la carte 2 (ambree)
function chargerCarte2() {
	carte = [...carte2];
	chargerCarte();
	hideMessage();
}

function DirectionFantome(carte, fantomeX, fantomeY, pacmanX, pacmanY) {
  let start = [fantomeX, fantomeY];
  let end = [pacmanX, pacmanY];
  let file = [start];

  let visited = new Set();
  visited.add(start.toString());

  let parent = {};
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (file.length > 0) {
    let [x, y] = file.shift();

    let positionStr = [x, y].toString();
    if (positionStr === end.toString()) {
      let chemin = [];

      while (positionStr !== start.toString()) {
        let [cx, cy] = positionStr.split(",").map(Number);
        chemin.push([cx, cy]);
        positionStr = parent[positionStr];
      }

      chemin.reverse();
      return chemin;
    }

    for (let i = 0; i < directions.length; i++) {
      let dx = directions[i][0];
      let dy = directions[i][1];
      let nx = x + dx;
      let ny = y + dy;
      let cleVoisin = [nx, ny].toString();

      //on verifie les limites, les murs et les cases deja visitees
      if (
        nx >= 0 &&
        nx < carte.length &&
        ny >= 0 &&
        ny < carte[nx].length &&
        carte[nx][ny] !== "X" &&
        !visited.has(cleVoisin)
      ) {
        file.push([nx, ny]);
        visited.add(cleVoisin);
        parent[cleVoisin] = [x, y].toString();
      }
    }
  }

  return null;
}

function refresh() {
	// on calcule la prochaine position de pacman
	let nx = pacmanX;
	let ny = pacmanY;

	if (pacman.direction === "droite") nx = pacmanX + 1;
	if (pacman.direction === "gauche") nx = pacmanX - 1;
	if (pacman.direction === "haut")   ny = pacmanY - 1;
	if (pacman.direction === "bas")    ny = pacmanY + 1;

	// on bouge pacman seulement si c'est dans la carte et pas un mur
	if (ny >= 0 && ny < carte.length && nx >= 0 && nx < carte[ny].length && carte[ny][nx] !== "X") {
		pacmanX = nx;
		pacmanY = ny;

		// si pacman passe sur une pastille, on la mange
		if (carte[pacmanY][pacmanX] === "O") {
			pastilleMangee++;
			changerCaseCarte(pacmanX, pacmanY, " ");
			updateCountersDisplay();

			// si toutes les pastilles sont mangées, terminer le jeu
			if (pastilleTotal > 0 && pastilleMangee >= pastilleTotal) {
				endGame(true);
			}
		}
	}

	// on bouge le fantome avec le BFS
	let chemin = DirectionFantome(carte, fantomeX, fantomeY, pacmanX, pacmanY);
	if (chemin !== null && chemin.length > 0) {
		fantomeX = chemin[0][1];
		fantomeY = chemin[0][0];
	}

	dessiner();
}

// gestion des touches du clavier pour diriger pacman
document.addEventListener("keydown", function(e) {
	if (e.key === "ArrowRight") {
		pacman.direction = "droite";
	}
	if (e.key === "ArrowLeft") {
		pacman.direction = "gauche";
	}
	if (e.key === "ArrowUp") {
		pacman.direction = "haut";
	}
	if (e.key === "ArrowDown") {
		pacman.direction = "bas";
	}
});

window.onload = function() {
	chargerCarte1();
};

function endGame(win) {
	if (window.gameInterval) {
		clearInterval(window.gameInterval);
		window.gameInterval = null;
	}
	const bs = document.getElementById('btnStart');
	const br = document.getElementById('btnRestart');
	if (bs) bs.style.display = 'none';
	if (br) br.style.display = 'inline-block';
	setMapButtonsDisabled(false);
	stopMusic();
	if (win) {
		setTimeout(function() { showMessage('Bravo — tu as mangé toutes les pastilles !'); }, 50);
	} else {
		setTimeout(function() { showMessage('Game over'); }, 50);
	}
}
