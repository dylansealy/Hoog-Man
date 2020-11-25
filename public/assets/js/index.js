// p5 specifieke JavaScript.

// Functie voor het bepalen van de dimensies van het main element.
const getMainDimensions = () => {
    const main = document.querySelector("main");
    const height = main.offsetHeight;
    const width = main.offsetWidth;
    if (width > height) {return height;}
    else {return width;}
}
// vars is een object. Binnen een object hebben je key/value pairs.
const vars = {}
// Declareert benodigde variabelen voor de game.
const initializeVars = () => {
    // Definieert canvas dimensie. - 1 om ervoor te zorgen dat er geen scrollbars komen.
    vars.canvasDimension = getMainDimensions() - 1;
    // Definieert de startpunten van de buitenlijnen van het spelbord.
    vars.xOuter = vars.canvasDimension / 60;
    vars.yOuter = vars.xOuter;
    vars.xInner = vars.xOuter * 2;
    vars.yInner = vars.xInner;
    // Definieert de hoogte en breedte van het spelbord.
    vars.outerHeight = vars.canvasDimension - vars.yOuter * 6;
    vars.outerWidth = vars.canvasDimension - vars.xOuter * 2;
    vars.innerHeight = vars.canvasDimension - vars.yInner * 4;
    vars.innerWidth = vars.canvasDimension - vars.yInner * 2;
    // Definieert de dimensie eenheden van het spelbord.
    vars.heightUnit = vars.innerHeight / 14;
    vars.widthUnit = vars.innerWidth / 17;
    // definieert de positie en grootte van pacman 
    vars.xPacman = 100;
    vars.yPacman = 150;
    vars.rPacman = 50;
    // Zorgt voor het vasthouden van een kant op gaan van pacman
    vars.linksPac = false;
    vars.rechtsPac = false;
    vars.bovenPac = false;
    vars.onderPac = false;
}
// Functie voor het tekenen van de buitenlijnen.
// const playIntroSound = (p, introSound) => {
//     p.push();
//     p.noLoop();
//     introSound.play();
//     p.pop();
// }
const outerLines = p => {
    p.push();
    p.strokeWeight(3);
    p.rect(vars.xOuter, vars.yOuter, vars.outerWidth, vars.outerHeight, 10);
    p.rect(vars.xInner, vars.yInner, vars.innerWidth, vars.innerHeight, 4);
    p.pop();
}
// Functie voor het tekenen van de buitenlijn doorgangen.
const outerLinesGap = p => {
    p.push();
    p.stroke("black");
    p.strokeWeight(4);
    p.rect(vars.xInner + vars.widthUnit, vars.yOuter, vars.widthUnit, 0);
    p.rect(vars.xInner + vars.widthUnit, vars.yInner, vars.widthUnit, 0);
    p.rect(vars.xInner + vars.widthUnit, vars.yOuter + vars.outerHeight, vars.widthUnit, 0);
    p.rect(vars.xInner + vars.widthUnit, vars.yInner + vars.innerHeight, vars.widthUnit, 0);
    p.pop();
}
// Functie voor het tekenen van de gele bolletjes.
const candy = p => {
    p.push();
    p.stroke("yellow");
    p.fill("yellow");
    for (let i = 0; i < 14; i++) {
        for (let j = 0; j < 17; j++) {
            p.circle(vars.xInner + vars.widthUnit * (0.5 + j), vars.yInner + vars.heightUnit * (0.5 + i), vars.widthUnit * 0.25);
        }
    }
    p.pop();
}
// Functie voor het tekenen van alle barrières.
const obstacles = p => {
    p.push();
    p.fill("black");
    // Voor de volgorde zie maps 1.jpg.
    // 1
    p.rect(vars.xInner + vars.widthUnit, vars.yInner + vars.heightUnit, vars.widthUnit * 2, vars.heightUnit * 3, 4);
    // 2
    p.rect(vars.xInner + vars.widthUnit * 4, vars.yInner, vars.widthUnit, vars.heightUnit * 4, 4);
    // 3
    p.rect(vars.xInner + vars.widthUnit * 6, vars.yInner + vars.heightUnit, vars.widthUnit * 2, vars.heightUnit * 3, 4);
    // 4
    p.rect(vars.xInner + vars.widthUnit * 9, vars.yInner, vars.widthUnit, vars.heightUnit * 3, 4);
    // 5
    p.rect(vars.xInner + vars.widthUnit * 11, vars.yInner + vars.heightUnit, vars.widthUnit * 2, vars.heightUnit * 2, 4);
    // 6
    p.rect(vars.xInner + vars.widthUnit * 14, vars.yInner, vars.widthUnit * 3, vars.heightUnit * 2, 4);
    // 7
    p.rect(vars.xInner, vars.yInner + vars.heightUnit * 5, vars.widthUnit, vars.heightUnit * 3, 4);
    // 8
    p.rect(vars.xInner + vars.widthUnit * 2, vars.yInner + vars.heightUnit * 5, vars.widthUnit * 2, vars.heightUnit * 3, 4);
    // 9
    p.rect(vars.xInner + vars.widthUnit * 5, vars.yInner + vars.heightUnit * 5, vars.widthUnit * 2, vars.heightUnit, 4);
    // 10
    p.rect(vars.xInner + vars.widthUnit * 8, vars.yInner + vars.heightUnit * 5, vars.widthUnit, vars.heightUnit, 4);
    // 11
    p.rect(vars.xInner + vars.widthUnit * 9, vars.yInner + vars.heightUnit * 4, vars.widthUnit, vars.heightUnit * 3, 4);
    // 12
    p.rect(vars.xInner + vars.widthUnit * 11, vars.yInner + vars.heightUnit * 5, vars.widthUnit, vars.heightUnit, 4);
    // 13
    p.rect(vars.xInner + vars.widthUnit * 11, vars.yInner + vars.heightUnit * 4, vars.widthUnit * 5, vars.heightUnit, 4);
    // 14
    p.rect(vars.xInner + vars.widthUnit * 14, vars.yInner + vars.heightUnit * 3, vars.widthUnit * 2, vars.heightUnit, 4);
    // 15
    p.rect(vars.xInner + vars.widthUnit * 5, vars.yInner + vars.heightUnit * 7, vars.widthUnit, vars.heightUnit, 4);
    // 16
    p.rect(vars.xInner + vars.widthUnit * 7, vars.yInner + vars.heightUnit * 7, vars.widthUnit, vars.heightUnit * 3, 4);
    // 17
    p.rect(vars.xInner + vars.widthUnit * 9, vars.yInner + vars.heightUnit * 8, vars.widthUnit, vars.heightUnit * 2, 4);
    // 18
    p.rect(vars.xInner + vars.widthUnit * 10, vars.yInner + vars.heightUnit * 9, vars.widthUnit, vars.heightUnit * 2, 4);
    // 19
    p.rect(vars.xInner + vars.widthUnit * 11, vars.yInner + vars.heightUnit * 7, vars.widthUnit * 3, vars.heightUnit, 4);
    // 20
    p.rect(vars.xInner + vars.widthUnit * 13, vars.yInner + vars.heightUnit * 6, vars.widthUnit, vars.heightUnit, 4);
    // 21
    p.rect(vars.xInner + vars.widthUnit * 15, vars.yInner + vars.heightUnit * 6, vars.widthUnit, vars.heightUnit * 2, 4);
    // 22
    p.rect(vars.xInner + vars.widthUnit, vars.yInner + vars.heightUnit * 9, vars.widthUnit * 2, vars.heightUnit * 4, 4);
    // 23
    p.rect(vars.xInner + vars.widthUnit * 4, vars.yInner + vars.heightUnit * 9, vars.widthUnit * 2, vars.heightUnit * 3, 4);
    // 24
    p.rect(vars.xInner + vars.widthUnit * 7, vars.yInner + vars.heightUnit * 11, vars.widthUnit * 2, vars.heightUnit, 4);
    // 25
    p.rect(vars.xInner + vars.widthUnit * 8, vars.yInner + vars.heightUnit * 12, vars.widthUnit, vars.heightUnit, 4);
    // 26
    p.rect(vars.xInner + vars.widthUnit * 12, vars.yInner + vars.heightUnit * 9, vars.widthUnit, vars.heightUnit * 3, 4);
    // 27
    p.rect(vars.xInner + vars.widthUnit * 14, vars.yInner + vars.heightUnit * 9, vars.widthUnit * 3, vars.heightUnit, 4);
    // 28
    p.rect(vars.xInner + vars.widthUnit * 4, vars.yInner + vars.heightUnit * 13, vars.widthUnit * 3, vars.heightUnit, 4);
    // 29
    p.rect(vars.xInner + vars.widthUnit * 10, vars.yInner + vars.heightUnit * 12, vars.widthUnit, vars.heightUnit * 2, 4);
    // 30
    p.rect(vars.xInner + vars.widthUnit * 11, vars.yInner + vars.heightUnit * 13, vars.widthUnit * 3, vars.heightUnit, 4);
    // 31
    p.rect(vars.xInner + vars.widthUnit * 14, vars.yInner + vars.heightUnit * 11, vars.widthUnit * 2, vars.heightUnit, 4);
    // 32
    p.rect(vars.xInner + vars.widthUnit * 15, vars.yInner + vars.heightUnit * 12, vars.widthUnit, vars.heightUnit, 4);
    p.pop();
}
const beweegPac = p => {
    if (p.keyIsDown(p.LEFT_ARROW)) {
        vars.linksPac = true;
        vars.rechtsPac = false;
        vars.bovenPac = false;
        vars.onderPac = false;
      }
      if (p.keyIsDown(p.RIGHT_ARROW)) {
        vars.linksPac = false;
        vars.rechtsPac = true;
        vars.bovenPac = false;
        vars.onderPac = false;
      }
      if (p.keyIsDown(p.UP_ARROW)) {
        vars.linksPac = false;
        vars.rechtsPac = false;
       vars.bovenPac = true;
        vars.onderPac = false;
      }
      if (p.keyIsDown(p.DOWN_ARROW)) {
        vars.linksPac = false;
        vars.rechtsPac = false;
        vars.bovenPac = false;
        vars.onderPac = true;
      }
  if (vars.linksPac == true) { 
    vars.xPacman -= 5;
	}
	
 if (vars.rechtsPac == true) { 
    vars.xPacman += 5;
	}
	
if (vars.bovenPac == true) { 
    vars.yPacman -= 5;
	}
	
if (vars.onderPac == true) { 
    vars.yPacman += 5;
    }
}

const tekenPac = p => {
  Pacman(p,vars.xPacman, vars.yPacman, vars.rPacman);
  //tekent pacman
  vars.xPacman = p.constrain(vars.xPacman, vars.rPacman/2, vars.innerWidth - vars.rPacman/2);
  vars.yPacman = p.constrain(vars.yPacman, vars.rPacman/2, vars.innerHeight - vars.rPacman/2);
  //buitenste rand
}

function Pacman (p,x,y,s) {
    p.push();
    p.fill('yellow');
    p.ellipse(x,y,s);
    p.pop();
    }
/*
Met een sketch zorg je ervoor dat je in de instance mode van p5 komt.
Deze modus heeft voor deze game als belangrijkste doel om de game te kunnen starten via een JavaScript functie.
In plaats van dat p5 automatisch start. Het argument p van de sketch functie is om de functies en variabelen te koppelen aan p5.
*/
const sketch = p => {
    // Functie voor het preloaden van game assets in p5.
    p.preload = () => {
        initializeVars();
        p.soundFormats("mp3");
        p.loadFont("assets/fonts/Roboto-Light.ttf");
        // introSound = p.loadSound("assets/music/PacMan.mp3");
    }
    // Functie voor de setup van de game in p5.
    p.setup = () => {
        p.createCanvas(vars.canvasDimension, vars.canvasDimension);
        p.colorMode(p.RGB, 255);
        p.frameRate(60);
        p.textFont("Roboto");
        p.textSize(20);
        p.background("black");
    }
    // Functie voor het tekenen van de game in p5.
    p.draw = () => {
        p.noFill();
        p.strokeWeight(2);
        p.stroke("#2121DE");
        // playIntroSound(p, introSound);
        outerLines(p);
        outerLinesGap(p);
        candy(p);
        obstacles(p);
        beweegPac(p);
        tekenPac(p);
    }
}

// Pagina specifieke JavaScript.

// Creëert constanten van HTML elementen.
const startGame = document.querySelector("#startGame");
const social = document.querySelector("#social");
// Functie voor het correcte copyright jaar.
const footerText = () => {
    const footer = document.querySelector("footer");
    let year = new Date;
    year = year.getFullYear();
    footer.innerText = `© ${year} HOOG-MAN`;
}
// Functie voor het fullscreenen van de game.
const gameStartupScreen = () => {
    const main = document.querySelector("main");
    main.style.height = "100%";
    main.style.width = "100%";
    main.style.position = "absolute";
    main.style.top = "0";
    main.style.left = "0";
    main.style.backgroundColor = "black";
}
// Eventlisteners zorgen ervoor dat er iets gebeurd na een actie van de gebruiker.
// Creëert nieuwe AudioContext en maakt de game fullscreen.
startGame.addEventListener("click", () => {
    gameStartupScreen();
    vars.game = new p5(sketch);
    const gameStartupContainer = document.querySelector("#gameStartupContainer");
    gameStartupContainer.style.display = "none";
    const audio = new AudioContext;
});
// Stuurt gebruiker door naar GitHub repository.
social.addEventListener("click", () => window.location.href = "https://github.com/DylanSealy/PO-2D-games-maken");
// Wijzigt het formaat van het canvas nadat het formaat van de window is veranderd.
window.addEventListener("resize", () => {
    initializeVars();
    vars.game.remove();
    vars.game = new p5(sketch);
});

footerText();