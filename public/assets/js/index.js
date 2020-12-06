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
    } // Functie voor de setup van de game in p5.
    p.setup = () => {
        initializeVars();
        getInputMethod();
        p.createCanvas(v.canvasDimension, v.canvasDimension);
        p.colorMode(p.RGB, 255);
        p.textFont("Roboto");
        p.textSize(v.widthUnit / 1.5);
        p.noCursor();
        p.textAlign(p.LEFT, p.CENTER);
    } // Functie voor het tekenen van de game in p5.
    p.draw = () => {
        p.background("black");
        p.noFill();
        // playIntroSound(p, introSound);
        drawBoardElements(p);
        hoogMan(p);
        collision();
        directionHoogMan();
        // Zorgt ervoor dat alleen de gekozen input methode werkt.
        if (v.gameInput === "keyboard") {
            // Checkt of een knop op het toetsenbord wordt ingedrukt.
            if (p.keyIsDown(p.UP_ARROW) || p.keyIsDown(87)) {v.nextCharacterMovement[0] = "up";}
            else if (p.keyIsDown(p.RIGHT_ARROW) || p.keyIsDown(68)) {v.nextCharacterMovement[0] = "right";}
            else if (p.keyIsDown(p.DOWN_ARROW) || p.keyIsDown(83)) {v.nextCharacterMovement[0] = "down";}
            else if (p.keyIsDown(p.LEFT_ARROW) || p.keyIsDown(65)) {v.nextCharacterMovement[0] = "left";}
        } else if (v.gameInput === "touch") {touchControls();}
        else if (v.gameInput === "gestures") {gestureControls();}
    }
}
// v is een object. Binnen een object heb je key/value pairs.
const v = {}
// Functie voor het declareren van de benodigde variabelen voor de game.
const initializeVars = () => {
    // Bepaalt de dimensie van het main HTML element en de oriëntatie van de client en zet de dimensie van het canvas.
    const height = document.querySelector("main").offsetHeight;
    const width = document.querySelector("main").offsetWidth;
    if (width > height) {
        v.orientation = "landscape";
        // - 1 om scrollbars te voorkomen.
        v.canvasDimension = height - 1;
    } else {
        v.canvasDimension = "potrait";
        v.canvasDimension = width - 1;
    } // Definieert de startpunten van de buitenlijnen van het spelbord.
    v.xOuter = v.yOuter = v.canvasDimension / 60;
    v.xInner = v.yInner = v.xOuter * 2;
    // Definieert de hoogte en breedte van het spelbord.
    v.outerHeight = v.canvasDimension - v.yOuter * 6;
    v.outerWidth = v.canvasDimension - v.xOuter * 2;
    v.innerHeight = v.canvasDimension - v.yInner * 4;
    v.innerWidth = v.canvasDimension - v.yInner * 2;
    // Definieert de dimensie eenheden van het spelbord.
    v.heightUnit = v.innerHeight / 14;
    v.widthUnit = v.innerWidth / 17;
    // Definieert de positie, bewegingsrichting snelheid en kleur van elk karakter.
    v.xCharacter = [v.xInner + v.widthUnit * 0.5];
    v.yCharacter = [v.yInner + v.heightUnit * 0.5];
    v.dCharacter = [0];
        // Zorgt ervoor dat elke waarde in een array hetzelfde is zonder deze steeds te herhalen.
    v.dCharacter.fill(v.heightUnit / 2);
    v.cCharacter = ["yellow"];
    v.characterSpeed = [0];
    v.characterSpeed.fill(88 / 60 / 650 * v.innerHeight);
    v.characterMovement = [false];
    v.nextCharacterMovement = [false];
    v.xCharacterMovement = [false];
    v.yCharacterMovement = [false];
    // Definieert de coördinaten van de gesture inputs. xStart, yStart, xEnd, yEnd.
    v.gesturePosition = [null, null, null, null];
    // Zorgt ervoor dat alle barriëres gecreëerd worden.
    v.obstacles = [];
        // xMin, yMin, xMax, yMax.
    v.coordinates = [
        [1, 1, 3, 4], [4, 0, 5, 4], [6, 1, 8, 4], [9, 0, 10, 3], [11, 1, 13, 3], [14, 0, 17, 2], [0, 5, 1, 8], [2, 5, 4, 8],
        [5, 5, 7, 6], [8, 5, 9, 6], [9, 4, 10, 7], [11, 5, 12, 6], [11, 4, 16, 5], [14, 3, 16, 4], [5, 7, 6, 8], [7, 7, 8, 10],
        [9, 8, 10, 10], [10, 9, 11, 11], [11, 7, 14, 8], [13, 6, 14, 7], [15, 6, 16, 8], [1, 9, 3, 13], [4, 9, 6, 12], [7, 11, 9, 12],
        [8, 12, 9, 13], [12, 9, 13, 12], [14, 9, 17, 10], [4, 13, 7, 14], [10, 12, 11, 14], [11, 13, 14, 14], [14, 11, 16, 12], [15, 12, 16, 13]
    ];
    for (ob in v.coordinates) {
        const obstacle = [
            v.xInner + v.widthUnit * v.coordinates[ob][0], v.yInner + v.heightUnit * v.coordinates[ob][1],
            v.xInner + v.widthUnit * v.coordinates[ob][2], v.yInner + v.heightUnit * v.coordinates[ob][3]
        ];
        // Zorgt ervoor dat de barrière gepusht wordt naar de obstacle array.
        v.obstacles.push(obstacle);
    } // Zorgt ervoor dat alle pellets worden gecreëerd.
    v.pellets = [];
    for (let yPellet = 0; yPellet < 14; yPellet++) {
        for (let xPellet = 0; xPellet < 17; xPellet++) {
            if (!collision(xPellet, yPellet)) {v.pellets.push([xPellet, yPellet]);}
        }
    }
    // Zorgt ervoor dat de score wordt bijgehouden.
    v.score = 0;
}
// Functie voor het afspelen van het intro liedje.
// const playIntroSound = (p, introSound) => {
//     p.push();
//     p.noLoop();
//     introSound.play();
//     p.pop();
// }
// Functie voor het tekenen van elementen van het spelbord.
const drawBoardElements = p => {
    p.push();
    // Zorgt voor het tekenen van de buitenlijnen.
    p.strokeWeight(2);
    p.stroke("#2121DE");
    p.strokeWeight(3);
    p.rect(v.xOuter, v.yOuter, v.outerWidth, v.outerHeight, 10);
    p.rect(v.xInner, v.yInner, v.innerWidth, v.innerHeight, 4);
    // Zorgt voor het tekenen van de buitenlijn doorgangen.
    p.stroke("black");
    p.strokeWeight(4);
    p.rect(v.xInner + v.widthUnit, v.yOuter, v.widthUnit, 0);
    p.rect(v.xInner + v.widthUnit, v.yInner, v.widthUnit, 0);
    p.rect(v.xInner + v.widthUnit, v.yOuter + v.outerHeight, v.widthUnit, 0);
    p.rect(v.xInner + v.widthUnit, v.yInner + v.innerHeight, v.widthUnit, 0);
    // Zorgt voor het weergeven van de score.
    p.fill("white");
    p.text(`Score ${v.score}`, v.xInner, v.canvasDimension - (v.canvasDimension - v.outerHeight) / 2.5);
    // Zorgt voor het tekenen van de pellets.
    p.stroke("yellow");
    p.fill("yellow");
    for (pe in v.pellets) {
        p.circle(
            v.xInner + v.widthUnit * (0.5 + v.pellets[pe][0]),
            v.yInner + v.heightUnit * (0.5 + v.pellets[pe][1]),
            v.widthUnit * 0.15
        );
        // Checkt of Hoog-Man interactie heeft met een pellet.
        if ( // 0.2 als marge tussen Hoog-Man en een pellet.
            v.xCharacter[0] + v.widthUnit * 0.2 > v.xInner + v.widthUnit * (0.5 + v.pellets[pe][0])  &&
            v.xCharacter[0] - v.widthUnit * 0.2 < v.xInner + v.widthUnit * (0.5 + v.pellets[pe][0]) &&
            v.yCharacter[0] + v.heightUnit * 0.2 > v.yInner + v.heightUnit * (0.5 + v.pellets[pe][1]) &&
            v.yCharacter[0] - v.heightUnit * 0.2 < v.yInner + v.heightUnit * (0.5 + v.pellets[pe][1])
        ) {
            v.score += 100;
            v.pellets.splice(pe, 1);
        }
    } // Zorgt voor het tekenen van de barrières.
    p.stroke("#2121DE");
    p.strokeWeight(2);
    p.fill("black");
    for (ob in v.obstacles) {
        p.rect(
            v.obstacles[ob][0], v.obstacles[ob][1],
            v.obstacles[ob][2] - v.obstacles[ob][0], v.obstacles[ob][3] - v.obstacles[ob][1], 4
        );
    }
    p.pop();
}
// Functie voor het tekenen van Hoog-Man.
const hoogMan = p => {
    p.push();
    // Zorgt ervoor dat Hoog-Man getekend wordt.
    p.noStroke();
    p.fill(v.cCharacter[0]);
    p.ellipse(v.xCharacter[0], v.yCharacter[0], v.dCharacter[0]);
    p.pop();
    // Zorgt ervoor dat Hoog-Man niet buiten het spelbord gaat.
    v.xCharacter[0] = p.constrain(v.xCharacter[0], v.xInner + v.widthUnit * 0.5, v.xInner + v.innerWidth - v.widthUnit * 0.5);
    v.yCharacter[0] = p.constrain(v.yCharacter[0], v.yInner + v.heightUnit * 0.5, v.yInner + v.innerHeight - v.heightUnit * 0.5);
    // Zorgt ervoor dat Hoog-Man beweegt in de gedefinieerde bewegingsrichting met de gedefinieerde snelheid.
    if (v.characterMovement[0] === "up") {v.yCharacter[0] -= v.characterSpeed[0];}
    else if (v.characterMovement[0] === "right") {v.xCharacter[0] += v.characterSpeed[0];}
    else if (v.characterMovement[0] === "down") {v.yCharacter[0] += v.characterSpeed[0];}
    else if (v.characterMovement[0] === "left") {v.xCharacter[0] -= v.characterSpeed[0];}
}
// Functie voor het checken of er een botsing plaatsvindt met een barrière.
const collision = (xIndex, yIndex) => {
    for (obstacle in v.obstacles) {
        // Checkt of een pellet botst met een barrière.
        if (typeof xIndex != "undefined" && typeof yIndex != "undefined") {
            if (
                v.xInner + v.widthUnit * (0.5 + xIndex) > v.obstacles[obstacle][0] &&
                v.xInner + v.widthUnit * (0.5 + xIndex) < v.obstacles[obstacle][2] &&
                v.yInner + v.heightUnit * (0.5 + yIndex) > v.obstacles[obstacle][1] &&
                v.yInner + v.heightUnit * (0.5 + yIndex) < v.obstacles[obstacle][3]
            ) {return true;}
        } // Checkt of Hoog-Man botst met een barrière.
        else if ( // -1 als marge tussen Hoog-Man en een barrière. Anders is deze statement altijd waar.
            v.xCharacter[0] + v.widthUnit * 0.5 - 1 > v.obstacles[obstacle][0] &&
            v.xCharacter[0] - v.widthUnit * 0.5 + 1 < v.obstacles[obstacle][2] &&
            v.yCharacter[0] + v.heightUnit * 0.5 - 1 > v.obstacles[obstacle][1] &&
            v.yCharacter[0] - v.heightUnit * 0.5 + 1 < v.obstacles[obstacle][3]
        ) {return resetDirection(true);}
    }
    return false;
}
// Functie voor het checken of er een botsing plaatsvindt met een barrière of een buitenlijn na een key input.
const collisionInput = nextMovement => {
    for (obstacle in v.obstacles) {
        if (nextMovement === "up") {
            // Checkt of Hoog-Man door een gat in de buitenlijnen gaat.
            if (
                v.xCharacter[0] > v.xInner + v.widthUnit &&
                v.xCharacter[0] < v.xInner + v.widthUnit * 2 &&
                v.yCharacter[0] > v.yInner &&
                v.yCharacter[0] < v.yInner + v.heightUnit
            ) {v.yCharacter[0] = v.yInner + v.innerHeight;}
            // Checkt of Hoog-Man botst met een buitelijn.
            else if (v.yCharacter[0] > v.yInner && v.yCharacter[0] < v.yInner + v.heightUnit) {return true;}
            // Checkt of Hoog-Man bots met een barrière.
            else if ( // Verschil tussen vermenigvuldigingsfactor en 0.5 om ervoor te zorgen dat deze statements minder snel waar zijn.
                // Positie links van de barrière.
                v.xCharacter[0] + v.widthUnit * 0.45 >= v.obstacles[obstacle][0] &&
                // Positie rechts van de barrière.
                v.xCharacter[0] - v.widthUnit * 0.45 <= v.obstacles[obstacle][2] &&
                // Positie boven de barrière.
                v.yCharacter[0] + v.heightUnit * 0.45 >= v.obstacles[obstacle][1] &&
                // Positie onder de barrière.
                v.yCharacter[0] - v.heightUnit * 0.55 <= v.obstacles[obstacle][3]
            ) {return true;}
        } else if (nextMovement === "right") {
            if (v.xCharacter[0] > v.xInner + v.widthUnit * 16 && v.xCharacter[0] < v.xInner + v.widthUnit * 17) {return true;}
            else if (
                v.xCharacter[0] + v.widthUnit * 0.55 >= v.obstacles[obstacle][0] &&
                v.xCharacter[0] - v.widthUnit * 0.45 <= v.obstacles[obstacle][2] &&
                v.yCharacter[0] + v.heightUnit * 0.45 >= v.obstacles[obstacle][1] &&
                v.yCharacter[0] - v.heightUnit * 0.45 <= v.obstacles[obstacle][3]                
            ) {return true;}
        } else if (nextMovement === "down") {
            if (
                v.xCharacter[0] > v.xInner + v.widthUnit &&
                v.xCharacter[0] < v.xInner + v.widthUnit * 2 &&
                v.yCharacter[0] > v.yInner + v.heightUnit * 13 &&
                v.yCharacter[0] < v.yInner + v.heightUnit * 14
            ) {v.yCharacter[0] = v.yInner;}
            else if (v.yCharacter[0] > v.yInner + v.heightUnit * 13 && v.yCharacter[0] < v.yInner + v.heightUnit * 14) {return true;}
            else if (
                v.xCharacter[0] + v.widthUnit * 0.45 >= v.obstacles[obstacle][0] &&
                v.xCharacter[0] - v.widthUnit * 0.45 <= v.obstacles[obstacle][2] &&
                v.yCharacter[0] + v.heightUnit * 0.55 >= v.obstacles[obstacle][1] &&
                v.yCharacter[0] - v.heightUnit * 0.45 <= v.obstacles[obstacle][3]                
            ) {return true;}
        } else if (nextMovement === "left") {
            if (v.xCharacter[0] > v.xInner && v.xCharacter[0] < v.xInner + v.widthUnit) {return true;}
            else if (
                v.xCharacter[0] + v.widthUnit * 0.45 >= v.obstacles[obstacle][0] &&
                v.xCharacter[0] - v.widthUnit * 0.55 <= v.obstacles[obstacle][2] &&
                v.yCharacter[0] + v.heightUnit * 0.45 >= v.obstacles[obstacle][1] &&
                v.yCharacter[0] - v.heightUnit * 0.45 <= v.obstacles[obstacle][3]                
            ) {return true;}
        }
    }
    return false;
}
// Functie voor het simuleren van een key press.
const directionHoogMan = () => {
    switch (v.nextCharacterMovement[0]) {
        case "up": upPress(); break;
        case "right": rightPress(); break;
        case "down": downPress(); break;
        case "left": leftPress(); break;
    }
}
// Functies voor het laten bewegen van Hoog-Man.
const upPress = () => {
    // Checkt of er geen botsing plaatsvindt.
    if (!collisionInput("up")) {
        resetDirection();
        v.characterMovement[0] = "up";
        constrainPostion();
    }
}
const rightPress = () => {
    if (!collisionInput("right")) {
        resetDirection();
        v.characterMovement[0] = "right";
        constrainPostion();
    }
}
const downPress = () => {
    if (!collisionInput("down")) {
        resetDirection();
        v.characterMovement[0] = "down";
        constrainPostion();
    }
}
const leftPress = () => {
    if (!collisionInput("left")) {
        resetDirection();
        v.characterMovement[0] = "left";
        constrainPostion();
    }
}
// Functie voor het resetten van Hoog-Mans bewegingsrichting.
const resetDirection = afterCollision => {
    v.characterMovement[0] = v.xCharacterMovement[0] = v.yCharacterMovement[0] = v.nextCharacterMovement[0] = false;
    // Zorgt ervoor dat Hoog-Man weer gecentreerd staat na een stop.
    if (afterCollision) {constrainPostion();}
}
// Functie voor het beperken van Hoog-Man zodat hij altijd een vaste x of y positie heeft.
const constrainPostion = () => {
    if (v.characterMovement[0] === "left" || v.characterMovement[0] === "right") {v.xCharacterMovement[0] = true;}
    else if (v.characterMovement[0] === "up" || v.characterMovement[0] === "down") {v.yCharacterMovement[0] = true;}
    // Zorgt voor een vaste positie van Hoog-Man ten opzichte van de y-as.
    if (v.xCharacterMovement[0]) {
        for (let i = 0; i < 14; i++) {
            if (v.yCharacter[0] > v.yInner + v.heightUnit * i && v.yCharacter[0] < v.yInner + v.heightUnit * (i + 1)) {
                return v.yCharacter[0] = v.yInner + v.heightUnit * (i + 0.5);
            }
        }
    } // Zorgt voor een vaste positie van Hoog-Man ten opzichte van de x-as.
    else if (v.yCharacterMovement[0]) {
        for (let i = 0; i < 17; i++) {
            if (v.xCharacter[0] > v.xInner + v.widthUnit * i && v.xCharacter[0] < v.xInner + v.widthUnit * (i + 1)) {
                return v.xCharacter[0] = v.xInner + v.widthUnit * (i + 0.5);
            }
        }
    } // Zorgt voor een vaste positie van Hoog-Man ten opzichte van de x- en y-as.
    else {
        for (let i = 0; i < 14; i++) {
            if (v.yCharacter[0] > v.yInner + v.heightUnit * i && v.yCharacter[0] < v.yInner + v.heightUnit * (i + 1)) {
                v.yCharacter[0] = v.yInner + v.heightUnit * (i + 0.5);
                break;
            }
        }
        for (let i = 0; i < 17; i++) {
            if (v.xCharacter[0] > v.xInner + v.widthUnit * i && v.xCharacter[0] < v.xInner + v.widthUnit * (i + 1)) {
                v.xCharacter[0] = v.xInner + v.widthUnit * (i + 0.5);
                break;
            }
        }
    }
}
// Functie voor het besturen van Hoog-Man doormiddel van touch.
const touchControls = () => {
    // Checkt of er op een besturingselement wordt gedrukt of geklikt.
    // Eventlisteners zorgen ervoor dat er iets gebeurt na een actie van de gebruiker.
    const upTouch = document.querySelector("#upTouch");
    upTouch.addEventListener("touchstart", () => v.nextCharacterMovement[0] = "up");
    upTouch.addEventListener("click", () => v.nextCharacterMovement[0] = "up");
    const rightTouch = document.querySelector("#rightTouch");
    rightTouch.addEventListener("touchstart", () => v.nextCharacterMovement[0] = "right");
    rightTouch.addEventListener("click", () => v.nextCharacterMovement[0] = "right");
    const downTouch = document.querySelector("#downTouch");
    downTouch.addEventListener("touchstart", () => v.nextCharacterMovement[0] = "down");
    downTouch.addEventListener("click", () => v.nextCharacterMovement[0] = "down");
    const leftTouch = document.querySelector("#leftTouch");
    leftTouch.addEventListener("touchstart", () => v.nextCharacterMovement[0] = "left");
    leftTouch.addEventListener("click", () => v.nextCharacterMovement[0] = "left");
}
// Functie voor het besturen van Hoog-Man doormiddel van gestures.
const gestureControls = () => {
    // Functie voor het bepalen welke gesture er wordt uitgevoerd.
    const checkGesture = () => {
        // Checkt of een gesture begonnen is doormiddel van een druk of een klik.
        if (v.gesturePosition[0] != null && v.gesturePosition[1] != null) {
            if (v.gesturePosition[3] < v.gesturePosition[1] - v.heightUnit) {v.nextCharacterMovement[0] = "up";}
            else if (v.gesturePosition[2] > v.gesturePosition[0] + v.widthUnit) {v.nextCharacterMovement[0] = "right";}
            else if (v.gesturePosition[3] > v.gesturePosition[1] + v.heightUnit) {v.nextCharacterMovement[0] = "down";}
            else if (v.gesturePosition[2] < v.gesturePosition[0] - v.widthUnit) {v.nextCharacterMovement[0] = "left";}
        }
    } // Functie voor het resettten van de gesture.
    const resetGesture = event => {
        // Zorgt ervoor dat de standaardactie niet wordt uitgevoerd.
        event.preventDefault();
        v.gesturePosition = [null, null, null, null];
    }
    const main = document.querySelector("main");
    main.addEventListener("touchstart", event => {
        event.preventDefault();
        v.gesturePosition[0] = event.touches[0].clientX;
        v.gesturePosition[1] = event.touches[0].clientY;
    });
    main.addEventListener("mousedown", event => {
        event.preventDefault();
        v.gesturePosition[0] = event.clientX;
        v.gesturePosition[1] = event.clientY;
    });
    main.addEventListener("touchmove", event => {
        event.preventDefault();
        v.gesturePosition[2] = event.touches[0].clientX;
        v.gesturePosition[3] = event.touches[0].clientY;
        checkGesture();
    });
    main.addEventListener("mousemove", event => {
        event.preventDefault();
        v.gesturePosition[2] = event.clientX;
        v.gesturePosition[3] = event.clientY;
        checkGesture();
    });
    main.addEventListener("touchend", event => resetGesture(event));
    main.addEventListener("mouseup", event => resetGesture(event));
    main.addEventListener("touchcancel", event => resetGesture(event));
}
// Pagina specifieke JavaScript.
// Initialiseert de game.
document.querySelector("#startGame").addEventListener("click", () => {
    gameStartup();
    // Creëert nieuwe p5 sketch.
    v.game = new p5(sketch);
    // Zorgt ervoor dat de rest van de pagina verborgen wordt.
    document.querySelector("#gameStartupContainer").style.display = "none";
    // Creërt een nieuwe AudioContext zodat er audio afgespeeld kan worden.
    new AudioContext;
});
// Zorgt ervoor dat de gebruiker wordt doorgestuurd naar de GitHub repository.
document.querySelector("#social").addEventListener("click", () => window.location.href = "https://github.com/DylanSealy/PO-2D-games-maken/");
// Zorgt ervoor dat er een nieuwe game wordt geladen, nadat de venstergrootte is veranderd.
window.addEventListener("resize", () => {
    v.game.remove();
    v.game = new p5(sketch);
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
const getInputMethod = () => {
    const inputControls = document.getElementsByName("controls");
    if (inputControls[0].checked || v.gameInput === "keyboard") {v.gameInput = "keyboard";}
    else if (inputControls[1].checked || v.gameInput === "touch") {
        v.gameInput = "touch";
        setupTouchControls();
    } else {v.gameInput = "gestures";}
}
// Functie voor het weergeven van de touch controls elementen.
const setupTouchControls = () => {
    const touchControlsContainer = document.getElementById("touchControlsContainer");
    touchControlsContainer.style.display = "flex";
    const touchControls = document.getElementsByClassName("touchControls");
    // Zorgt ervoor dat de touch besturingselementen worden aangepast voor een landscape client.
    if (v.orientation === "landscape") {
        const touchElementWidth = (document.querySelector("html").offsetWidth - v.canvasDimension) / 2;
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
    else if (v.orientation === "portrait") {
        const touchElementHeight = (document.querySelector("html").offsetHeight - v.canvasDimension) / 2;
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