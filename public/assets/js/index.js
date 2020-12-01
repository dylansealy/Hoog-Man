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
    // Definieert de positie en grootte van Hoog-Man.
    vars.xHoogMan = vars.xInner + vars.widthUnit * 0.5;
    vars.yHoogMan = vars.yInner + vars.heightUnit * 0.5;
    vars.dHoogMan = vars.heightUnit / 2;
    // Definieert de richtingen waarin Hoog-Man blijft bewegen.
    vars.bovenHoogMan = false;
    vars.rechtsHoogMan = false;
    vars.onderHoogMan = false;
    vars.linksHoogMan = false;
    vars.xMovement = false;
    vars.yMovement = false;
    // Definieert de snelheid van Hoog-Man.
    vars.hoogManSpeed = (88 / 60) / 650 * vars.innerHeight;
    // Definieert de barrières van het spelbord.
    vars.obstacles = [
        [vars.xInner + vars.widthUnit, vars.yInner + vars.heightUnit, vars.xInner + vars.widthUnit * 3, vars.yInner + vars.heightUnit * 4],
    ]
}
// Functie voor het afspelen van het intro liedje.
// const playIntroSound = (p, introSound) => {
//     p.push();
//     p.noLoop();
//     introSound.play();
//     p.pop();
// }
// Functie voor het tekenen van de buitenlijnen.
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
// Functie voor het tekenen van alle barrières.
const visualObstacles = p => {
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
// Functie voor het tekenen van de gele bolletjes.
const candy = p => {
    p.push();
    p.stroke("yellow");
    p.fill("yellow");
    for (let i = 0; i < 14; i++) {
        for (let j = 0; j < 17; j++) {
            p.circle(vars.xInner + vars.widthUnit * (0.5 + j), vars.yInner + vars.heightUnit * (0.5 + i), vars.widthUnit * 0.15);
        }
    }
    p.pop();
}
// Functie voor het checken of er na een verandering in de bewegingsrichting een botsing ontstaat.
const checkCollisionOuterLines = nextMovement => {
    if (vars.xMovement) {
        if (vars.yHoogMan > vars.yInner && vars.yHoogMan < vars.yInner + vars.heightUnit && nextMovement === "up") {return false;}
        else if (vars.yHoogMan > vars.yInner + vars.heightUnit * 13 && vars.yHoogMan < vars.yInner + vars.heightUnit * 14 && nextMovement === "down") {return false;}
    } else if (vars.yMovement) {
        if (vars.xHoogMan > vars.xInner && vars.xHoogMan < vars.xInner + vars.widthUnit && nextMovement === "left") {return false;}
        else if (vars.xHoogMan > vars.xInner + vars.widthUnit * 16 && vars.xHoogMan < vars.xInner + vars.widthUnit * 17 && nextMovement === "right") {return false;}
    }
    return true;
}
// Functie voor het checken of er een botsing plaatsvindt met een barrière.
const checkCollision = () => {
    for (obstacle in vars.obstacles) {
        if (
            vars.xHoogMan + vars.widthUnit * 0.5 - 1 > vars.obstacles[obstacle][0] &&
            vars.yHoogMan + vars.heightUnit * 0.5 - 1> vars.obstacles[obstacle][1] &&
            vars.xHoogMan - vars.widthUnit * 0.5 + 1 < vars.obstacles[obstacle][2] &&
            vars.yHoogMan - vars.heightUnit * 0.5 + 1 < vars.obstacles[obstacle][3]
        ) {resetDirection();}
    }
}
// Functie voor het resetten van Hoog-Mans bewegingsrichting.
const resetDirection = () => {
    vars.bovenHoogMan = false;
    vars.rechtsHoogMan = false;
    vars.onderHoogMan = false;
    vars.linksHoogMan = false;
    vars.xMovement = false;
    vars.yMovement = false;
}
// Functie voor het constrainen van Hoog-Man voor alle assen. Dit zorgt ervoor dat Hoog-Man in elke bewegingsrichting een vaste x of y positie heeft.
const constrainPostion = () => {
    if (vars.linksHoogMan || vars.rechtsHoogMan) {vars.xMovement = true;}
    else if (vars.bovenHoogMan || vars.onderHoogMan) {vars.yMovement = true;}
    if (vars.xMovement) {
        for (let i = 0; i < 14; i++) {
            if (vars.yHoogMan > vars.yInner + vars.heightUnit * i && vars.yHoogMan < vars.yInner + vars.heightUnit * (i + 1)) {vars.yHoogMan = vars.yInner + vars.heightUnit * (i + 0.5);}
        }
    } else if (vars.yMovement) {
        for (let i = 0; i < 17; i++) {
            if (vars.xHoogMan > vars.xInner + vars.widthUnit * i && vars.xHoogMan < vars.xInner + vars.widthUnit * (i + 1)) {vars.xHoogMan = vars.xInner + vars.widthUnit * (i + 0.5);}
        }
    }
}
// Functie voor het tekenen en besturen van Hoog-Man.
const hoogMan = p => {
    // Zorgt ervoor dat Hoog-Man getekend wordt.
    p.push();
    p.noStroke();
    p.fill("yellow");
    p.ellipse(vars.xHoogMan, vars.yHoogMan, vars.dHoogMan);
    p.pop();
    // Zorgt ervoor dat Hoog-Man niet buiten het spelbord gaat.
    vars.xHoogMan = p.constrain(vars.xHoogMan, vars.xInner + vars.widthUnit * 0.5, vars.xInner + vars.innerWidth - vars.widthUnit * 0.5);
    vars.yHoogMan = p.constrain(vars.yHoogMan, vars.yInner + vars.heightUnit * 0.5, vars.yInner + vars.innerHeight - vars.heightUnit * 0.5);
    // Zorgt ervoor dat Hoog-Man beweegt met de gespecificeerde snelheid.
    if (vars.bovenHoogMan) {vars.yHoogMan -= vars.hoogManSpeed;}
    else if (vars.rechtsHoogMan) {vars.xHoogMan += vars.hoogManSpeed;}
    else if (vars.onderHoogMan) {vars.yHoogMan += vars.hoogManSpeed;}
    else if (vars.linksHoogMan) {vars.xHoogMan -= vars.hoogManSpeed;}
}
/*
Met een sketch zorg je ervoor dat je in de instance mode van p5 komt.
Deze modus heeft voor deze game als belangrijkste doel om de game te kunnen starten via een JavaScript functie.
In plaats van dat p5 automatisch start. Het argument p van de sketch functie is om de functies en variabelen te koppelen aan p5.
*/
const sketch = p => {
    // Functie voor het preloaden van game assets in p5.
    p.preload = () => {
        p.soundFormats("mp3");
        p.loadFont("assets/fonts/Roboto-Light.ttf");
        // introSound = p.loadSound("assets/music/PacMan.mp3");
    }
    // Functie voor de setup van de game in p5.
    p.setup = () => {
        initializeVars();
        p.createCanvas(vars.canvasDimension, vars.canvasDimension);
        p.colorMode(p.RGB, 255);
        p.frameRate(60);
        p.textFont("Roboto");
        p.textSize(20);
        p.noCursor();
    }
    // Functie voor het tekenen van de game in p5.
    p.draw = () => {
        p.background("black");
        p.noFill();
        p.strokeWeight(2);
        p.stroke("#2121DE");
        // playIntroSound(p, introSound);
        outerLines(p);
        outerLinesGap(p);
        candy(p);
        visualObstacles(p);
        hoogMan(p);
        checkCollision();
    }
    // Functie voor het checken welke knop is ingedrukt in p5 en dus het besturen van Hoog-Man.
    p.keyPressed = () => {
        if (p.keyCode === p.UP_ARROW) {
            if (checkCollisionOuterLines("up")) {
                resetDirection();
                vars.bovenHoogMan = true;
                constrainPostion();
            }
        }
        else if (p.keyCode === p.RIGHT_ARROW) {
            if (checkCollisionOuterLines("right")) {
                resetDirection();
                vars.rechtsHoogMan = true;
                constrainPostion();
            }
        }
        else if (p.keyCode === p.DOWN_ARROW) {
            if (checkCollisionOuterLines("down")) {
                resetDirection();
                vars.onderHoogMan = true;
                constrainPostion();
            }
        }
        else if (p.keyCode === p.LEFT_ARROW) {
            if (checkCollisionOuterLines("left")) {
                resetDirection();
                vars.linksHoogMan = true;
                constrainPostion();
            }
        }
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
    new AudioContext;
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