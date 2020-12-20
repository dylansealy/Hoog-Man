import p5 from "p5";
export interface GameVariables {
    game: p5;
    gameBoard: GameBoardInterface;
    gesturePosition: Array<number>;
    hoogMan: HoogManInterface;
    inputMethod: "keyboard" | "touch" | "gestures";
    obstacleCoordinates: Array<Array<number>>;
    obstacles: Array<ObstacleInterface>;
    pellets: Array<PelletInterface>;
}
export interface GameBoardInterface {
    canvasDimension: number;
    heightUnit: number;
    widthUnit: number;
    innerHeight: number;
    innerWidth: number;
    orientation: "portrait" | "landscape";
    outerHeight: number;
    outerWidth: number;
    p: p5;
    score: number;
    v: GameVariables;
    xInner: number;
    xOuter: number;
    yInner: number;
    yOuter: number;
    draw: Function;
}
export interface PelletInterface {
    color: string;
    diameter: number;
    p: p5;
    v: GameVariables;
    xMargin: number;
    yMargin: number;
    xPosition: number;
    yPosition: number;
    checkCollisionObstacle: Function;
    checkEaten: Function;
    draw: Function;
}
export interface ObstacleInterface {
    height: number;
    width: number;
    p: p5;
    v: GameVariables;
    xPosition: number;
    yPosition: number;
    draw: Function;
}
export interface CharacterInterface {
    collision: boolean;
    color: string;
    diameter: number;
    previousMovement: Movement;
    movement: Movement;
    name: Name;
    nextMovement: Movement;
    p: p5;
    speed: number;
    v: GameVariables;
    xPosition: number;
    yPosition: number;
    checkCollision: Function;
    checkCollisionInput: Function;
    checkNextMovement: Function;
    constrainPosition: Function;
    draw: Function;
    keyPress: Function;
    resetMovement: Function;
}
export interface HoogManInterface extends CharacterInterface {
    lives: number;
}
export type Movement = "up" | "right" | "down" | "left";
export type Name = "Hoog-Man" | "Blinky" | "Pinky" | "Inky" | "Clyde";
