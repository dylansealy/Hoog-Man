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
    // Definieert de barrières van het spelbord. Zie /maps/1.jpg voor volgorde.
    vars.obstacles = [
        // Volgorde: xMin, yMin, xMax, yMax.
        /* 1 */ [vars.xInner + vars.widthUnit, vars.yInner + vars.heightUnit, vars.xInner + vars.widthUnit * 3, vars.yInner + vars.heightUnit * 4],
        /* 2 */ [vars.xInner + vars.widthUnit * 4, vars.yInner, vars.xInner + vars.widthUnit * 5, vars.yInner + vars.heightUnit * 4],
        /* 3 */ [vars.xInner + vars.widthUnit * 6, vars.yInner + vars.heightUnit, vars.xInner + vars.widthUnit * 8, vars.yInner + vars.heightUnit * 4],
        /* 4 */ [vars.xInner + vars.widthUnit * 9, vars.yInner, vars.xInner + vars.widthUnit * 10, vars.yInner + vars.heightUnit * 3],
        /* 5 */ [vars.xInner + vars.widthUnit * 11, vars.yInner + vars.heightUnit, vars.xInner + vars.widthUnit * 13, vars.yInner + vars.heightUnit * 3],
        /* 6 */ [vars.xInner + vars.widthUnit * 14, vars.yInner, vars.xInner + vars.widthUnit * 17, vars.yInner + vars.heightUnit * 2],
        /* 7 */ [vars.xInner, vars.yInner + vars.heightUnit * 5, vars.xInner + vars.widthUnit, vars.xInner + vars.heightUnit * 8],
        /* 8 */ [vars.xInner + vars.widthUnit * 2, vars.yInner + vars.heightUnit * 5, vars.xInner + vars.widthUnit * 4, vars.yInner + vars.heightUnit * 8],
        /* 9 */ [vars.xInner + vars.widthUnit * 5, vars.yInner + vars.heightUnit * 5, vars.xInner + vars.widthUnit * 7, vars.yInner + vars.heightUnit * 6],
        /* 10 */ [vars.xInner + vars.widthUnit * 8, vars.yInner + vars.heightUnit * 5, vars.xInner + vars.widthUnit * 9, vars.yInner + vars.heightUnit * 6],
        /* 11 */ [vars.xInner + vars.widthUnit * 9, vars.yInner + vars.heightUnit * 4, vars.xInner + vars.widthUnit * 10, vars.yInner + vars.heightUnit * 7],
        /* 12 */ [vars.xInner + vars.widthUnit * 11, vars.yInner + vars.heightUnit * 5, vars.xInner + vars.widthUnit * 12, vars.yInner + vars.heightUnit * 6],
        /* 13 */ [vars.xInner + vars.widthUnit * 11, vars.yInner + vars.heightUnit * 4, vars.xInner + vars.widthUnit * 16, vars.yInner + vars.heightUnit * 5],
        /* 14 */ [vars.xInner + vars.widthUnit * 14, vars.yInner + vars.heightUnit * 3, vars.xInner + vars.widthUnit * 16, vars.yInner + vars.heightUnit * 4],
        /* 15 */ [vars.xInner + vars.widthUnit * 5, vars.yInner + vars.heightUnit * 7, vars.xInner + vars.widthUnit * 6, vars.yInner + vars.heightUnit * 8],
        /* 16 */ [vars.xInner + vars.widthUnit * 7, vars.yInner + vars.heightUnit * 7, vars.xInner + vars.widthUnit * 8, vars.yInner + vars.heightUnit * 10],
        /* 17 */ [vars.xInner + vars.widthUnit * 9, vars.yInner + vars.heightUnit * 8, vars.xInner + vars.widthUnit * 10, vars.yInner + vars.heightUnit * 10],
        /* 18 */ [vars.xInner + vars.widthUnit * 10, vars.yInner + vars.heightUnit * 9, vars.xInner + vars.widthUnit * 11, vars.yInner + vars.heightUnit * 11],
        /* 19 */ [vars.xInner + vars.widthUnit * 11, vars.yInner + vars.heightUnit * 7, vars.xInner + vars.widthUnit * 14, vars.yInner + vars.heightUnit * 8],
        /* 20 */ [vars.xInner + vars.widthUnit * 13, vars.yInner + vars.heightUnit * 6, vars.xInner + vars.widthUnit * 14, vars.yInner + vars.heightUnit * 7],
        /* 21 */ [vars.xInner + vars.widthUnit * 15, vars.yInner + vars.heightUnit * 6, vars.xInner + vars.widthUnit * 16, vars.yInner + vars.heightUnit * 8],
        /* 22 */ [vars.xInner + vars.widthUnit, vars.yInner + vars.heightUnit * 9, vars.xInner + vars.widthUnit * 3, vars.yInner + vars.heightUnit * 13],
        /* 23 */ [vars.xInner + vars.widthUnit * 4, vars.yInner + vars.heightUnit * 9, vars.xInner + vars.widthUnit * 6, vars.yInner + vars.heightUnit * 12],
        /* 24 */ [vars.xInner + vars.widthUnit * 7, vars.yInner + vars.heightUnit * 11, vars.xInner + vars.widthUnit * 9, vars.yInner + vars.heightUnit * 12],
        /* 25 */ [vars.xInner + vars.widthUnit * 8, vars.yInner + vars.heightUnit * 12, vars.xInner + vars.widthUnit * 9, vars.yInner + vars.heightUnit * 13],
        /* 26 */ [vars.xInner + vars.widthUnit * 12, vars.yInner + vars.heightUnit * 9, vars.xInner + vars.widthUnit * 13, vars.yInner + vars.heightUnit * 12],
        /* 27 */ [vars.xInner + vars.widthUnit * 14, vars.yInner + vars.heightUnit * 9, vars.xInner + vars.widthUnit * 17, vars.yInner + vars.heightUnit * 10],
        /* 28 */ [vars.xInner + vars.widthUnit * 4, vars.yInner + vars.heightUnit * 13, vars.xInner + vars.widthUnit * 7, vars.yInner + vars.heightUnit * 14],
        /* 29 */ [vars.xInner + vars.widthUnit * 10, vars.yInner + vars.heightUnit * 12, vars.xInner + vars.widthUnit * 11, vars.yInner + vars.heightUnit * 14],
        /* 30 */ [vars.xInner + vars.widthUnit * 11, vars.yInner + vars.heightUnit * 13, vars.xInner + vars.widthUnit * 14, vars.yInner + vars.heightUnit * 14],
        /* 31 */ [vars.xInner + vars.widthUnit * 14, vars.yInner + vars.heightUnit * 11, vars.xInner + vars.widthUnit * 16, vars.yInner + vars.heightUnit * 12],
        /* 32 */ [vars.xInner + vars.widthUnit * 15, vars.yInner + vars.heightUnit * 12, vars.xInner + vars.widthUnit * 16, vars.yInner + vars.heightUnit * 13]
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
// Functie voor het tekenen van alle barrières.
const visualObstacles = p => {
    p.push();
    p.fill("black");
    for (obstacle in vars.obstacles) {
        p.rect(
            vars.obstacles[obstacle][0], vars.obstacles[obstacle][1],
            vars.obstacles[obstacle][2] - vars.obstacles[obstacle][0], vars.obstacles[obstacle][3] - vars.obstacles[obstacle][1], 4
        )
    }
    p.pop();
}
// Functie voor het tekenen van Hoog-Man.
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
    // Zorgt ervoor dat Hoog-Man beweegt in de goede bewegingsrichting met de gespecificeerde snelheid.
    if (vars.bovenHoogMan) {vars.yHoogMan -= vars.hoogManSpeed;}
    else if (vars.rechtsHoogMan) {vars.xHoogMan += vars.hoogManSpeed;}
    else if (vars.onderHoogMan) {vars.yHoogMan += vars.hoogManSpeed;}
    else if (vars.linksHoogMan) {vars.xHoogMan -= vars.hoogManSpeed;}
}
// Functie voor het checken of er een botsing plaatsvindt met een barrière.
const collision = () => {
    for (obstacle in vars.obstacles) {
        if (
            // -1 als marge tussen Hoog-Man en een barrière. Anders is deze statement altijd waar.
            vars.xHoogMan + vars.widthUnit * 0.5 - 1 > vars.obstacles[obstacle][0] &&
            vars.yHoogMan + vars.heightUnit * 0.5 - 1 > vars.obstacles[obstacle][1] &&
            vars.xHoogMan - vars.widthUnit * 0.5 + 1 < vars.obstacles[obstacle][2] &&
            vars.yHoogMan - vars.heightUnit * 0.5 + 1 < vars.obstacles[obstacle][3]
        ) {return resetDirection(true);}
    }
}
// Functie voor het checken of er na een verandering in de bewegingsrichting een botsing ontstaat met de buitenlijnen.
const collisionOuterLines = nextMovement => {
    if (vars.yHoogMan > vars.yInner && vars.yHoogMan < vars.yInner + vars.heightUnit && nextMovement === "up") {return true;}
    else if (vars.yHoogMan > vars.yInner + vars.heightUnit * 13 && vars.yHoogMan < vars.yInner + vars.heightUnit * 14 && nextMovement === "down") {return true;}
    else if (vars.xHoogMan > vars.xInner && vars.xHoogMan < vars.xInner + vars.widthUnit && nextMovement === "left") {return true;}
    else if (vars.xHoogMan > vars.xInner + vars.widthUnit * 16 && vars.xHoogMan < vars.xInner + vars.widthUnit * 17 && nextMovement === "right") {return true;}
    return false;
}
// Functie voor het checken of er een botsing plaatsvindt met een barrière na een key input.
const collisionInput = nextMovement => {
    for (obstacle in vars.obstacles) {
        if (nextMovement === "up") {
            if (
                // Verschil tussen vermenigvuldigingsfactor en 0.5 om ervoor te zorgen dat deze statements minder snel waar zijn.
                // Positie links van de barrière.
                vars.xHoogMan + vars.widthUnit * 0.45 >= vars.obstacles[obstacle][0] &&
                // Positie rechts van de barrière.
                vars.xHoogMan - vars.widthUnit * 0.45 <= vars.obstacles[obstacle][2] &&
                // Positie boven de barrière.
                vars.yHoogMan + vars.heightUnit * 0.45 >= vars.obstacles[obstacle][1] &&
                // Positie onder de barrière.
                vars.yHoogMan - vars.heightUnit * 0.55 <= vars.obstacles[obstacle][3]
            ) {return true;}
        } else if (nextMovement === "right") {
            if (
                vars.xHoogMan + vars.widthUnit * 0.55 >= vars.obstacles[obstacle][0] &&
                vars.xHoogMan - vars.widthUnit * 0.45 <= vars.obstacles[obstacle][2] &&
                vars.yHoogMan + vars.heightUnit * 0.45 >= vars.obstacles[obstacle][1] &&
                vars.yHoogMan - vars.heightUnit * 0.45 <= vars.obstacles[obstacle][3]                
            ) {return true;}
        } else if (nextMovement === "down") {
            if (
                vars.xHoogMan + vars.widthUnit * 0.45 >= vars.obstacles[obstacle][0] &&
                vars.xHoogMan - vars.widthUnit * 0.45 <= vars.obstacles[obstacle][2] &&
                vars.yHoogMan + vars.heightUnit * 0.55 >= vars.obstacles[obstacle][1] &&
                vars.yHoogMan - vars.heightUnit * 0.45 <= vars.obstacles[obstacle][3]                
            ) {return true;}
        } else if (nextMovement === "left") {
            if (
                vars.xHoogMan + vars.widthUnit * 0.45 >= vars.obstacles[obstacle][0] &&
                vars.xHoogMan - vars.widthUnit * 0.55 <= vars.obstacles[obstacle][2] &&
                vars.yHoogMan + vars.heightUnit * 0.45 >= vars.obstacles[obstacle][1] &&
                vars.yHoogMan - vars.heightUnit * 0.45 <= vars.obstacles[obstacle][3]                
            ) {return true;}
        }
    }
    return false;
}
// Functie voor het resetten van Hoog-Mans bewegingsrichting.
const resetDirection = afterCollision => {
    vars.bovenHoogMan = false;
    vars.rechtsHoogMan = false;
    vars.onderHoogMan = false;
    vars.linksHoogMan = false;
    vars.xMovement = false;
    vars.yMovement = false;
    // Zorgt ervoor dat Hoog-Man weer gecentreerd staat na een stop.
    if (afterCollision) {constrainPostion();}
}
// Functie voor het beperken van Hoog-Man zodat hij altijd een vaste x of y positie heeft.
const constrainPostion = () => {
    if (vars.linksHoogMan || vars.rechtsHoogMan) {vars.xMovement = true;}
    else if (vars.bovenHoogMan || vars.onderHoogMan) {vars.yMovement = true;}
    if (vars.xMovement) {
        for (let i = 0; i < 14; i++) {
            if (vars.yHoogMan > vars.yInner + vars.heightUnit * i && vars.yHoogMan < vars.yInner + vars.heightUnit * (i + 1)) {
                return vars.yHoogMan = vars.yInner + vars.heightUnit * (i + 0.5);
            }
        }
    } else if (vars.yMovement) {
        for (let i = 0; i < 17; i++) {
            if (vars.xHoogMan > vars.xInner + vars.widthUnit * i && vars.xHoogMan < vars.xInner + vars.widthUnit * (i + 1)) {
                return vars.xHoogMan = vars.xInner + vars.widthUnit * (i + 0.5);
            }
        }
    } else {
        for (let i = 0; i < 14; i++) {
            if (vars.yHoogMan > vars.yInner + vars.heightUnit * i && vars.yHoogMan < vars.yInner + vars.heightUnit * (i + 1)) {
                vars.yHoogMan = vars.yInner + vars.heightUnit * (i + 0.5);
                break;
            }
        }
        for (let i = 0; i < 17; i++) {
            if (vars.xHoogMan > vars.xInner + vars.widthUnit * i && vars.xHoogMan < vars.xInner + vars.widthUnit * (i + 1)) {
                vars.xHoogMan = vars.xInner + vars.widthUnit * (i + 0.5);
                break;
            }
        }
    }
}
// Functies voor het aanroepen van andere functies zodat Hoog-Man beweegt en alles wat daar mee te maken heeft.
const upPress = () => {
    // Checkt of er geen botsing plaatsvindt.
    if (!collisionOuterLines("up") && !collisionInput("up")) {
        resetDirection();
        vars.bovenHoogMan = true;
        constrainPostion();
    }
}
const rightPress = () => {
    if (!collisionOuterLines("right") && !collisionInput("right")) {
        resetDirection();
        vars.rechtsHoogMan = true;
        constrainPostion();
    }
}
const downPress = () => {
    if (!collisionOuterLines("down") && !collisionInput("down")) {
        resetDirection();
        vars.onderHoogMan = true;
        constrainPostion();
    }
}
const leftPress = () => {
    if (!collisionOuterLines("left") && !collisionInput("left")) {
        resetDirection();
        vars.linksHoogMan = true;
        constrainPostion();
    }
}

const testCollisionLines = p => {
    for (obstacle in vars.obstacles) {
        p.line(vars.obstacles[obstacle][0], vars.obstacles[obstacle][1], vars.obstacles[obstacle][2], vars.obstacles[obstacle][3])
    }
}

/*
Met een sketch zorg je ervoor dat je in de instance mode van p5 komt.
Deze modus heeft voor deze game als belangrijkste doel om de game te kunnen starten via een JavaScript functie,
in plaats van dat p5 automatisch start. Het argument p van de sketch functie is er om de functies en variabelen te koppelen aan p5.
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
        collision();
        testCollisionLines(p);
        // Checkt of een knop ingedrukt wordt.
        if (p.keyIsDown(p.UP_ARROW)) {upPress();}
        else if (p.keyIsDown(p.RIGHT_ARROW)) {rightPress();}
        else if (p.keyIsDown(p.DOWN_ARROW)) {downPress();}
        else if (p.keyIsDown(p.LEFT_ARROW)) {leftPress();}
    }
    // Functie voor het checken welke knop ingedrukt werd in p5.
    p.keyPressed = () => {
        if (p.keyCode === p.UP_ARROW) {upPress();}
        else if (p.keyCode === p.RIGHT_ARROW) {rightPress();}
        else if (p.keyCode === p.DOWN_ARROW) {downPress();}
        else if (p.keyCode === p.LEFT_ARROW) {leftPress();}
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