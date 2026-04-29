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

let pacman = new Image();
pacman.src = "pacmanRight.png";

let monNiveau = 1;
let maCarte = 1;
let fantome2X = -1;
let fantome2Y = -1;
let fantome2Actif = false;

// compter les pastilles
let pastilleMangee = 0;
let pastilleTotal = 0;
let score = 0;

let maMusique = null;


// carte codée en dur 17x17
const carte1 = [
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
]

const carte2 = [
	"XXXXXXXXXXXXXXXXX",
	"XOOOOXXXXXXXXXOOX",
	"XFXOXOXOXOXOXOXOX",
	"XOXOOOXOXOXOOOXOX",
	"XOXOXOOOOOOOXOXOX",
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



function updateCountersDisplay() {
	const textPastilleMangee = document.getElementById('spanPastilleMangee');
	const textPastilleMangeeTotal = document.getElementById('spanPastilleTotal');
	if (textPastilleMangee) textPastilleMangee.textContent = score;
	if (textPastilleMangeeTotal) textPastilleMangeeTotal.textContent = pastilleTotal * 10;
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
	changerBoutonOnOff(true);
	playMusic();
	if (window.gameInterval) clearInterval(window.gameInterval);
	  window.gameInterval = setInterval(update, 180);
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

function changerBoutonOnOff(disabled) {
	const n1 = document.getElementById('btnNiveau1');
	const n2 = document.getElementById('btnNiveau2');
	const b1 = document.getElementById('btnCarte1');
	const b2 = document.getElementById('btnCarte2');
	const b3 = document.getElementById('btnCarte3');
	if (n1) n1.disabled = disabled;
	if (n2) n2.disabled = disabled;
	if (b1) b1.disabled = disabled;
	if (b2) b2.disabled = disabled;
	if (b3) b3.disabled = disabled;
}

function playMusic() {

	try {

	if (!maMusique) {
			maMusique = new Audio('pacman.mp3');
			maMusique.loop = true;
		}

		maMusique.currentTime = 0;
		
		maMusique.play();
	} catch (e) {
		alert('Impossible de jouer la musique : ');
	}
}

function stopMusic() {
		if (maMusique) {
			maMusique.pause();
			maMusique.currentTime = 0;
		}
}

function recommencer() {
	location.reload();
}

function mettreAJourBoutonsSelection() {
	const btnNiveau1 = document.getElementById("btnNiveau1");
	const btnNiveau2 = document.getElementById("btnNiveau2");
	const btnCarte1 = document.getElementById("btnCarte1");
	const btnCarte2 = document.getElementById("btnCarte2");

	if (btnNiveau1) btnNiveau1.style.backgroundColor = (monNiveau === 1) ? "#1e8e3e" : "#0026a3";
	if (btnNiveau2) btnNiveau2.style.backgroundColor = (monNiveau === 2) ? "#1e8e3e" : "#0026a3";

	if (btnCarte1) btnCarte1.style.backgroundColor = (maCarte === 1) ? "#1e8e3e" : "#0026a3";
	if (btnCarte2) btnCarte2.style.backgroundColor = (maCarte === 2) ? "#1e8e3e" : "#0026a3";
}

function changerNiveau(niveau) {
	monNiveau = niveau;
	chargerCarte(maCarte);
	mettreAJourBoutonsSelection();
	hideMessage();
}

function deplacerFantome(xFantome, yFantome) {
	let chemin = DirectionFantome(carte, xFantome, yFantome, pacmanX, pacmanY);
	if (chemin !== null && chemin.length > 0) {
		return {
			x: chemin[0][1],
			y: chemin[0][0]
		};
	}

	return {
		x: xFantome,
		y: yFantome
	};
}

function draw() {
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
	if (fantome2Actif) {
		ctx.drawImage(redGhost, fantome2X * tailleCase, fantome2Y * tailleCase, tailleCase, tailleCase);
	}
}

function chargerCarte(num) {
	if (num === 1 || num === 2) {
		maCarte = num;
		if (num === 1) {
			carte = [...carte1];
		} else {
			carte = [...carte2];
		}
	} else
	{
		alert("Carte invalide, chargement de la carte 1.");
		carte = [...carte1];
	}

	let positionsFantomes = [];
	fantome2Actif = false;
	fantome2X = -1;
	fantome2Y = -1;

	// on cherche les positions de depart dans la carte
	for (let y = 0; y < carte.length; y++) {
		for (let x = 0; x < carte[y].length; x++) {
			if (carte[y][x] === "P") {
				pacmanX = x;
				pacmanY = y;
			}
			if (carte[y][x] === "F") {
				positionsFantomes.push({ x: x, y: y });
			}
		}
	}

	if (positionsFantomes.length > 0) {
		let dernierFantome = positionsFantomes[positionsFantomes.length - 1];
		fantomeX = dernierFantome.x;
		fantomeY = dernierFantome.y;

		if (monNiveau === 2 && positionsFantomes.length > 1) {
			fantome2X = positionsFantomes[0].x;
			fantome2Y = positionsFantomes[0].y;
			fantome2Actif = true;
		}
	}

	// compter le nombre total de pastilles et initialiser le compteur mangé
	pastilleTotal = countTotalPastilles();
	pastilleMangee = 0;
	score = 0;
	updateCountersDisplay();

	draw();

	if (num === 1 || num === 2) {
		mettreAJourBoutonsSelection();
		hideMessage();
	}
}

// changer la carte
function changerCarte(num) {
	chargerCarte(num);
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

function move() {
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
			score += 10;
			changerCaseCarte(pacmanX, pacmanY, " ");
			updateCountersDisplay();

			// si toutes les pastilles sont mangées, terminer le jeu
			if (pastilleTotal > 0 && pastilleMangee >= pastilleTotal) {
				endGame(true);
				return;
			}
		}
	}

	// on bouge le fantome avec le BFS
	let prochainePosition = deplacerFantome(fantomeX, fantomeY);
	fantomeX = prochainePosition.x;
	fantomeY = prochainePosition.y;

	if (fantome2Actif) {
		let prochainePositionFantome2 = deplacerFantome(fantome2X, fantome2Y);
		fantome2X = prochainePositionFantome2.x;
		fantome2Y = prochainePositionFantome2.y;
	}

	if ((pacmanX === fantomeX && pacmanY === fantomeY) || (fantome2Actif && pacmanX === fantome2X && pacmanY === fantome2Y)) {
		endGame(false);
		return;
	}

	if (pastilleTotal > 0 && pastilleMangee >= pastilleTotal) {
		endGame(true);
		return;
	}
}

function update() {
	move();
	draw();
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
	changerCarte(1);
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
	changerBoutonOnOff(false);
	stopMusic();
	if (win) {
		setTimeout(function() { showMessage('Win !'); }, 50);
	} else {
		setTimeout(function() { showMessage('Game over'); }, 50);
	}
}
