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
        p.frameRate();
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
        for (ch in v.xCharacter) {
            iterationVariables(ch, p);
            drawCharacters(ch, p);
            checkCollision(ch);
            checkDirection(ch);
            ghostMovement(ch, p);
        } // Zorgt ervoor dat alleen de gekozen input methode werkt.
        if (v.gameInput === "keyboard") {
            // Checkt of een knop op het toetsenbord wordt ingedrukt.
            if (p.keyIsDown(p.UP_ARROW) || p.keyIsDown(87)) {v.nextCharacterMovement[0] = "up";}
            else if (p.keyIsDown(p.RIGHT_ARROW) || p.keyIsDown(68)) {v.nextCharacterMovement[0] = "right";}
            else if (p.keyIsDown(p.DOWN_ARROW) || p.keyIsDown(83)) {v.nextCharacterMovement[0] = "down";}
            else if (p.keyIsDown(p.LEFT_ARROW) || p.keyIsDown(65)) {v.nextCharacterMovement[0] = "left";}
        } else if (v.gameInput === "touch") {touchControls();}
        else if (v.gameInput === "gestures") {gestureControls();}
    }
} // v is een object. Binnen een object heb je key/value pairs.
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
        v.orientation = "portrait";
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
    // Definieert de positie, grootte, kleur, snelheid, bewegingsrichting en botsing van elk karakter.
    v.xCharacter = [v.xInner + v.widthUnit * 0.5, v.xInner + v.widthUnit * 13.5, v.xInner + v.widthUnit * 13.5, v.xInner + v.widthUnit * 13.5, v.xInner + v.widthUnit * 13.5];
    v.yCharacter = [v.yInner + v.heightUnit * 0.5, v.yInner + v.heightUnit * 0.5, v.yInner + v.heightUnit * 1.5, v.yInner + v.heightUnit * 2.5, v.yInner + v.heightUnit * 3.5];
        // Definieert de diameter van elk karakter.
    v.dCharacter = [0, 0, 0, 0, 0];
        // Zorgt ervoor dat elke waarde in de array hetzelfde is zonder deze steeds te herhalen.
    v.dCharacter.fill(v.heightUnit / 2);
    v.cCharacter = ["yellow", "red", "pink", "blue", "orange"];
    v.characterSpeed = [0, 0, 0, 0, 0];
    v.characterSpeed.fill(88 / 60 / 650 * v.innerHeight);
    v.characterMovement = [false, false, false, false, false];
        // Definieert de oude bewegingsrichting.
    v.previousCharacterMovement = [false, false, false, false, false];
        // Definieert de volgende bewegingsrichting.
    v.nextCharacterMovement = [false, "left", "left", "left", "left"];
    v.xCharacterMovement = [false, false, false, false, false];
    v.yCharacterMovement = [false, false, false, false, false];
    v.collision = [false, false, false, false, false];
    // Definieert de modus van elke ghost. Index 0 is Hoog-Man, maar wordt niet gebruikt.
    v.ghostMode = ["scatter", "scatter", "scatter", "scatter", "scatter"];
    v.ghostModeCounter = [0, 0, 0, 0, 0];
    // Definieert de target tile van elke ghost.
    v.ghostTarget = [[0, 0], [v.xOuter, v.yOuter + v.outerHeight], [v.xOuter, v.yOuter], [v.xOuter + v.outerWidth, v.yOuter + v.outerHeight], [v.xOuter + v.outerWidth, v.yOuter]];
    // Definieert de coördinaten van de gesture inputs. xStart, yStart, xEnd, yEnd.
    v.gesturePosition = [null, null, null, null];
    // Zorgt ervoor dat alle barrières gecreëerd worden.
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
            if (!checkCollision(xPellet, yPellet)) {v.pellets.push([xPellet, yPellet]);}
        }
    } // Zorgt ervoor dat de score wordt bijgehouden.
    v.score = 0;
} // Functie voor het afspelen van het intro liedje.
// const playIntroSound = (p, introSound) => {
//     p.push();
//     p.noLoop();
//     introSound.play();
//     p.pop();
// } // Functie voor het zetten van enkele variabelen na elke herhaling van de draw functie.
const iterationVariables = (ch, p) => {
        // Zorgt ervoor dat de framerate wordt afgerond naar het dichtstbijzijnde gehele getal.
    v.frameRate = Math.round(p.frameRate());
    if (v.ghostMode[ch] != "frightened") {
        // Checkt hoeveel seconden er voorbij zijn gegaan.
        if (Math.floor(v.ghostModeCounter[ch] / v.frameRate) == 6) {
            // Zorgt ervoor dat de modus van een ghost verandert.
            if (v.ghostMode[ch] === "scatter") {v.ghostMode[ch] = "chase";}
            else {v.ghostMode[ch] = "scatter";}
            v.ghostModeCounter[ch] = 0;
        } v.ghostModeCounter[ch] += 1;
    } v.collision[ch] = false;
} // Functie voor het tekenen van elementen van het spelbord.
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
} // Functie voor het tekenen van alle karakters.
const drawCharacters = (ch, p) => {
    p.push();
    p.noStroke();
    p.fill(v.cCharacter[ch]);
    p.ellipse(v.xCharacter[ch], v.yCharacter[ch], v.dCharacter[ch]);
    p.pop();
    // Zorgt ervoor dat alle karakters bewegen in hun gedefinieerde bewegingsrichting met hun gedefinieerde snelheid.
    if (v.characterMovement[ch] === "up") {v.yCharacter[ch] -= v.characterSpeed[ch];}
    else if (v.characterMovement[ch] === "right") {v.xCharacter[ch] += v.characterSpeed[ch];}
    else if (v.characterMovement[ch] === "down") {v.yCharacter[ch] += v.characterSpeed[ch];}
    else if (v.characterMovement[ch] === "left") {v.xCharacter[ch] -= v.characterSpeed[ch];}
} // Functie voor de bewegingen van de ghosts.
const ghostMovement = (ch, p) => {
    // Functie voor het checken van de afstand tussen een ghost en Hoog-Man.
    const checkDistanceToHoogMan = (chr, xMargin, yMargin) => {
        const upDistance = p.dist(v.xCharacter[chr], v.yCharacter[chr] - v.heightUnit * 0.5, v.xCharacter[0] + v.widthUnit * xMargin, v.yCharacter[0] + v.heightUnit * yMargin);
        const rightDistance = p.dist(v.xCharacter[chr] + v.widthUnit * 0.5, v.yCharacter[chr], v.xCharacter[0] + v.widthUnit * xMargin, v.yCharacter[0] + v.heightUnit * yMargin);
        const downDistance = p.dist(v.xCharacter[chr], v.yCharacter[chr] + v.heightUnit * 0.5, v.xCharacter[0] + v.widthUnit * xMargin, v.yCharacter[0] + v.heightUnit * yMargin);
        const leftDistance = p.dist(v.xCharacter[chr] - v.widthUnit * 0.5, v.yCharacter[chr], v.xCharacter[0] + v.widthUnit * xMargin, v.yCharacter[0] + v.heightUnit * yMargin);
        const distance = [upDistance, rightDistance, downDistance, leftDistance];
        const directionOrder = [];
        for (let i = 0; i < distance.length; i++) {
            // Bepaalt de kleinste waarde in de array. ... zorgt ervoor dat individuele elementen worden gegeven als parameter.
            const smallestDistance = Math.min(...distance);
            // Bepaalt de index in de array.
            const index = distance.indexOf(smallestDistance);
            directionOrder.push(index);
            // Zorgt ervoor dat de kleinste waarde groter wordt.
            distance[index] = distance[index] * 100;
        } return directionOrder;
    } // Functie voor het checken van de afstand tussen een ghost en zijn target tile.
    const checkDistanceToTargetTile = () => {
        const upDistance = p.dist(v.xCharacter[ch], v.yCharacter[ch] - v.heightUnit * 0.5, v.ghostTarget[ch][0], v.ghostTarget[ch][1]);
        const rightDistance = p.dist(v.xCharacter[ch] + v.widthUnit * 0.5, v.yCharacter[ch], v.ghostTarget[ch][0], v.ghostTarget[ch][1]);
        const downDistance = p.dist(v.xCharacter[ch], v.yCharacter[ch] + v.heightUnit * 0.5, v.ghostTarget[ch][0], v.ghostTarget[ch][1]);
        const leftDistance = p.dist(v.xCharacter[ch] - v.widthUnit * 0.5, v.yCharacter[ch], v.ghostTarget[ch][0], v.ghostTarget[ch][1]);
        const distance = [upDistance, rightDistance, downDistance, leftDistance];
        const directionOrder = [];
        for (let i = 0; i < distance.length; i++) {
            const smallestDistance = Math.min(...distance);
            const index = distance.indexOf(smallestDistance);
            directionOrder.push(index);
            distance[index] = distance[index] * 100;
        } return directionOrder;
    } // Functie voor het bepalen welke richting de ghost op gaat.
    const setDirection = (directionOrder, index) => {
        // Functie voor het checken of een ghost een bepaalde richting op kan.
        const checkTargetDirection = (targetDirection, forbiddenDirection) => {
            // 1. Checkt of er geen botsing plaatsvindt na de nieuwe bewegingsrichting.
            // 2. Checkt of de nieuwe bewegingsrichting niet tegenovergesteld is aan de huidige.
            // 3. Checkt of de nieuwe bewegingsrichting niet gelijk is aan de huidige. Dit voorkomt dat v.previousCharacterMovement[ch] wordt overschreven.
            if (!checkCollisionInput(ch, targetDirection) && v.characterMovement[ch] != forbiddenDirection && v.characterMovement[ch] != targetDirection) {
                // Checkt of de nieuwe bewegingsrichting niet tegenovergesteld is aan de bewegingsrichting voor de huidige. Als dit wel zo is dan mag er geen botsing plaatsvinden.
                if (v.previousCharacterMovement[ch] != forbiddenDirection || (v.previousCharacterMovement[ch] == forbiddenDirection && v.collision[ch] === false)) {
                    v.nextCharacterMovement[ch] = targetDirection;
                    return true;
                } // Checkt of de nieuwe bewegingsrichting gelijk is aan de bewegingsrichting voor de huidige en als er een botsing plaatsvindt.
                else if (v.previousCharacterMovement[ch] == forbiddenDirection && v.collision[ch] === true) {
                    // Zet de nieuwe bewegingsrichting na een bepaalde tijd. Dit om ervoor te zorgen dat een ghost niet meteen een nieuwe bewegingsrichting krijgt na een botsing.
                    setTimeout(() => {
                        v.nextCharacterMovement[ch] = targetDirection;
                        return true;
                    }, 50);
                }
            } return false;
        } // Checkt welke richting de ghost op wil.
        switch (directionOrder[index]) {
            case 0: return checkTargetDirection("up", "down");
            case 1: return checkTargetDirection("right", "left");
            case 2: return checkTargetDirection("down", "up");
            case 3: return checkTargetDirection("left", "right");
        }
    } // Functie voor het checken of de voorkeursrichting is toegestaan. Anders probeert de ghost de volgende voorkeursrichting. === false zorgt ervoor dat de functie niet te vaak wordt aangeroepen.
    const movementSequence = (directionOrder) => {
        if (!setDirection(directionOrder, 0) && v.characterMovement[ch] === false) {
            if (!setDirection(directionOrder, 1) && v.characterMovement[ch] === false) {
                if (!setDirection(directionOrder, 2) && v.characterMovement[ch] === false) {
                    setDirection(directionOrder, 3);
                }
            }
        }
    } // Checkt of een ghost deze functie aanroept.
    if (ch > 0) { // Checkt in welke modus een ghost zit.
        if (v.ghostMode[ch] === "chase") { // Checkt welke ghost moet bewegen.
            if (ch == 1) {movementSequence(checkDistanceToHoogMan(ch, 0, 0));}
            else if (ch == 2) {
                let directionOrder = null;
                // Zorgt ervoor dat de target tile voor Hoog-Mans bewegingsrichting is.
                switch (v.characterMovement[0]) {
                    case "up": directionOrder = checkDistanceToHoogMan(ch, 0, -4); break;
                    case "right": directionOrder = checkDistanceToHoogMan(ch, 4, 0); break;
                    case "down": directionOrder = checkDistanceToHoogMan(ch, 0, 4); break;
                    case "left": directionOrder = checkDistanceToHoogMan(ch, -4, 0); break;
                    default:
                        switch (v.previousCharacterMovement[0]) {
                            case "up": directionOrder = checkDistanceToHoogMan(ch, 0, -4); break;
                            case "right": directionOrder = checkDistanceToHoogMan(ch, 4, 0); break;
                            case "down": directionOrder = checkDistanceToHoogMan(ch, 0, 4); break;
                            case "left": directionOrder = checkDistanceToHoogMan(ch, -4, 0); break;
                            // Zorgt ervoor dat een ghost altij een doel heeft.
                            default: directionOrder = checkDistanceToHoogMan(ch, 0, 0); break;
                        } break;
                } movementSequence(directionOrder);
            } else if (ch == 3) {
                let directionOrder = null;
                switch (v.characterMovement[0]) {
                    case "up": directionOrder = checkDistanceToHoogMan(ch, -2, -2); break;
                    case "right": directionOrder = checkDistanceToHoogMan(ch, 2, 2); break;
                    case "down": directionOrder = checkDistanceToHoogMan(ch, 2, 2); break;
                    case "left": directionOrder = checkDistanceToHoogMan(ch, -2, -2); break;
                    default:
                        switch (v.previousCharacterMovement[0]) {
                            case "up": directionOrder = checkDistanceToHoogMan(ch, -2, -2); break;
                            case "right": directionOrder = checkDistanceToHoogMan(ch, 2, 2); break;
                            case "down": directionOrder = checkDistanceToHoogMan(ch, 2, 2); break;
                            case "left": directionOrder = checkDistanceToHoogMan(ch, -2, -2); break;
                            default: directionOrder = checkDistanceToHoogMan(ch, 0, 0); break;
                        } break;
                } movementSequence(directionOrder);
            } else if (ch == 4) {
                if ( // Checkt of de ghost binnen 8 tiles is.
                    v.xCharacter[ch] > v.xCharacter[0] + v.widthUnit * 8 || v.xCharacter[ch] < v.xCharacter[0] - v.widthUnit * 8 ||
                    v.yCharacter[ch] > v.yCharacter[0] + v.heightUnit * 8 || v.yCharacter[ch] < v.yCharacter[0] - v.heightUnit * 8
                ) {movementSequence(checkDistanceToHoogMan(ch, 0, 0));}
                else {movementSequence(checkDistanceToTargetTile());}
            }
        } else if (v.ghostMode[ch] === "scatter") {movementSequence(checkDistanceToTargetTile());}
        else if (v.ghostMode[ch] === "frightened") {
            // Zorgt voor een random bewegingsrichting volgorde.
            const directionOrder = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
            // Zorgt voor een random nummer van 0 tot 4.
            let randomIndex = Math.floor(Math.random() * 4);
            if (!setDirection(directionOrder, randomIndex) && v.characterMovement[ch] === false) {
                directionOrder.splice(randomIndex, 1);
                randomIndex = Math.floor(Math.random() * 2);
                if (!setDirection(directionOrder, randomIndex) && v.characterMovement[ch] === false) {
                    directionOrder.splice(randomIndex, 1);
                    randomIndex = Math.floor(Math.random() * 1);
                } if (!setDirection(directionOrder, randomIndex) && v.characterMovement[ch] === false) {
                    directionOrder.splice(randomIndex, 1);
                    setDirection(directionOrder, 0)
                }
            }
        }
    }
} // Functie voor het checken of er een botsing plaatsvindt met een barrière.
const checkCollision = (ch, xIndex, yIndex) => {
    for (ob in v.obstacles) {
        // Checkt of een pellet botst met een barrière.
        if (typeof xIndex != "undefined" && typeof yIndex != "undefined") {
            if (
                v.xInner + v.widthUnit * (0.5 + xIndex) > v.obstacles[ob][0] && v.xInner + v.widthUnit * (0.5 + xIndex) < v.obstacles[ob][2] &&
                v.yInner + v.heightUnit * (0.5 + yIndex) > v.obstacles[ob][1] && v.yInner + v.heightUnit * (0.5 + yIndex) < v.obstacles[ob][3]
            ) {return true;}
        } // Checkt of een karakter botst met een barrière.
        else if ( // -1 als marge tussen een karakter en een barrière. Anders is deze statement altijd waar.
            v.xCharacter[ch] + v.widthUnit * 0.5 - 1 > v.obstacles[ob][0] &&
            v.xCharacter[ch] - v.widthUnit * 0.5 + 1 < v.obstacles[ob][2] &&
            v.yCharacter[ch] + v.heightUnit * 0.5 - 1 > v.obstacles[ob][1] &&
            v.yCharacter[ch] - v.heightUnit * 0.5 + 1 < v.obstacles[ob][3]
        ) {return resetDirection(ch, true);}
        else if ( // Checkt of een karakter botst met een buitenlijn.
            v.xCharacter[ch] - v.widthUnit * 0.5 + 1 < v.xInner || v.xCharacter[ch] + v.widthUnit * 0.5 - 1 > v.xInner + v.innerWidth ||
            v.yCharacter[ch] - v.heightUnit * 0.5 + 1 < v.yInner || v.yCharacter[ch] + v.heightUnit * 0.5 -1 > v.yInner + v.innerHeight
        ) {return resetDirection(ch, true);}
    } return false;
} // Functie voor het checken of er een botsing plaatsvindt met een barrière of een buitenlijn na een key input.
const checkCollisionInput = (ch, nextCharacterMovement) => {
    for (ob in v.obstacles) {
        if (nextCharacterMovement === "up") {
            // Checkt of Hoog-Man door een gat in de buitenlijnen gaat.
            if (
                v.xCharacter[ch] > v.xInner + v.widthUnit &&
                v.xCharacter[ch] < v.xInner + v.widthUnit * 2 &&
                v.yCharacter[ch] > v.yInner &&
                v.yCharacter[ch] < v.yInner + v.heightUnit &&
                ch == 0
            ) {v.yCharacter[ch] = v.yInner + v.innerHeight;}
            // Checkt of een karakter botst met een buitelijn.
            else if (v.yCharacter[ch] > v.yInner && v.yCharacter[ch] < v.yInner + v.heightUnit) {return true;}
            // Checkt of een karakter bots met een barrière.
            else if ( // Marge tussen vermenigvuldigingsfactor en 0.5 om ervoor te zorgen dat deze statements minder snel waar zijn.
                // Positie links van de barrière.
                v.xCharacter[ch] + v.widthUnit * 0.45 >= v.obstacles[ob][0] &&
                // Positie rechts van de barrière.
                v.xCharacter[ch] - v.widthUnit * 0.45 <= v.obstacles[ob][2] &&
                // Positie boven de barrière.
                v.yCharacter[ch] + v.heightUnit * 0.45 >= v.obstacles[ob][1] &&
                // Positie onder de barrière.
                v.yCharacter[ch] - v.heightUnit * 0.55 <= v.obstacles[ob][3]
            ) {return true;}
        } else if (nextCharacterMovement === "right") {
            if (v.xCharacter[ch] > v.xInner + v.widthUnit * 16 && v.xCharacter[ch] < v.xInner + v.widthUnit * 17) {return true;}
            else if (
                v.xCharacter[ch] + v.widthUnit * 0.55 >= v.obstacles[ob][0] && v.xCharacter[ch] - v.widthUnit * 0.45 <= v.obstacles[ob][2] &&
                v.yCharacter[ch] + v.heightUnit * 0.45 >= v.obstacles[ob][1] && v.yCharacter[ch] - v.heightUnit * 0.45 <= v.obstacles[ob][3]                
            ) {return true;}
        } else if (nextCharacterMovement === "down") {
            if (
                v.xCharacter[ch] > v.xInner + v.widthUnit && v.xCharacter[ch] < v.xInner + v.widthUnit * 2 &&
                v.yCharacter[ch] > v.yInner + v.heightUnit * 13 && v.yCharacter[ch] < v.yInner + v.heightUnit * 14 && ch == 0
            ) {v.yCharacter[ch] = v.yInner;}
            else if (v.yCharacter[ch] > v.yInner + v.heightUnit * 13 && v.yCharacter[ch] < v.yInner + v.heightUnit * 14) {return true;}
            else if (
                v.xCharacter[ch] + v.widthUnit * 0.45 >= v.obstacles[ob][0] && v.xCharacter[ch] - v.widthUnit * 0.45 <= v.obstacles[ob][2] &&
                v.yCharacter[ch] + v.heightUnit * 0.55 >= v.obstacles[ob][1] && v.yCharacter[ch] - v.heightUnit * 0.45 <= v.obstacles[ob][3]                
            ) {return true;}
        } else if (nextCharacterMovement === "left") {
            if (v.xCharacter[ch] > v.xInner && v.xCharacter[ch] < v.xInner + v.widthUnit) {return true;}
            else if (
                v.xCharacter[ch] + v.widthUnit * 0.45 >= v.obstacles[ob][0] && v.xCharacter[ch] - v.widthUnit * 0.55 <= v.obstacles[ob][2] &&
                v.yCharacter[ch] + v.heightUnit * 0.45 >= v.obstacles[ob][1] && v.yCharacter[ch] - v.heightUnit * 0.45 <= v.obstacles[ob][3]                
            ) {return true;}
        }
    } return false;
} // Functie voor het simuleren van een key press.
const checkDirection = ch => {
    switch (v.nextCharacterMovement[ch]) {
        case "up": upPress(ch); break;
        case "right": rightPress(ch); break;
        case "down": downPress(ch); break;
        case "left": leftPress(ch); break;
    }
} // Functies voor het laten bewegen van een karakter.
const upPress = ch => {
    // Checkt of er geen botsing plaatsvindt.
    if (!checkCollisionInput(ch, "up")) {
        if (v.characterMovement[ch] != false) {v.previousCharacterMovement[ch] = v.characterMovement[ch];}
        resetDirection(ch);
        v.characterMovement[ch] = "up";
        constrainPostion(ch);
    }
}
const rightPress = ch => {
    if (!checkCollisionInput(ch, "right")) {
        if (v.characterMovement[ch] != false) {v.previousCharacterMovement[ch] = v.characterMovement[ch];}
        resetDirection(ch);
        v.characterMovement[ch] = "right";
        constrainPostion(ch);
    }
}
const downPress = ch => {
    if (!checkCollisionInput(ch, "down")) {
        if (v.characterMovement[ch] != false) {v.previousCharacterMovement[ch] = v.characterMovement[ch];}
        resetDirection(ch);
        v.characterMovement[ch] = "down";
        constrainPostion(ch);
    }
}
const leftPress = ch => {
    if (!checkCollisionInput(ch, "left")) {
        if (v.characterMovement[ch] != false) {v.previousCharacterMovement[ch] = v.characterMovement[ch];}
        resetDirection(ch);
        v.characterMovement[ch] = "left";
        constrainPostion(ch);
    }
} // Functie voor het resetten van een karakters bewegingsrichting.
const resetDirection = (ch, afterCollision) => {
    if (v.characterMovement[ch] != false) {v.previousCharacterMovement[ch] = v.characterMovement[ch];}
    v.characterMovement[ch] = false;
    v.xCharacterMovement[ch] = false;
    v.yCharacterMovement[ch] = false;
    v.nextCharacterMovement[ch] = false;
    v.collision[ch] = true;
    // Zorgt ervoor dat een karakter weer gecentreerd staat na een stop.
    if (afterCollision) {constrainPostion(ch);}
} // Functie voor het beperken van een karakter zodat hij altijd een vaste x of y positie heeft.
const constrainPostion = ch => {
    if (v.characterMovement[ch] === "left" || v.characterMovement[ch] === "right") {v.xCharacterMovement[ch] = true;}
    else if (v.characterMovement[ch] === "up" || v.characterMovement[ch] === "down") {v.yCharacterMovement[ch] = true;}
    // Zorgt voor een vaste positie van een karakter ten opzichte van de y-as.
    if (v.xCharacterMovement[ch]) {
        for (let i = 0; i < 14; i++) {
            if (v.yCharacter[ch] > v.yInner + v.heightUnit * i && v.yCharacter[ch] < v.yInner + v.heightUnit * (i + 1)) {
                return v.yCharacter[ch] = v.yInner + v.heightUnit * (i + 0.5);
            }
        }
    } // Zorgt voor een vaste positie van een karakter ten opzichte van de x-as.
    else if (v.yCharacterMovement[ch]) {
        for (let i = 0; i < 17; i++) {
            if (v.xCharacter[ch] > v.xInner + v.widthUnit * i && v.xCharacter[ch] < v.xInner + v.widthUnit * (i + 1)) {
                return v.xCharacter[ch] = v.xInner + v.widthUnit * (i + 0.5);
            }
        }
    } // Zorgt voor een vaste positie van een karakter ten opzichte van de x- en y-as.
    else {
        for (let i = 0; i < 14; i++) {
            if (v.yCharacter[ch] > v.yInner + v.heightUnit * i && v.yCharacter[ch] < v.yInner + v.heightUnit * (i + 1)) {
                v.yCharacter[ch] = v.yInner + v.heightUnit * (i + 0.5);
                break;
            }
        }
        for (let i = 0; i < 17; i++) {
            if (v.xCharacter[ch] > v.xInner + v.widthUnit * i && v.xCharacter[ch] < v.xInner + v.widthUnit * (i + 1)) {
                v.xCharacter[ch] = v.xInner + v.widthUnit * (i + 0.5);
                break;
            }
        }
    }
} // Functie voor het besturen van Hoog-Man doormiddel van touch.
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
} // Functie voor het besturen van Hoog-Man doormiddel van gestures.
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
} // Pagina specifieke JavaScript.
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
} // Functie voor het checken welke input methode er wordt gebruikt.
const getInputMethod = () => {
    const inputControls = document.getElementsByName("controls");
    if (inputControls[0].checked || v.gameInput === "keyboard") {v.gameInput = "keyboard";}
    else if (inputControls[1].checked || v.gameInput === "touch") {
        v.gameInput = "touch";
        setupTouchControls();
    } else {v.gameInput = "gestures";}
} // Functie voor het weergeven van de touch controls elementen.
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
    } // Zorgt ervoor dat de touch besturingselementen worden aangepast voor een portrait client.
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
} // Functie voor het correcte copyright jaar. Dit is een directe functie die meteen wordt uitgevoerd.
(() => {
    const year = new Date().getFullYear();
    document.querySelector("footer").innerText = `© ${year} Hoog-Man`;
})()