// p5 specifieke JavaScript.
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
        inputMethod();
        p.createCanvas(vars.canvasDimension, vars.canvasDimension);
        p.colorMode(p.RGB, 255);
        p.textFont("Roboto");
        p.textSize(vars.widthUnit / 1.5);
        p.noCursor();
        p.textAlign(p.LEFT, p.CENTER);
    }
    // Functie voor het tekenen van de game in p5.
    p.draw = () => {
        p.background("black");
        p.noFill();
        p.strokeWeight(2);
        p.stroke("#2121DE");
        // playIntroSound(p, introSound);
        boardElements(p);
        pellet(p);
        visualObstacles(p);
        hoogMan(p);
        collision();
        // Checkt welke input wordt gebruikt.
        if (vars.gameInput === "keyboard") {
            // Checkt of een knop op het toetsenbord ingedrukt wordt.
            if (p.keyIsDown(p.UP_ARROW)) {vars.hoogManMovement = "up";}
            else if (p.keyIsDown(p.RIGHT_ARROW)) {vars.hoogManMovement = "right";}
            else if (p.keyIsDown(p.DOWN_ARROW)) {vars.hoogManMovement = "down";}
            else if (p.keyIsDown(p.LEFT_ARROW)) {vars.hoogManMovement = "left";}
        } else if (vars.gameInput === "touch") {touchControls();}
        else {gestureControls();}
        directionHoogMan();
    }
}
// vars is een object. Binnen een object hebben je key/value pairs.
const vars = {}
// Functie voor het declareren van de benodigde variabelen voor de game.
const initializeVars = () => {
    // Functie voor het bepalen van de dimensie van het main element en de oriëntatie van de client.
    const getMainDimensions = () => {
        // Creëert een constante van een HTML element en checkt de dimensie daarvan.
        const main = document.querySelector("main");
        const height = main.offsetHeight;
        const width = main.offsetWidth;
        // Checkt de oriëntatie van de client. 
        if (width > height) {
            vars.orientation = "landscape";
            return height;
        }
        else {
            vars.orientation = "portrait";
            return width;
        }
    }
    // Definieert de dimensie van het canvas. - 1 om ervoor te zorgen dat er geen scrollbars komen.
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
    // Definieert de bewegingsrichtingen van Hoog-Man.
    vars.upHoogMan = false;
    vars.rightHoogMan = false;
    vars.downHoogMan = false;
    vars.leftHoogMan = false;
    vars.xMovement = false;
    vars.yMovement = false;
    vars.hoogManMovement = false;
    // Definieert de coördinaten van de gesture inputs. xStart, yStart, xEnd, yEnd.
    vars.gesturePosition = [null, null, null, null];
    // Definieert de snelheid van Hoog-Man.
    vars.hoogManSpeed = (88 / 60) / 650 * vars.innerHeight;
    // Functie voor het creëren van een barrière.
    const createObstacle = (xMin, yMin, xMax, yMax) => {
        const obstacle = [
            vars.xInner + vars.widthUnit * xMin, vars.yInner + vars.heightUnit * yMin,
            vars.xInner + vars.widthUnit * xMax, vars.yInner + vars.heightUnit * yMax
        ];
        vars.obstacles.push(obstacle);
    }
    // Definieert de barrières van het spelbord. Zie /maps/1.jpg voor de volgorde.
    vars.obstacles = [];
    /* 1 */ createObstacle(1, 1, 3, 4); /* 2 */ createObstacle(4, 0, 5, 4); /* 3 */ createObstacle(6, 1, 8, 4);
    /* 4 */ createObstacle(9, 0, 10, 3); /* 5 */ createObstacle(11, 1, 13, 3); /* 6 */ createObstacle(14, 0, 17, 2);
    /* 7 */ createObstacle(0, 5, 1, 8); /* 8 */ createObstacle(2, 5, 4, 8); /* 9 */ createObstacle(5, 5, 7, 6);
    /* 10 */ createObstacle(8, 5, 9, 6); /* 11 */ createObstacle(9, 4, 10, 7); /* 12 */ createObstacle(11, 5, 12, 6);
    /* 13 */ createObstacle(11, 4, 16, 5); /* 14 */ createObstacle(14, 3, 16, 4); /* 15 */ createObstacle(5, 7, 6, 8);
    /* 16 */ createObstacle(7, 7, 8, 10); /* 17 */ createObstacle(9, 8, 10, 10); /* 18 */ createObstacle(10, 9, 11, 11);
    /* 19 */ createObstacle(11, 7, 14, 8); /* 20 */ createObstacle(13, 6, 14, 7); /* 21 */ createObstacle(15, 6, 16, 8);
    /* 22 */ createObstacle(1, 9, 3, 13); /* 23 */ createObstacle(4, 9, 6, 12); /* 24 */ createObstacle(7, 11, 9, 12);
    /* 25 */ createObstacle(8, 12, 9, 13); /* 26 */ createObstacle(12, 9, 13, 12); /* 27 */ createObstacle(14, 9, 17, 10);
    /* 28 */ createObstacle(4, 13, 7, 14); /* 29 */ createObstacle(10, 12, 11, 14); /* 30 */ createObstacle(11, 13, 14, 14);
    /* 31 */ createObstacle(14, 11, 16, 12); /* 32 */ createObstacle(15, 12, 16, 13);
    // Definieert de pellets van het spelbord.
    vars.pellets = [];
    for (let yGrid = 0; yGrid < 14; yGrid++) {
        for (let xGrid = 0; xGrid < 17; xGrid++) {
            if (!collision(xGrid, yGrid)) {vars.pellets.push([xGrid, yGrid]);}
        }
    }
    // Definieert de score in de game.
    vars.points = 0;
}
// Functie voor het afspelen van het intro liedje.
// const playIntroSound = (p, introSound) => {
//     p.push();
//     p.noLoop();
//     introSound.play();
//     p.pop();
// }
// Functie voor het tekenen van elementen van het spelbord.
const boardElements = p => {
    p.push();
    // Zorgt voor het tekenen van de buitenlijnen.
    p.strokeWeight(3);
    p.rect(vars.xOuter, vars.yOuter, vars.outerWidth, vars.outerHeight, 10);
    p.rect(vars.xInner, vars.yInner, vars.innerWidth, vars.innerHeight, 4);
    // Zorgt voor het tekenen van de buitenlijn doorgangen.
    p.stroke("black");
    p.strokeWeight(4);
    p.rect(vars.xInner + vars.widthUnit, vars.yOuter, vars.widthUnit, 0);
    p.rect(vars.xInner + vars.widthUnit, vars.yInner, vars.widthUnit, 0);
    p.rect(vars.xInner + vars.widthUnit, vars.yOuter + vars.outerHeight, vars.widthUnit, 0);
    p.rect(vars.xInner + vars.widthUnit, vars.yInner + vars.innerHeight, vars.widthUnit, 0);
    // Zorgt voor het weergeven van de score.
    p.fill("white");
    p.text(`Score ${vars.points}`, vars.xInner, vars.canvasDimension - (vars.canvasDimension - vars.outerHeight) / 2.5);
    p.pop();
}
// Functie voor het tekenen van de pellets.
const pellet = p => {
    p.push();
    // Zorgt voor het tekenen van de pallets.
    p.stroke("yellow");
    p.fill("yellow");
    for (gamePellet in vars.pellets) {
        p.circle(
            vars.xInner + vars.widthUnit * (0.5 + vars.pellets[gamePellet][0]),
            vars.yInner + vars.heightUnit * (0.5 + vars.pellets[gamePellet][1]),
            vars.widthUnit * 0.15
        )
        // Checkt of Hoog-Man interactie heeft met een pallet.
        if (
            // 0.2 als marge tussen Hoog-Man en een pallet.
            vars.xHoogMan + vars.widthUnit * 0.2 > vars.xInner + vars.widthUnit * (0.5 + vars.pellets[gamePellet][0])  &&
            vars.xHoogMan - vars.widthUnit * 0.2 < vars.xInner + vars.widthUnit * (0.5 + vars.pellets[gamePellet][0]) &&
            vars.yHoogMan + vars.heightUnit * 0.2 > vars.yInner + vars.heightUnit * (0.5 + vars.pellets[gamePellet][1]) &&
            vars.yHoogMan - vars.heightUnit * 0.2 < vars.yInner + vars.heightUnit * (0.5 + vars.pellets[gamePellet][1])
        ) {
            vars.points += 100;
            vars.pellets.splice(gamePellet, 1);
        }
    }
    p.pop();
}
// Functie voor het tekenen van de barrières.
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
    p.push();
    // Zorgt ervoor dat Hoog-Man getekend wordt.
    p.noStroke();
    p.fill("yellow");
    p.ellipse(vars.xHoogMan, vars.yHoogMan, vars.dHoogMan);
    p.pop();
    // Zorgt ervoor dat Hoog-Man niet buiten het spelbord gaat.
    vars.xHoogMan = p.constrain(vars.xHoogMan, vars.xInner + vars.widthUnit * 0.5, vars.xInner + vars.innerWidth - vars.widthUnit * 0.5);
    vars.yHoogMan = p.constrain(vars.yHoogMan, vars.yInner + vars.heightUnit * 0.5, vars.yInner + vars.innerHeight - vars.heightUnit * 0.5);
    // Zorgt ervoor dat Hoog-Man beweegt in de gedefinieerde bewegingsrichting met de gedefinieerde snelheid.
    if (vars.upHoogMan) {vars.yHoogMan -= vars.hoogManSpeed;}
    else if (vars.rightHoogMan) {vars.xHoogMan += vars.hoogManSpeed;}
    else if (vars.downHoogMan) {vars.yHoogMan += vars.hoogManSpeed;}
    else if (vars.leftHoogMan) {vars.xHoogMan -= vars.hoogManSpeed;}
}
// Functie voor het checken of er een botsing plaatsvindt met een barrière.
const collision = (xIndex, yIndex) => {
    for (obstacle in vars.obstacles) {
        // Checkt of een pellet botst met een barrière.
        if (typeof xIndex != "undefined" && typeof yIndex != "undefined") {
            if (
                vars.xInner + vars.widthUnit * (0.5 + xIndex) > vars.obstacles[obstacle][0] &&
                vars.xInner + vars.widthUnit * (0.5 + xIndex) < vars.obstacles[obstacle][2] &&
                vars.yInner + vars.heightUnit * (0.5 + yIndex) > vars.obstacles[obstacle][1] &&
                vars.yInner + vars.heightUnit * (0.5 + yIndex) < vars.obstacles[obstacle][3]
            ) {return true;}
        }
        // Checkt of Hoog-Man botst met een barrière.
        else if (
            // -1 als marge tussen Hoog-Man en een barrière. Anders is deze statement altijd waar.
            vars.xHoogMan + vars.widthUnit * 0.5 - 1 > vars.obstacles[obstacle][0] &&
            vars.xHoogMan - vars.widthUnit * 0.5 + 1 < vars.obstacles[obstacle][2] &&
            vars.yHoogMan + vars.heightUnit * 0.5 - 1 > vars.obstacles[obstacle][1] &&
            vars.yHoogMan - vars.heightUnit * 0.5 + 1 < vars.obstacles[obstacle][3]
        ) {return resetDirection(true);}
    }
    return false;
}
// Functie voor het checken of er een botsing plaatsvindt met een barrière of een buitenlijn na een key input.
const collisionInput = nextMovement => {
    for (obstacle in vars.obstacles) {
        if (nextMovement === "up") {
            // Checkt of Hoog-Man door een gat in de buitenlijnen gaat.
            if (
                vars.xHoogMan > vars.xInner + vars.widthUnit &&
                vars.xHoogMan < vars.xInner + vars.widthUnit * 2 &&
                vars.yHoogMan > vars.yInner &&
                vars.yHoogMan < vars.yInner + vars.heightUnit
            ) {vars.yHoogMan = vars.yInner + vars.innerHeight;}
            // Checkt of Hoog-Man botst met een buitelijn.
            else if (vars.yHoogMan > vars.yInner && vars.yHoogMan < vars.yInner + vars.heightUnit) {return true;}
            // Checkt of Hoog-Man bots met een barrière.
            else if (
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
            if (vars.xHoogMan > vars.xInner + vars.widthUnit * 16 && vars.xHoogMan < vars.xInner + vars.widthUnit * 17) {return true;}
            else if (
                vars.xHoogMan + vars.widthUnit * 0.55 >= vars.obstacles[obstacle][0] &&
                vars.xHoogMan - vars.widthUnit * 0.45 <= vars.obstacles[obstacle][2] &&
                vars.yHoogMan + vars.heightUnit * 0.45 >= vars.obstacles[obstacle][1] &&
                vars.yHoogMan - vars.heightUnit * 0.45 <= vars.obstacles[obstacle][3]                
            ) {return true;}
        } else if (nextMovement === "down") {
            if (
                vars.xHoogMan > vars.xInner + vars.widthUnit &&
                vars.xHoogMan < vars.xInner + vars.widthUnit * 2 &&
                vars.yHoogMan > vars.yInner + vars.heightUnit * 13 &&
                vars.yHoogMan < vars.yInner + vars.heightUnit * 14
            ) {vars.yHoogMan = vars.yInner;}
            else if (vars.yHoogMan > vars.yInner + vars.heightUnit * 13 && vars.yHoogMan < vars.yInner + vars.heightUnit * 14) {return true;}
            else if (
                vars.xHoogMan + vars.widthUnit * 0.45 >= vars.obstacles[obstacle][0] &&
                vars.xHoogMan - vars.widthUnit * 0.45 <= vars.obstacles[obstacle][2] &&
                vars.yHoogMan + vars.heightUnit * 0.55 >= vars.obstacles[obstacle][1] &&
                vars.yHoogMan - vars.heightUnit * 0.45 <= vars.obstacles[obstacle][3]                
            ) {return true;}
        } else if (nextMovement === "left") {
            if (vars.xHoogMan > vars.xInner && vars.xHoogMan < vars.xInner + vars.widthUnit) {return true;}
            else if (
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
    vars.upHoogMan = false;
    vars.rightHoogMan = false;
    vars.downHoogMan = false;
    vars.leftHoogMan = false;
    vars.xMovement = false;
    vars.yMovement = false;
    vars.hoogManMovement = false;
    // Zorgt ervoor dat Hoog-Man weer gecentreerd staat na een stop.
    if (afterCollision) {constrainPostion();}
}
// Functie voor het beperken van Hoog-Man zodat hij altijd een vaste x of y positie heeft.
const constrainPostion = () => {
    if (vars.leftHoogMan || vars.rightHoogMan) {vars.xMovement = true;}
    else if (vars.upHoogMan || vars.downHoogMan) {vars.yMovement = true;}
    // Zorgt voor een vaste positie van Hoog-Man ten opzichte van de y-as.
    if (vars.xMovement) {
        for (let i = 0; i < 14; i++) {
            if (vars.yHoogMan > vars.yInner + vars.heightUnit * i && vars.yHoogMan < vars.yInner + vars.heightUnit * (i + 1)) {
                return vars.yHoogMan = vars.yInner + vars.heightUnit * (i + 0.5);
            }
        }
    }
    // Zorgt voor een vaste positie van Hoog-Man ten opzichte van de x-as.
    else if (vars.yMovement) {
        for (let i = 0; i < 17; i++) {
            if (vars.xHoogMan > vars.xInner + vars.widthUnit * i && vars.xHoogMan < vars.xInner + vars.widthUnit * (i + 1)) {
                return vars.xHoogMan = vars.xInner + vars.widthUnit * (i + 0.5);
            }
        }
    }
    // Zorgt voor een vaste positie van Hoog-Man ten opzichte van de x- en y-as.
    else {
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
// Functie voor het besturen van Hoog-Man doormiddel van touch.
const touchControls = () => {
    const upTouch = document.querySelector("#upTouch");
    // Eventlisteners zorgen ervoor dat er iets gebeurd na een actie van de gebruiker.
    // Checkt of er op een besturingselement wordt gedrukt of geklikt.
    upTouch.addEventListener("touchstart", () => vars.hoogManMovement = "up");
    upTouch.addEventListener("click", () => vars.hoogManMovement = "up");
    const rightTouch = document.querySelector("#rightTouch");
    rightTouch.addEventListener("touchstart", () => vars.hoogManMovement = "right");
    rightTouch.addEventListener("click", () => vars.hoogManMovement = "right");
    const downTouch = document.querySelector("#downTouch");
    downTouch.addEventListener("touchstart", () => vars.hoogManMovement = "down");
    downTouch.addEventListener("click", () => vars.hoogManMovement = "down");
    const leftTouch = document.querySelector("#leftTouch");
    leftTouch.addEventListener("touchstart", () => vars.hoogManMovement = "left");
    leftTouch.addEventListener("click", () => vars.hoogManMovement = "left");
}
// Functie voor het besturen van Hoog-Man doormiddel van gestures.
const gestureControls = () => {
    // Functie voor het bepalen welke gesture er wordt uitgevoerd.
    const gesture = () => {
        // Checkt of een gesture begonnen is doormiddel van een druk of een klik.
        if (vars.gesturePosition[0] != null && vars.gesturePosition[1] != null) {
            if (vars.gesturePosition[3] < vars.gesturePosition[1] - vars.heightUnit) {vars.hoogManMovement = "up";}
            else if (vars.gesturePosition[2] > vars.gesturePosition[0] + vars.widthUnit) {vars.hoogManMovement = "right";}
            else if (vars.gesturePosition[3] > vars.gesturePosition[1] + vars.heightUnit) {vars.hoogManMovement = "down";}
            else if (vars.gesturePosition[2] < vars.gesturePosition[0] - vars.widthUnit) {vars.hoogManMovement = "left";}
        }
    }
    // Functie voor het resetten van de gesture.
    const resetGesture = event => {
        // Zorgt ervoor dat de standaardactie niet wordt uitgevoerd.
        event.preventDefault();
        vars.gesturePosition = [null, null, null, null];
    }
    const main = document.querySelector("main");
    main.addEventListener("touchstart", event => {
        event.preventDefault();
        vars.gesturePosition[0] = event.touches[0].clientX;
        vars.gesturePosition[1] = event.touches[0].clientY;
    });
    main.addEventListener("mousedown", event => {
        event.preventDefault();
        vars.gesturePosition[0] = event.clientX;
        vars.gesturePosition[1] = event.clientY;
    });
    main.addEventListener("touchmove", event => {
        event.preventDefault();
        vars.gesturePosition[2] = event.touches[0].clientX;
        vars.gesturePosition[3] = event.touches[0].clientY;
        gesture();
    });
    main.addEventListener("mousemove", event => {
        event.preventDefault();
        vars.gesturePosition[2] = event.clientX;
        vars.gesturePosition[3] = event.clientY;
        gesture();
    });
    main.addEventListener("touchend", event => resetGesture(event));
    main.addEventListener("mouseup", event => resetGesture(event));
    main.addEventListener("touchcancel", event => resetGesture(event));
}
// Functies voor het aanroepen van andere functies zodat Hoog-Man beweegt en alles wat daar mee te maken heeft.
const upPress = () => {
    // Checkt of er geen botsing plaatsvindt.
    if (!collisionInput("up")) {
        resetDirection();
        vars.upHoogMan = true;
        constrainPostion();
    }
}
const rightPress = () => {
    if (!collisionInput("right")) {
        resetDirection();
        vars.rightHoogMan = true;
        constrainPostion();
    }
}
const downPress = () => {
    if (!collisionInput("down")) {
        resetDirection();
        vars.downHoogMan = true;
        constrainPostion();
    }
}
const leftPress = () => {
    if (!collisionInput("left")) {
        resetDirection();
        vars.leftHoogMan = true;
        constrainPostion();
    }
}
// Functie voor het simuleren van wanneer een toetsenbordknop ingedrukt gehouden wordt.
const directionHoogMan = () => {
    switch (vars.hoogManMovement) {
        case "up": upPress(); break;
        case "right": rightPress(); break;
        case "down": downPress(); break;
        case "left": leftPress(); break;
    }
}

// Pagina specifieke JavaScript.
// Initialiseert de game.
document.querySelector("#startGame").addEventListener("click", () => {
    gameStartup();
    // Creëert nieuwe p5 sketch.
    vars.game = new p5(sketch);
    // Zorgt ervoor dat de rest van de pagina verborgen wordt.
    document.querySelector("#gameStartupContainer").style.display = "none";
    // Creërt een nieuwe AudioContext zodat er audio afgespeeld kan worden.
    new AudioContext;
});
// Zorgt ervoor dat de gebruiker wordt doorgestuurd naar de GitHub repository.
document.querySelector("#social").addEventListener("click", () => window.location.href = "https://github.com/DylanSealy/PO-2D-games-maken/");
// Zorgt ervoor dat er een nieuwe game wordt geladen, nadat de venstergrootte is veranderd.
window.addEventListener("resize", () => {
    vars.game.remove();
    vars.game = new p5(sketch);
});
// Functie voor het fullscreenen van de game.
const gameStartup = () => {
    const main = document.querySelector("main");
    main.requestFullscreen();
    // Zorgt ervoor dat het main element de gehele viewport inneemt.
    main.style.height = "100%";
    main.style.width = "100%";
    main.style.position = "absolute";
    main.style.top = "0";
    main.style.left = "0";
    main.style.backgroundColor = "black";
}
// Functie voor het checken welke input methode er wordt gebruikt.
const inputMethod = () => {
    const inputControls = document.getElementsByName("controls");
    if (inputControls[0].checked || vars.gameInput === "keyboard") {vars.gameInput = "keyboard";}
    else if (inputControls[1].checked || vars.gameInput === "touch") {
        vars.gameInput = "touch";
        setupTouchControls();
    } else {vars.gameInput = "gestures";}
}
// Functie voor het weergeven van de touch controls elementen.
const setupTouchControls = () => {
    const touchControlsContainer = document.getElementById("touchControlsContainer");
    touchControlsContainer.style.display = "flex";
    const touchControls = document.getElementsByClassName("touchControls");
    // Zorgt ervoor dat de touch besturingselementen worden aangepast voor een landscape client.
    if (vars.orientation === "landscape") {
        const touchElementWidth = (document.querySelector("html").offsetWidth - vars.canvasDimension) / 2;
        touchControlsContainer.style.width = `${touchElementWidth}px`;
        touchControlsContainer.style.height = "100%";
        touchControlsContainer.classList.remove("containerPortrait");
        touchControlsContainer.classList.add("containerLandscape");
        for (let i = 0; i < touchControls.length; i++) {
            touchControls[i].classList.remove("touchPortrait");
            touchControls[i].classList.add("touchLandscape");
        }
    }
    // Zorgt ervoor dat de touch besturingselementen worden aangepast voor een portrait client.
    else if (vars.orientation === "portrait") {
        const touchElementHeight = (document.querySelector("html").offsetHeight - vars.canvasDimension) / 2;
        touchControlsContainer.style.height = `${touchElementHeight}px`;
        touchControlsContainer.style.width = "100%";
        touchControlsContainer.classList.remove("containerLandscape");
        touchControlsContainer.classList.add("containerPortrait");
        for (let i = 0; i < touchControls.length; i++) {
            touchControls[i].classList.remove("touchLandscape");
            touchControls[i].classList.add("touchPortrait");
        }
    }
}
// Functie voor het correcte copyright jaar. Dit is een directe functie die meteen wordt uitgevoerd.
(() => {
    let year = new Date;
    year = year.getFullYear();
    document.querySelector("footer").innerText = `© ${year} Hoog-Man`;
})()