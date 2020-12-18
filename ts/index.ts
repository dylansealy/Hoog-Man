import {GameVariables} from "./Types";
import GameBoard from "./GameBoard.js";
import Obstacle from "./Obstacle.js";
import Pellet from "./Pellet.js";
const sketch = (p: p5): void => {
    p.preload = (): void => {
        p.soundFormats("mp3");
        p.loadFont("assets/fonts/Roboto-Light.ttf");
    }
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
    }
    p.draw = (): void => {
        p.background("black");
        p.noFill();
        v.gameBoard.draw();
        for (let obstacle in v.obstacles) {
            v.obstacles[obstacle].draw();
        }
        for (let pellet in v.pellets) {
            v.pellets[pellet].draw();
        }
    }
}

const v: GameVariables = {}
const initializeVars = (p: p5): void => {
    v.gameBoard = new GameBoard(p, v);
    v.obstacleCoordinates = [
        [1, 1, 3, 4], [4, 0, 5, 4], [6, 1, 8, 4], [9, 0, 10, 3], [11, 1, 13, 3], [14, 0, 17, 2], [0, 5, 1, 8], [2, 5, 4, 8],
        [5, 5, 7, 6], [8, 5, 9, 6], [9, 4, 10, 7], [11, 5, 12, 6], [11, 4, 16, 5], [14, 3, 16, 4], [5, 7, 6, 8], [7, 7, 8, 10],
        [9, 8, 10, 10], [10, 9, 11, 11], [11, 7, 14, 8], [13, 6, 14, 7], [15, 6, 16, 8], [1, 9, 3, 13], [4, 9, 6, 12], [7, 11, 9, 12],
        [8, 12, 9, 13], [12, 9, 13, 12], [14, 9, 17, 10], [4, 13, 7, 14], [10, 12, 11, 14], [11, 13, 14, 14], [14, 11, 16, 12], [15, 12, 16, 13]
    ];
    v.obstacles = [];
    for (let coordinates in v.obstacleCoordinates) {
        const obstacle = new Obstacle(p, v, v.obstacleCoordinates[coordinates][0], v.obstacleCoordinates[coordinates][1], v.obstacleCoordinates[coordinates][2], v.obstacleCoordinates[coordinates][3]);
        v.obstacles.push(obstacle);
    }
    v.pellets = [];
    for (let xPosition = 0; xPosition < 17; xPosition++) {
        for (let yPosition = 0; yPosition < 14; yPosition++) {
            const pellet = new Pellet(p, v, xPosition, yPosition);
            if (!pellet.checkCollision()) {v.pellets.push(pellet);}
        }
    }
}
document.querySelector("#startGame").addEventListener("click", (): void => {
    gameStartup();
    v.game = new p5(sketch);
    const gameStartupContainer: HTMLElement = document.querySelector("#gameStartupContainer");
    gameStartupContainer.style.display = "none";
    new AudioContext;
});
document.querySelector("#social").addEventListener("click", (): string => window.location.href = "https://github.com/DylanSealy/PO-2D-games-maken/");
window.addEventListener("resize", (): void => {
    v.game.remove();
    v.game = new p5(sketch);
});
const gameStartup = (): void => {
    const main: HTMLElement = document.querySelector("main");
    main.requestFullscreen();
    main.style.height = "100%";
    main.style.width = "100%";
    main.style.position = "absolute";
    main.style.top = "0";
    main.style.left = "0";
    main.style.backgroundColor = "black";
}
const getInputMethod = (): void => {
    const inputControls = document.getElementsByName("controls");
    if (inputControls[0].checked || v.gameInput == "keyboard") {v.gameInput = "keyboard";}
    else if (inputControls[1].checked || v.gameInput == "touch") {
        v.gameInput = "touch";
        setupTouchControls();
    } else {v.gameInput = "gestures";}
}
const setupTouchControls = (): void => {
    const touchControlsContainer = document.getElementById("touchControlsContainer");
    touchControlsContainer.style.display = "flex";
    const touchControls = document.getElementsByClassName("touchControls");
    if (v.gameBoard.orientation == "landscape") {
        const touchElementWidth: number = (document.querySelector("html").offsetWidth - v.gameBoard.canvasDimension) / 2;
        touchControlsContainer.style.width = `${touchElementWidth}px`;
        touchControlsContainer.style.height = "100%";
        touchControlsContainer.classList.remove("containerPortrait");
        touchControlsContainer.classList.add("containerLandscape");
        for (let i = 0; i < touchControls.length; i++) {
            touchControls[i].classList.remove("touchPortrait");
            touchControls[i].classList.add("touchLandscape");
        }
    }
    else if (v.gameBoard.orientation == "portrait") {
        const touchElementHeight: number = (document.querySelector("html").offsetHeight - v.gameBoard.canvasDimension) / 2;
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
((): void => {
    const year: number = new Date().getFullYear();
    document.querySelector("footer").innerText = `© ${year} Hoog-Man`;
})()
