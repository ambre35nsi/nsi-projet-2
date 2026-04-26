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


//def bfs(grille, start, end):
    // queue = deque() #comme une liste mais optimisée 
    // queue.append(start)
    
    // visited = set() #pratique pour verifier rapidement si un element y est
    // visited.add(start)
    
    // parent = {}  # pour reconstruire le chemin
    
    // while queue: #tant que la file n est pas vide
    //     x, y = queue.popleft() #donc si queue=deque([(2,3),(4,5)]) ba x=2 et y=3
        
    //     if (x, y) == end: # c est le chemin qui arrive en premier a la fin donc le plus rapide
    //         # reconstruire le chemin
    //         path = []
    //         while (x, y) != start:
    //             path.append((x, y))
    //             x, y = parent[(x, y)]
    //         path.reverse()
    //         return path
        
    //     for dx, dy in [(1,0), (-1,0), (0,1), (0,-1)]:
    //         nx, ny = x + dx, y + dy
            
    //         # vérifier limites + mur + visite
    //         if (0 <= nx < len(grille) and
    //             0 <= ny < len(grille[0]) and
    //             grille[nx][ny] == 0 and
    //             (nx, ny) not in visited):
                
    //             queue.append((nx, ny))
    //             visited.add((nx, ny))
    //             parent[(nx, ny)] = (x, y)
    
    // return None  # pas de chemin

function DirectionFantome(carte, fantomeX, fantomeY, pacmanX, pacmanY) {
  let start = [fantomeX, fantomeY] ;
  let end = [pacmanX, pacmanY] ;
  let file = [] ;
  file.push(start) ;

  let visited = newSet() ;
  visited.add(start) ;

  let parent = {} ;

  while (file.length > 0) {
    let [x, y] = file.shift() ;

    if ([x, y] == end) {
      let chemin = [] ;
      while ([x, y] != start) {
        chemin.push([x, y]) ;
        let x, y = parent[[x, y]] ;
      }
      chemin.reverse() ;
      return chemin ;
    }
    for (dx, dy in [(1,0),(-1,0),(0,1),(0,-1)]) {
      let nx, ny = x+dx, y+dy ;

      //on verifie les murs et les visités
      if (nx >= 0 && nx < carte.length && ny >= 0 && ny < carte.length && carte[nx][ny] === 0 && !visited.has([nx, ny].toString())) {
        file.push([nx, ny]) ;
        visited.add([nx, ny]) ;
        parennt[[nx, ny]] = [x, y] ;
      }
    }
  }
  return null ;
}
