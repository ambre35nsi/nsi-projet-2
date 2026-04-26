const tailleCase = 35;

// carte codée en dur 17x17
carte2 = [
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

function changerCaseCarte(x, y, valeur) {
	let ligne = carte[y];
	carte[y] = ligne.substring(0, x) + valeur + ligne.substring(x + 1);
}

// compteurs de pastilles
let pastilleMangee = 0;
let pastilleTotal = 0;

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

function start2() {

	let boutonStart = document.getElementById("btnStart");
	let boutonRestart = document.getElementById("btnRestart");

	if (boutonStart) {
		boutonStart.style.display = "none";
	}
	if (boutonRestart) {
		boutonRestart.style.display = "inline-block";
	}
	hideMessage();
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
	chargerCarte();
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
	if (win) {
		setTimeout(function() { showMessage('Bravo — tu as mangé toutes les pastilles !'); }, 50);
	} else {
		setTimeout(function() { showMessage('Game over'); }, 50);
	}
}
