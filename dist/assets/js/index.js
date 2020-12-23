import Blinky from "./characters/Blinky.js";
import Clyde from "./characters/Clyde.js";
import HoogMan from "./characters/HoogMan.js";
import Inky from "./characters/Inky.js";
import Pinky from "./characters/Pinky.js";
import GameBoard from "./gameBoard/GameBoard.js";
import Obstacle from "./gameBoard/Obstacle.js";
import Pellet from "./gameBoard/Pellet.js";
const sketch = (p) => {
    const characterSequence = (character) => {
        if (character.name != "Hoog-Man") {
            character.iterationVariables();
        }
        character.draw();
        character.checkCollision();
        character.checkNextMovement();
        if (character.name != "Hoog-Man") {
            character.setMovement();
        }
    };
    p.preload = () => {
        p.loadFont("assets/fonts/Roboto-Light.ttf");
    };
    p.setup = () => {
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
    };
    p.draw = () => {
        p.background("black");
        p.noFill();
        v.gameBoard.draw();
        for (const obstacle in v.obstacles) {
            v.obstacles[obstacle].draw();
        }
        for (const pellet in v.pellets) {
            v.pellets[pellet].draw();
            v.pellets[pellet].checkEaten(pellet);
        }
        characterSequence(v.hoogMan);
        characterSequence(v.blinky);
        characterSequence(v.pinky);
        characterSequence(v.inky);
        characterSequence(v.clyde);
        if (v.inputMethod == "keyboard") {
            if (p.keyIsDown(p.UP_ARROW) || p.keyIsDown(87)) {
                v.hoogMan.nextMovement = "up";
            }
            else if (p.keyIsDown(p.RIGHT_ARROW) || p.keyIsDown(68)) {
                v.hoogMan.nextMovement = "right";
            }
            else if (p.keyIsDown(p.DOWN_ARROW) || p.keyIsDown(83)) {
                v.hoogMan.nextMovement = "down";
            }
            else if (p.keyIsDown(p.LEFT_ARROW) || p.keyIsDown(65)) {
                v.hoogMan.nextMovement = "left";
            }
        }
        else if (v.inputMethod == "touch") {
            touchControls();
        }
        else {
            gestureControls();
        }
    };
};
const v = {
    backgroundMusic: new Audio("assets/audio/background.webm"),
    deathSound: new Audio("assets/audio/death.webm"),
    gameOverSound: new Audio("assets/audio/gameOver.webm"),
    pelletSound: new Audio("assets/audio/pellet.webm"),
    endGame: (p) => {
        p.noLoop();
        v.hoogMan.lives--;
        responsiveGame(false, false);
        if (v.hoogMan.lives == 0) {
            v.gameOverSound.play();
            const gameEndContainer = document.querySelector("#gameEndContainer");
            gameEndContainer.style.display = "flex";
            const paragraph = document.querySelector("#gameEndContainer p");
            paragraph.innerText += ` ${v.gameBoard.score}`;
            document.querySelector("#again").addEventListener("click", () => {
                gameEndContainer.style.display = "none";
                responsiveGame(true, true);
            });
            document.querySelector("#stop").addEventListener("click", () => window.location.href = "https://github.com/DylanSealy/PO-2D-games-maken/");
        }
        else {
            v.deathSound.play();
            setTimeout(() => {
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
const initializeVars = (p) => {
    v.backgroundMusic.loop = true;
    v.backgroundMusic.volume = v.deathSound.volume = v.gameOverSound.volume = v.pelletSound.volume = 0.55;
    v.gameBoard = new GameBoard(p, v);
    v.blinky = new Blinky(p, v);
    v.clyde = new Clyde(p, v);
    v.hoogMan = new HoogMan(p, v);
    v.inky = new Inky(p, v);
    v.pinky = new Pinky(p, v);
    v.gesturePosition = [null, null, null, null];
    (() => {
        v.obstacleCoordinates = [
            [1, 1, 3, 4], [4, 0, 5, 4], [6, 1, 8, 4], [9, 0, 10, 3], [11, 1, 13, 3], [14, 0, 17, 2], [0, 5, 1, 8], [2, 5, 4, 8],
            [5, 5, 7, 6], [8, 5, 9, 6], [9, 4, 10, 7], [11, 5, 12, 6], [11, 4, 16, 5], [14, 3, 16, 4], [5, 7, 6, 8], [7, 7, 8, 10],
            [9, 8, 10, 10], [10, 9, 11, 11], [11, 7, 14, 8], [13, 6, 14, 7], [15, 6, 16, 8], [1, 9, 3, 13], [4, 9, 6, 12], [7, 11, 9, 12],
            [8, 12, 9, 13], [12, 9, 13, 12], [14, 9, 17, 10], [4, 13, 7, 14], [10, 12, 11, 14], [11, 13, 14, 14], [14, 11, 16, 12], [15, 12, 16, 13]
        ];
        v.obstacles = [];
        for (const coordinates in v.obstacleCoordinates) {
            const obstacle = new Obstacle(p, v, v.obstacleCoordinates[coordinates][0], v.obstacleCoordinates[coordinates][1], v.obstacleCoordinates[coordinates][2], v.obstacleCoordinates[coordinates][3]);
            v.obstacles.push(obstacle);
        }
    })();
    (() => {
        v.pellets = [];
        for (let xPosition = 0; xPosition < 17; xPosition++) {
            for (let yPosition = 0; yPosition < 14; yPosition++) {
                const pellet = new Pellet(p, v, xPosition, yPosition);
                if (!pellet.checkCollisionObstacle()) {
                    v.pellets.push(pellet);
                }
            }
        }
    })();
};
const touchControls = () => {
    const upTouch = document.querySelector("#upTouch");
    upTouch.addEventListener("click", () => v.hoogMan.nextMovement = "up");
    upTouch.addEventListener("touchstart", () => v.hoogMan.nextMovement = "up");
    const rightTouch = document.querySelector("#rightTouch");
    rightTouch.addEventListener("click", () => v.hoogMan.nextMovement = "right");
    rightTouch.addEventListener("touchstart", () => v.hoogMan.nextMovement = "right");
    const downTouch = document.querySelector("#downTouch");
    downTouch.addEventListener("click", () => v.hoogMan.nextMovement = "down");
    downTouch.addEventListener("touchstart", () => v.hoogMan.nextMovement = "down");
    const leftTouch = document.querySelector("#leftTouch");
    leftTouch.addEventListener("click", () => v.hoogMan.nextMovement = "left");
    leftTouch.addEventListener("touchstart", () => v.hoogMan.nextMovement = "left");
};
const gestureControls = () => {
    const checkGesture = () => {
        if (v.gesturePosition[0] != null && v.gesturePosition[1] != null) {
            if (v.gesturePosition[3] < v.gesturePosition[1] - v.gameBoard.heightUnit) {
                v.hoogMan.nextMovement = "up";
            }
            else if (v.gesturePosition[2] > v.gesturePosition[0] + v.gameBoard.heightUnit) {
                v.hoogMan.nextMovement = "right";
            }
            else if (v.gesturePosition[3] > v.gesturePosition[1] + v.gameBoard.heightUnit) {
                v.hoogMan.nextMovement = "down";
            }
            else if (v.gesturePosition[2] < v.gesturePosition[0] - v.gameBoard.heightUnit) {
                v.hoogMan.nextMovement = "left";
            }
        }
    };
    const resetGesture = (event) => {
        event.preventDefault();
        v.gesturePosition = [null, null, null, null];
    };
    const main = document.querySelector("main");
    main.addEventListener("touchstart", (event) => {
        event.preventDefault();
        v.gesturePosition[0] = event.touches[0].clientX;
        v.gesturePosition[1] = event.touches[0].clientY;
    });
    main.addEventListener("mousedown", (event) => {
        event.preventDefault();
        v.gesturePosition[0] = event.clientX;
        v.gesturePosition[1] = event.clientY;
    });
    main.addEventListener("touchmove", (event) => {
        event.preventDefault();
        v.gesturePosition[2] = event.touches[0].clientX;
        v.gesturePosition[3] = event.touches[0].clientY;
        checkGesture();
    });
    main.addEventListener("mousemove", (event) => {
        event.preventDefault();
        v.gesturePosition[2] = event.clientX;
        v.gesturePosition[3] = event.clientY;
        checkGesture();
    });
    main.addEventListener("touchend", (event) => resetGesture(event));
    main.addEventListener("mouseup", (event) => resetGesture(event));
    main.addEventListener("touchcancel", (event) => resetGesture(event));
};
document.querySelector("#social").addEventListener("click", () => window.location.href = "https://github.com/DylanSealy/PO-2D-games-maken/");
document.querySelector("#startGame").addEventListener("click", () => {
    (() => {
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
    const gameStartupContainer = document.querySelector("#gameStartupContainer");
    gameStartupContainer.style.display = "none";
});
window.addEventListener("resize", () => {
    if (v.game && v.hoogMan.lives != 0) {
        responsiveGame(true, true);
    }
});
const getInputMethod = () => {
    const inputMethod = document.getElementsByName("controls");
    if (inputMethod[0].checked || v.inputMethod == "keyboard") {
        v.inputMethod = "keyboard";
    }
    else if (inputMethod[1].checked || v.inputMethod == "touch") {
        v.inputMethod = "touch";
        (() => {
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
            }
            else {
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
    }
    else {
        v.inputMethod = "gestures";
    }
};
const responsiveGame = (resetAudio, newGame) => {
    v.backgroundMusic.pause();
    v.deathSound.pause();
    v.gameOverSound.pause();
    v.pelletSound.pause();
    if (resetAudio) {
        v.backgroundMusic.currentTime = 0;
        v.deathSound.currentTime = 0;
        v.gameOverSound.currentTime = 0;
        v.pelletSound.currentTime = 0;
    }
    if (newGame) {
        v.game.remove();
        v.game = new p5(sketch);
    }
};
const fadeIn = (audio, threshold) => {
    audio.volume = 0.00;
    audio.play();
    const fade = setInterval(() => {
        audio.volume += 0.03;
        if (audio.volume >= threshold) {
            clearInterval(fade);
            audio.volume = threshold;
        }
    }, 110);
};
(() => {
    const year = new Date().getFullYear();
    document.querySelector("footer").innerText = `© ${year} Hoog-Man`;
})();
(() => {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Mobile") != -1) {
        const inputMethod = document.getElementsByName("controls");
        inputMethod[2].checked = true;
    }
})();
