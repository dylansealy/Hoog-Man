import {GameVariables, GhostInterface, HoogManInterface} from "./Types"; // Import om fouten in de TSC te voorkomen. TS(1)
import Blinky from "./characters/Blinky.js";
import Clyde from "./characters/Clyde.js";
import HoogMan from "./characters/HoogMan.js";
import Inky from "./characters/Inky.js";
import Pinky from "./characters/Pinky.js";
// eslint-disable-next-line sort-imports
import GameBoard from "./gameBoard/GameBoard.js";
import Obstacle from "./gameBoard/Obstacle.js";
import Pellet from "./gameBoard/Pellet.js";
const sketch = (p: p5): void => { // Sketch wordt gebruikt voor instance mode p5. HG(1)
    const characterSequence = (character: GhostInterface | HoogManInterface) => { // Zorgt voor de volgorde waarin acties van characters gebeuren.
        if (character.name != "Hoog-Man") {character.iterationVariables();}
        character.draw();
        character.checkCollision();
        character.checkNextMovement();
        if (character.name != "Hoog-Man") {character.setMovement();}
    }; // Stelt bepaalde instellingen in en zorgt ervoor dat de game kan beginnen.
    p.setup = (): void => {
        initializeVars(p);
        getInputMethod();
        p.createCanvas(v.gameBoard.canvasDimension, v.gameBoard.canvasDimension);
        p.frameRate();
        p.colorMode(p.RGB, 255);
        p.textFont("Roboto");
        p.textSize(v.gameBoard.widthUnit / 1.5);
        p.noCursor();
        p.textAlign(p.LEFT, p.CENTER);
        fadeIn(v.backgroundMusic, 0.55);
    }; // Zorgt ervoor dat alles getekend wordt en dat alle besturingselementen worden aangeroepen.
    p.draw = (): void => {
        p.background("black");
        p.noFill();
        v.gameBoard.draw();
        for (const obstacle in v.obstacles) {v.obstacles[obstacle].draw();}
        for (const pellet in v.pellets) {
            v.pellets[pellet].draw();
            v.pellets[pellet].checkEaten(pellet);
        }
        characterSequence(v.hoogMan);
        characterSequence(v.blinky);
        characterSequence(v.pinky);
        characterSequence(v.inky);
        characterSequence(v.clyde);
        // Zorgt ervoor dat alleen de gekozen input methode werkt.
        if (v.inputMethod == "keyboard") {
            // eslint-disable-next-line capitalized-comments
            // p.keyIsDown(n) zorgt ervoor dat de WASD knoppen werken.
            if (p.keyIsDown(p.UP_ARROW) || p.keyIsDown(87)) {v.hoogMan.nextMovement = "up";}
            else if (p.keyIsDown(p.RIGHT_ARROW) || p.keyIsDown(68)) {v.hoogMan.nextMovement = "right";}
            else if (p.keyIsDown(p.DOWN_ARROW) || p.keyIsDown(83)) {v.hoogMan.nextMovement = "down";}
            else if (p.keyIsDown(p.LEFT_ARROW) || p.keyIsDown(65)) {v.hoogMan.nextMovement = "left";}
        } else if (v.inputMethod == "touch") {touchControls();}
        else {gestureControls();}
    };
}; // Object waarin alle variabelen in de game worden opgeslagen.
const v: GameVariables = {
    backgroundMusic: new Audio("assets/audio/background.webm"),
    deathSound: new Audio("assets/audio/death.webm"),
    frightenedSound: new Audio("assets/audio/frightened.webm"),
    gameCompletedSound: new Audio("assets/audio/gameCompleted.webm"),
    gameOverSound: new Audio("assets/audio/gameOver.webm"),
    pelletSound: new Audio("assets/audio/pellet.webm"),
    // eslint-disable-next-line sort-keys
    frightenedTime: 0,
    // eslint-disable-next-line sort-keys
    frightenedCounter: 0,
    // eslint-disable-next-line sort-keys
    endGame: (p: p5): void => { // Functie voor de actie nadat Hoog-Man in contact komt met een ghost.
        p.noLoop();
        v.hoogMan.lives--;
        responsiveGame(false, false);
        // Laat het laatste scherm zien.
        if (v.hoogMan.lives == 0 || v.pellets.length == 0) {
            let container: HTMLElement;
            let paragraph: HTMLElement;
            let index: number;
            if (v.hoogMan.lives == 0) {
                v.gameOverSound.play();
                index = 0;
                container = document.querySelector("#gameEndContainer");
                paragraph = document.querySelector("#gameEndContainer p");
            } else {
                v.gameCompletedSound.play();
                index = 1;
                container = document.querySelector("#gameFinishedContainer");
                paragraph = document.querySelector("#gameFinishedContainer p");
            }
            container.style.display = "flex";
            paragraph.innerText += ` ${v.gameBoard.score}`;
            document.querySelectorAll(".again")[index].addEventListener("click", () => {
                container.style.display = "none";
                responsiveGame(true, true);
            });
            document.querySelectorAll(".stop")[index].addEventListener("click", () => window.location.href = "https://github.com/DylanSealy/PO-2D-games-maken/");
        } // Resets de posities van alle characters.
        else {
            v.deathSound.play();
            setTimeout((): void => {
                v.blinky.resetCharacter();
                v.clyde.resetCharacter();
                v.hoogMan.resetCharacter();
                v.inky.resetCharacter();
                v.pinky.resetCharacter();
                fadeIn(v.backgroundMusic, 0.55);
                p.loop();
            }, 650);
        }
    }
};
// Zorgt ervoor dat alle benodigde variabelen voor de game worden gedeclareerd.
const initializeVars = (p: p5): void => {
    v.backgroundMusic.loop = v.frightenedSound.loop = true;
    v.backgroundMusic.volume = v.deathSound.volume = v.gameOverSound.volume = v.pelletSound.volume = 0.55;
    v.gameCompletedSound.volume = 0.60;
    v.gameBoard = new GameBoard(p, v);
    v.blinky = new Blinky(p, v);
    v.clyde = new Clyde(p, v);
    v.hoogMan = new HoogMan(p, v);
    v.inky = new Inky(p, v);
    v.pinky = new Pinky(p, v);
    v.gesturePosition = [null, null, null, null]; // Houdt de coördinaten van de gesture inputs bij: xStart, yStart, xEnd, yEnd.
    ((): void => { // Zorgt ervoor dat alle barrières gecreëerd worden in een anonieme functie. HG(2)
        v.obstacleCoordinates = [ // Relatieve coördinaten barrières: xMin, yMin, xMax, yMax. Zie /maps/1.jpg
            [1, 1, 3, 4], [4, 0, 5, 4], [6, 1, 8, 4], [9, 0, 10, 3], [11, 1, 13, 3], [14, 0, 17, 2], [0, 5, 1, 8], [2, 5, 4, 8],
            [5, 5, 7, 6], [8, 5, 9, 6], [9, 4, 10, 7], [11, 5, 12, 6], [11, 4, 16, 5], [14, 3, 16, 4], [5, 7, 6, 8], [7, 7, 8, 10],
            [9, 8, 10, 10], [10, 9, 11, 11], [11, 7, 14, 8], [13, 6, 14, 7], [15, 6, 16, 8], [1, 9, 3, 13], [4, 9, 6, 12], [7, 11, 9, 12],
            [8, 12, 9, 13], [12, 9, 13, 12], [14, 9, 17, 10], [4, 13, 7, 14], [10, 12, 11, 14], [11, 13, 14, 14], [14, 11, 16, 12], [15, 12, 16, 13]
        ];
        v.obstacles = [];
        for (const coordinates in v.obstacleCoordinates) {
            const obstacle = new Obstacle(
                p, v, v.obstacleCoordinates[coordinates][0], v.obstacleCoordinates[coordinates][1],
                v.obstacleCoordinates[coordinates][2], v.obstacleCoordinates[coordinates][3]
            );
            v.obstacles.push(obstacle); // Zorgt ervoor dat de barrière gepusht wordt naar de obstacle array.
        }
    })();
    ((): void => { // Zorgt ervoor dat alle pellets gecreëerd worden.
        v.pellets = [];
        for (let xPosition = 0; xPosition < 17; xPosition++) {
            for (let yPosition = 0; yPosition < 14; yPosition++) {
                let pellet: Pellet;
                if (
                    xPosition == 16 && yPosition == 13 ||
                    xPosition == 13 && yPosition == 0 ||
                    xPosition == 4 && yPosition == 6
                ) {pellet = new Pellet(p, v, xPosition, yPosition, true);}
                else {pellet = new Pellet(p, v, xPosition, yPosition, false);}
                if (!pellet.checkCollisionObstacle()) {v.pellets.push(pellet);}
            }
        }
    })();
}; // Functie voor het laten werken van de touch controls.
const touchControls = (): void => {
    const upTouch: HTMLLIElement = document.querySelector("#upTouch");
    // Checkt of er gedrukt wordt op een knop en zet de volgende bewegingsrichting van Hoog-Man.
    upTouch.addEventListener("click", () => v.hoogMan.nextMovement = "up");
    upTouch.addEventListener("touchstart", () => v.hoogMan.nextMovement = "up");

    const rightTouch: HTMLLIElement = document.querySelector("#rightTouch");
    rightTouch.addEventListener("click", () => v.hoogMan.nextMovement = "right");
    rightTouch.addEventListener("touchstart", () => v.hoogMan.nextMovement = "right");
    const downTouch: HTMLLIElement = document.querySelector("#downTouch");
    downTouch.addEventListener("click", () => v.hoogMan.nextMovement = "down");
    downTouch.addEventListener("touchstart", () => v.hoogMan.nextMovement = "down");
    const leftTouch: HTMLLIElement = document.querySelector("#leftTouch");
    leftTouch.addEventListener("click", () => v.hoogMan.nextMovement = "left");
    leftTouch.addEventListener("touchstart", () => v.hoogMan.nextMovement = "left");
}; // Functie voor het laten werken van de gesture controls.
const gestureControls = (): void => {
    const checkGesture = (): void => { // Bepaalt welke gesture er uitgevoerd wordt.
        // Checkt of een gesture gestart is.
        if (v.gesturePosition[0] != null && v.gesturePosition[1] != null) {
            // eslint-disable-next-line capitalized-comments
            // v.gameBoard.*Unit als marge voor de grootte van de gesture.
            if (v.gesturePosition[3] < v.gesturePosition[1] - v.gameBoard.heightUnit) {v.hoogMan.nextMovement = "up";}
            else if (v.gesturePosition[2] > v.gesturePosition[0] + v.gameBoard.heightUnit) {v.hoogMan.nextMovement = "right";}
            else if (v.gesturePosition[3] > v.gesturePosition[1] + v.gameBoard.heightUnit) {v.hoogMan.nextMovement = "down";}
            else if (v.gesturePosition[2] < v.gesturePosition[0] - v.gameBoard.heightUnit) {v.hoogMan.nextMovement = "left";}
        }
    }; // Resets de gesture.
    const resetGesture = (): void => {v.gesturePosition = [null, null, null, null];};
    // Bepaalt de start positie van een gesture.
    const main = document.querySelector("main");
    main.addEventListener("touchstart", (event): void => {
        // Zorgt ervoor dat de pagina niet herlaat, maar dat de endGame button click wel werkt.
        if (v.hoogMan.lives != 0 && v.pellets.length != 0) {event.preventDefault();} // Zorgt ervoor dat de standaardactie niet uitgevoerd wordt.
        v.gesturePosition[0] = event.touches[0].clientX;
        v.gesturePosition[1] = event.touches[0].clientY;
    });
    main.addEventListener("mousedown", (event): void => {
        v.gesturePosition[0] = event.clientX;
        v.gesturePosition[1] = event.clientY;
    }); // Bepaalt de eind positie van een gesture.
    main.addEventListener("touchmove", (event): void => {
        v.gesturePosition[2] = event.touches[0].clientX;
        v.gesturePosition[3] = event.touches[0].clientY;
        checkGesture();
    });
    main.addEventListener("mousemove", (event): void => {
        v.gesturePosition[2] = event.clientX;
        v.gesturePosition[3] = event.clientY;
        checkGesture();
    }); // Resets de gesture nadat deze klaar is.
    main.addEventListener("touchend", (): void => resetGesture());
    main.addEventListener("mouseup", (): void => resetGesture());
    main.addEventListener("touchcancel", (): void => resetGesture());
};
document.querySelector("#social").addEventListener("click", () => window.location.href = "https://github.com/DylanSealy/PO-2D-games-maken/");
document.querySelector("#startGame").addEventListener("click", (): void => {
    ((): void => { // Zorgt ervoor dat de container van de game even groot wordt als het scherm.
        const main = document.querySelector("main");
        main.requestFullscreen();
        main.style.height = "100%";
        main.style.width = "100%";
        main.style.position = "absolute";
        main.style.top = "0";
        main.style.left = "0";
        main.style.backgroundColor = "black";
    })();
    v.game = new p5(sketch);
    const gameStartupContainer: HTMLElement = document.querySelector("#gameStartupContainer");
    gameStartupContainer.style.display = "none";
}); // Zorgt ervoor dat de game responsive is.
window.addEventListener("resize", (): void => {
    if (v.game && v.hoogMan.lives != 0) {responsiveGame(true, true);}
}); // Checkt wat de gekozen input methode is.
const getInputMethod = (): void => {
    const inputMethod = document.getElementsByName("controls");
    if (inputMethod[0].checked || v.inputMethod == "keyboard") {v.inputMethod = "keyboard";}
    else if (inputMethod[1].checked || v.inputMethod == "touch") {
        v.inputMethod = "touch";
        ((): void => { // Laat de touch control knoppen verschijnen.
            const touchControlsContainer = document.getElementById("touchControlsContainer");
            touchControlsContainer.style.display = "flex";
            const touchControls = document.getElementsByClassName("touchControls");
            if (v.gameBoard.orientation == "landscape") {
                const touchElementWidth = (document.querySelector("html").offsetWidth - v.gameBoard.canvasDimension) / 2;
                touchControlsContainer.style.width = `${touchElementWidth}px`;
                touchControlsContainer.style.height = "100%";
                touchControlsContainer.classList.remove("containerPortrait");
                touchControlsContainer.classList.add("containerLandscape");
                for (let i = 0; i < touchControls.length; i++) {
                    touchControls[i].classList.remove("touchPortrait");
                    touchControls[i].classList.add("touchLandscape");
                }
            } else {
                const touchElementHeight = (document.querySelector("html").offsetHeight - v.gameBoard.canvasDimension) / 2;
                touchControlsContainer.style.height = `${touchElementHeight}px`;
                touchControlsContainer.style.width = "100%";
                touchControlsContainer.classList.remove("containerLandscape");
                touchControlsContainer.classList.add("containerPortrait");
                for (let i = 0; i < touchControls.length; i++) {
                    touchControls[i].classList.remove("touchLandscape");
                    touchControls[i].classList.add("touchPortrait");
                }
            }
        })();
    } else {v.inputMethod = "gestures";}
}; // Zorgt ervoor dat de game correct functioneert na een wijziging in de grootte van het scherm.
const responsiveGame = (resetAudio: boolean, newGame: boolean): void => {
    v.backgroundMusic.pause();
    v.deathSound.pause();
    v.frightenedSound.pause();
    v.gameCompletedSound.pause();
    v.gameOverSound.pause();
    v.pelletSound.pause();
    if (resetAudio) { // Zorgt ervoor dat de audio bij het begin is.
        v.backgroundMusic.currentTime = 0;
        v.deathSound.currentTime = 0;
        v.frightenedSound.currentTime = 0;
        v.gameCompletedSound.currentTime = 0;
        v.gameOverSound.currentTime = 0;
        v.pelletSound.currentTime = 0;
    }
    if (newGame) { // Creëert een nieuwe game.
        v.game.remove();
        v.game = new p5(sketch);
    }
}; // Zorgt voor een fadeIn effect van de audio.
const fadeIn = (audio: HTMLAudioElement, threshold: number): void => {
    audio.volume = 0.00;
    audio.play();
    const fade = setInterval((): void => { // Zorgt ervoor dat het volume omhoog gaat na een interval.
        audio.volume += 0.03;
        if (audio.volume >= threshold) {
            clearInterval(fade);
            audio.volume = threshold;
        }
    }, 110);
};
((): void => { // Zorgt voor het correcte copyright jaar.
    const year = new Date().getFullYear();
    document.querySelector("footer").innerText = `© ${year} Hoog-Man`;
})();
((): void => { // Checkt of het een mobiel apparaat is zet de aanbevolen input method.
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Mobile") != -1) {
        const inputMethod = document.getElementsByName("controls");
        inputMethod[2].checked = true;
    }
})();
