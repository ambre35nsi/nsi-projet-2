La structure générale du projet

OBJECTIF : Notre objectif est de créer un jeu de course dans un labyrinthe avec ennemi(s) essayant de piéger le joueur en trouvant le chemin le plus court.
Nous allons soit mettre une limite de temps, soit des petits points à manger pour gagner des points.

MODULES :
Les images des personnages seront en .gif

1)HTML
Nous voulons créer le div container (le labyrinthe).

2)JAVASCRIPT
Mettre une fonction pour charger les images présentes dans le jeu (fantôme, pacman et mur).
Également mettre une fonction pour charger la carte en fonction du tableau.
Créer des div différents pour chaque case du tableau.
Une fonction de rafraichissement (la principale qui appelle toutes les autres fonctions).
L'algorithme BFS sera pour l’IA du fantôme, qui calculera le chemin le plus court menant au joueur à chaque déplacement.
 https://en.wikipedia.org/wiki/Breadth-first_search

3)FICHIER CSS
Il y aura des classes (pour le joueur, le fantôme, les pastilles, les murs).
 
Les interactions entre les fonctions et modules
 
Les choix de structures de données
-	Un tableau de chaines de caractères représentant la carte du jeu (les valeurs X seront des murs, P le Pac-Man et F le fantôme et vide les cases vides contenant une pastille sont O, 1 ligne de la carte=1valeur du tableau (soit une chaine de caractères))
[XXXXXXXXXXXXXXXXX,XFOOOOXOOOXOOOOOX,XOXXXOXOXOXOXXXOX,XOXOOOXOXOXOOOXOX,XOXOXOXOXOXOXOXOX,XOXOXOXOXOXOXOXOX,XOXOXOOOOOOOXOXOX,XOOOOOXXXXXOOOOOX,XXXXXOOOPOOOXXXXX,XOOOOOXXXXXOOOOOX,XOXOXOOOOOOOXOXOX,XOXOXOXOXOXOXOXOX,XOXOXOXOXOXOXOXOX,XOXOOOXOXOXOOOXOX,XOXXXOXOXOXOXXXOX,XFOOOOXOOOXOOOOOX,XXXXXXXXXXXXXXXXX]
-	Structure contenant les coordonnés et l'image d’un élément mobile

La répartition du travail entre les membres du groupe
-	Eugenie : style de carte, direction_fantome, window onload, creer le tableau de carte
-	Ambre : direction_joueur, rafraichir, charger_images
-	Nouha : background color, afficher_elements, fonction score