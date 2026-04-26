const tailleCase = 35;
const carteSecours = [
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

if (typeof pacmanX === "undefined") {
	pacmanX = 0;
}
if (typeof pacmanY === "undefined") {
	pacmanY = 0;
}
if (typeof fantomeX === "undefined") {
	fantomeX = 8;
}
if (typeof fantomeY === "undefined") {
	fantomeY = 8;
}

function getCarteJeu() {
	if (typeof carte !== "undefined" && Array.isArray(carte)) {
		return carte;
	}
	return carteSecours;
}

function getImagePacman() {
	if (typeof pacmanRight !== "undefined") {
		return pacmanRight;
	}
	const image = new Image();
	image.src = "pacmanRight.png";
	return image;
}

function getImageFantome() {
	if (typeof redGhost !== "undefined") {
		return redGhost;
	}
	const image = new Image();
	image.src = "redGhost.png";
	return image;
}

function trouverPositionsDepart(carteJeu) {
	for (let y = 0; y < carteJeu.length; y++) {
		for (let x = 0; x < carteJeu[y].length; x++) {
			if (carteJeu[y][x] === "P") {
				pacmanX = x;
				pacmanY = y;
			}

			if (carteJeu[y][x] === "F") {
				fantomeX = x;
				fantomeY = y;
			}
		}
	}
}

function chargerCarte() {
	const canvas = document.getElementById("game");
	if (!canvas) {
		return;
	}

	const ctx = canvas.getContext("2d");
	if (!ctx) {
		return;
	}

	const carteJeu = getCarteJeu();
	const imagePacman = getImagePacman();
	const imageFantome = getImageFantome();

	trouverPositionsDepart(carteJeu);

	for (let y = 0; y < carteJeu.length; y++) {
		for (let x = 0; x < carteJeu[y].length; x++) {
			const c = carteJeu[y][x];
			const px = x * tailleCase;
			const py = y * tailleCase;

			if (c === "X") {
				ctx.fillStyle = "#1a2cff";
				ctx.fillRect(px, py, tailleCase, tailleCase);
			} else {
				ctx.fillStyle = "#000000";
				ctx.fillRect(px, py, tailleCase, tailleCase);

				if (c === "O") {
					ctx.fillStyle = "#f7e85c";
					ctx.beginPath();
					ctx.arc(px + tailleCase / 2, py + tailleCase / 2, 4, 0, Math.PI * 2);
					ctx.fill();
				}
			}
		}
	}

	if (imagePacman.complete) {
		ctx.drawImage(imagePacman, pacmanX * tailleCase, pacmanY * tailleCase, tailleCase, tailleCase);
	} else {
		imagePacman.onload = function () {
			ctx.drawImage(imagePacman, pacmanX * tailleCase, pacmanY * tailleCase, tailleCase, tailleCase);
		};
	}

	if (imageFantome.complete) {
		ctx.drawImage(imageFantome, fantomeX * tailleCase, fantomeY * tailleCase, tailleCase, tailleCase);
	} else {
		imageFantome.onload = function () {
			ctx.drawImage(imageFantome, fantomeX * tailleCase, fantomeY * tailleCase, tailleCase, tailleCase);
		};
	}
}

window.onload = function () {
	chargerCarte();
};
