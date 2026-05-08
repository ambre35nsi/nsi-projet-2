let tailleCase = 35;
const nbCases = 17;
const tailleCaseMin = 16;

// ajuster la zone de jeu à taille de la fenêtre
function ajusterTailleJeu() {

	const canvas = document.getElementById("game");
	const container = document.getElementById("gameContainer");
	
	// on garde de la place pour les boutons et le score
	let largeurDispo = window.innerWidth - 40;
	let hauteurDispo = window.innerHeight - 220;

	if (largeurDispo < 200) largeurDispo = 200;
	if (hauteurDispo < 200) hauteurDispo = 200;

	let cote = Math.min(largeurDispo, hauteurDispo);
	tailleCase = Math.floor(cote / nbCases);

	if (tailleCase < tailleCaseMin) {
		tailleCase = tailleCaseMin;
	}

	let tailleCanvas = tailleCase * nbCases;
	canvas.width = tailleCanvas;
	canvas.height = tailleCanvas;
	canvas.style.width = tailleCanvas + "px";
	canvas.style.height = tailleCanvas + "px";

	if (container) {
		container.style.width = tailleCanvas + "px";
	}
}

// Les images de pacman par direction
let pacmanRight = new Image();
pacmanRight.src = "pacmanRight.png";
let pacmanLeft = new Image();
pacmanLeft.src = "pacmanLeft.png";
let pacmanUp = new Image();
pacmanUp.src = "pacmanUp.png";
let pacmanDown = new Image();
pacmanDown.src = "pacmanDown.png";

// image du fantome rouge
let redGhost = new Image();
redGhost.src = "redGhost.png";
// image du fantome orange
let orangeGhost = new Image();
orangeGhost.src = "orangeGhost.png";

// image de pacman en mouvement 
let pacman = new Image();
pacman.src = "pacmanRight.png"; // au départ

// valeurs pendant le jeu 
let monNiveau = 1;
let maCarte = 1;
let fantome2X = -1;
let fantome2Y = -1;
let fantome2Actif = false;

// compter les pastilles
let pastilleMangee = 0;
let pastilleTotal = 0;
let score = 0;

// variable pour la musique
let maMusique = null;

// pour la vitesse des fantômes
let tickFantome = 0;


// les cartes codées en dur 17x17

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

let carte = null;

function changerCaseCarte(x, y, valeur) {
	let ligne = carte[y];
	carte[y] = ligne.substring(0, x) + valeur + ligne.substring(x + 1);
}

const directions = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1]
];

const nomDirections = {
  droite: 0,
  gauche: 1,
  bas: 2,
  haut: 3
};

function getDirection(x, y, newX, newY) {
	if (newX > x)
		return nomDirections.droite;
	if (newX < x)
		return nomDirections.gauche;
	if (newY > y)
		return nomDirections.bas;
	if (newY < y)
		return nomDirections.haut;
}

const TypeDeplacementFantome = {
  PLUS_COURT_CHEMIN: 'PlusCourtChemin',
  AU_HASARD: 'AuHasard'
};

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

function start() {
	// remet la partie a zero (positions, score, pastilles) sans reload page
	chargerCarte(maCarte);

	let boutonStart = document.getElementById("btnStart");
	let boutonRestart = document.getElementById("btnRestart");

	if (boutonStart) {
		boutonStart.style.display = "none";
	}
	if (boutonRestart) {
		boutonRestart.style.display = "inline-block";
	}
	hideMessage();
	changerBoutonDisable(true);
	playMusic();
	if (window.gameInterval) clearInterval(window.gameInterval);
	window.gameInterval = setInterval(update, 180);
}

function recommencer() {
	// on arrete le jeu et on revient a l'ecran de depart
	if (window.gameInterval) {
		clearInterval(window.gameInterval);
		window.gameInterval = null;
	}
	stopMusic();
	chargerCarte(maCarte);

	afficherBoutonNonDemarre();
	changerBoutonDisable(false);
	hideMessage();
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
		fantomeDirection = nomDirections.droite;

		if (monNiveau === 2 && positionsFantomes.length > 1) {
			fantome2X = positionsFantomes[0].x;
			fantome2Y = positionsFantomes[0].y;
			fantome2Direction = nomDirections.droite;
			fantome2Actif = true;
		}
	}

	// compter le nombre total de pastilles et initialiser le compteur mangé
	pastilleTotal = countTotalPastilles();
	pastilleMangee = 0;
	score = 0;
	updateCountersDisplay();
	pacman.direction = "";
	pacman.directionSouhaitee = "";

	draw();

	if (num === 1 || num === 2) {
		mettreAJourBoutonsSelection();
		hideMessage();
	}
}

// gérer le déplacement des fantômes avec un algorithme IA BFS
function DirectionFantomePlusCourtChemin(carte, fantomeX, fantomeY, pacmanX, pacmanY) {
  let start = [fantomeX, fantomeY];
  let end = [pacmanX, pacmanY];
  let file = [start];

  let visited = new Set();
  visited.add(start.toString());

  let parent = {};

  while (file.length > 0) {
    let [x, y] = file.shift(); // 1ere valeur de la file retournée et retirée

    let positionStr = [x, y].toString();
    if (positionStr === end.toString()) {
      let chemin = [];

      while (positionStr !== start.toString()) {
        let [cx, cy] = positionStr.split(",").map(Number); // inverse de <chaine>.toString()
        chemin.push([cx, cy]);
        positionStr = parent[positionStr];
      }

      chemin.reverse(); // inversion du chemin pour partir de start
      return chemin;
    }

    for (let i = 0; i < directions.length; i++) {
      let dx = directions[i][0];
      let dy = directions[i][1];
      let nx = x + dx;
      let ny = y + dy;
      let voisinStr = [nx, ny].toString();

      //on verifie les limites, les murs et les cases deja visitees
      if (nx >= 0 &&
		  nx < carte[0].length &&
		  ny >= 0 &&
		  ny < carte.length &&
		  carte[ny][nx] !== "X" &&
		  !visited.has(voisinStr)
      ) {
        file.push([nx, ny]);
        visited.add(voisinStr);
        parent[voisinStr] = [x, y].toString();
      }
    }
  }

  return null;
}

function DirectionFantomeAuHasard(carte, fantomeX, fantomeY, fantomeDirection) {
  let start = [fantomeX, fantomeY];
  let chemin = [start];

  //on decide au hasard (par ex 4 chances sur 5 soit <0.80) si le fantome continue dans sa direction
  if (Math.random() < 0.80) {
    //on verifie si le fantome peut continuer dans cette direction
    let direction = directions[fantomeDirection];

	//on teste cette direction
	let nx = start[0]+direction[0];
	let ny = start[1]+direction[1];
	//on verifie les limites, les murs et les cases deja visitees
	if (nx >= 0 &&
		nx < carte[0].length &&
		ny >= 0 &&
		ny < carte.length &&
		carte[ny][nx] !== "X"
	) {
	  let chemin = [[nx, ny]];
	  return chemin;
	}
  }

  //nouvelle direction au hasard
  nomDirectionsATester = [nomDirections.droite, nomDirections.gauche, nomDirections.bas, nomDirections.haut];
  for (let i = nomDirectionsATester.length; i > 0; i--) {
	//une direction au hasard parmi celles restantes
	let nomDirection = Math.floor(Math.random() * i);
    let direction = directions[nomDirection];
	//on retire cette direction des choix
	nomDirectionsATester.splice(nomDirection, 1);

	//on teste cette direction
	let nx = start[0]+direction[0];
	let ny = start[1]+direction[1];
	//on verifie les limites, les murs et les cases deja visitees
	if (nx >= 0 &&
		nx < carte[0].length &&
		ny >= 0 &&
		ny < carte.length &&
		carte[ny][nx] !== "X"
	) {
	  let chemin = [[nx, ny]];
	  return chemin;
	}
  }
  //pas de chemin trouvé => impossible
}

function deplacerFantome(xFantome, yFantome, fantomeDirection, typeDeplacement) {
	let chemin = null;
	if (typeDeplacement === TypeDeplacementFantome.PLUS_COURT_CHEMIN) {
		chemin = DirectionFantomePlusCourtChemin(carte, xFantome, yFantome, pacmanX, pacmanY);
	}
	else if (typeDeplacement === TypeDeplacementFantome.AU_HASARD) {
		chemin = DirectionFantomeAuHasard(carte, xFantome, yFantome, fantomeDirection);
	}
	if (chemin !== null && chemin.length > 0) {
		return {
			x: chemin[0][0],
			y: chemin[0][1]
		};
	}

	return {
		x: xFantome,
		y: yFantome
	};
}

// On calcule tous les déplacement du jeu
// on vérifie si le jeu et gagné ou perdu
function move() {
	let nx = pacmanX;
	let ny = pacmanY;

    // change de direction selon direction souhaitee si possible
    if (pacman.directionSouhaitee !== pacman.direction) {
        if (pacman.directionSouhaitee === "droite" && pacmanX + 1 < carte[pacmanY].length && carte[pacmanY][pacmanX + 1] !== "X") {
            pacman.direction = "droite";
        }
        if (pacman.directionSouhaitee === "gauche" && pacmanX - 1 > 0 && carte[pacmanY][pacmanX - 1] !== "X") {
            pacman.direction = "gauche";
        }
        if (pacman.directionSouhaitee === "haut" && pacmanY - 1 > 0 && carte[pacmanY - 1][pacmanX] !== "X") {
            pacman.direction = "haut";
        }
        if (pacman.directionSouhaitee === "bas" && pacmanY + 1 < carte.length && carte[pacmanY + 1][pacmanX] !== "X") {
            pacman.direction = "bas";
        }
    }

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
			score += 10; // calcul du score
			changerCaseCarte(pacmanX, pacmanY, " ");
			updateCountersDisplay();

			// si toutes les pastilles sont mangées, le jeu est gagné
			if (pastilleTotal > 0 && pastilleMangee >= pastilleTotal) {
				endGame(true);
				return;
			}
		}
	}

	// on bouge les fantomes 1 fois sur 2 pour ralentir sinon is vont trop vite
	tickFantome++;
	if (tickFantome % 2 === 0) {
		let prochainePosition = deplacerFantome(fantomeX, fantomeY, fantomeDirection, TypeDeplacementFantome.PLUS_COURT_CHEMIN);
		fantomeDirection = getDirection(fantomeX, fantomeY, prochainePosition.x, prochainePosition.y);
		fantomeX = prochainePosition.x;
		fantomeY = prochainePosition.y;

		if (fantome2Actif) {
			let prochainePositionFantome2 = deplacerFantome(fantome2X, fantome2Y, fantome2Direction, TypeDeplacementFantome.AU_HASARD);
			fantome2Direction = getDirection(fantome2X, fantome2Y, prochainePositionFantome2.x, prochainePositionFantome2.y);
			if (prochainePositionFantome2.x !== fantomeX || prochainePositionFantome2.y !== fantomeY) {
				fantome2X = prochainePositionFantome2.x;
				fantome2Y = prochainePositionFantome2.y;
			}
		}
	}

	// si un fantome attrape pacman, on arrête le jeu, il est perdu
	if ((pacmanX === fantomeX && pacmanY === fantomeY) || (fantome2Actif && pacmanX === fantome2X && pacmanY === fantome2Y)) {
		endGame(false);
		return;
	}
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
					ctx.arc(px + tailleCase / 2, py + tailleCase / 2, Math.max(2, Math.floor(tailleCase / 8)), 0, Math.PI * 2);
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
		ctx.drawImage(orangeGhost, fantome2X * tailleCase, fantome2Y * tailleCase, tailleCase, tailleCase);
	}
}

// gère l'affichage du jeu
function update() {
	move();
	draw();
}

// gestion des touches du clavier pour diriger pacman
document.addEventListener("keydown", function(e) {
	if (e.key === "ArrowRight") {
		pacman.directionSouhaitee = "droite";
	}
	if (e.key === "ArrowLeft") {
		pacman.directionSouhaitee = "gauche";
	}
	if (e.key === "ArrowUp") {
		pacman.directionSouhaitee = "haut";
	}
	if (e.key === "ArrowDown") {
		pacman.directionSouhaitee = "bas";
	}
});

// chargement du jeu
window.onload = function() {
	ajusterTailleJeu();
	chargerCarte(1);
};

// on redessine le jeu si la taille de la fenêtre change
window.addEventListener("resize", function() {
	ajusterTailleJeu();
	if (typeof carte !== "undefined") {
		draw();
	}
});

// on affiche si le jeu est gagné ou perdu
function endGame(win) {

	if (window.gameInterval) {
		clearInterval(window.gameInterval);
		window.gameInterval = null;
	}

	const bs = document.getElementById('btnStart');
	const br = document.getElementById('btnRestart');

	if (bs) bs.style.display = 'none';
	if (br) br.style.display = 'inline-block';

	changerBoutonDisable(false);
	stopMusic();

	if (win) {
		setTimeout(function() { showMessage('Win !'); }, 50);
	} else {
		setTimeout(function() { showMessage('Game over'); }, 50);
	}

	afficherBoutonNonDemarre();
}

// si jeu est pas démarré, on affiche que le bouton commencer
// si jeu est démmarré, on affiche que le bouton recommencer
function afficherBoutonNonDemarre() {

	let boutonStart = document.getElementById("btnStart");
	let boutonRestart = document.getElementById("btnRestart");	
	
	if (boutonStart) boutonStart.style.display = "inline-block";
	if (boutonRestart) boutonRestart.style.display = "none";
}

// si jeu démarré, on ne peut pas changer le niveau et la carte
function changerBoutonDisable(disabled) {
	const n1 = document.getElementById('btnNiveau1');
	const n2 = document.getElementById('btnNiveau2');
	const c1 = document.getElementById('btnCarte1');
	const c2 = document.getElementById('btnCarte2');
	
	if (n1) n1.disabled = disabled;
	if (n2) n2.disabled = disabled;
	if (c1) c1.disabled = disabled;
	if (c2) c2.disabled = disabled;

}