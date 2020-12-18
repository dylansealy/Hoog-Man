import p5 from "p5";
export interface GameVariables {
    gameInput: "keyboard" | "touch" | "gestures";
    game: p5;
    gameBoard: GameBoardInterface;
    pellets: Array<PelletInterface>;
    obstacles: Array<ObstacleInterface>;
    hoogMan: HoogManInterface;
    obstacleCoordinates: Array<Array<number>>;
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
    draw: Function;
    checkEaten: Function;
    checkCollision: Function;
}
export interface ObstacleInterface {
    p: p5;
    xPosition: number;
    yPosition: number;
    height: number;
    width: number;
    v: GameVariables;
    draw: Function;
}
export interface CharacterInterface {
    collision: boolean;
    color: string;
    diameter: number;
    previousMovement: Movement;
    movement: Movement;
    xMovement: boolean;
    yMovement: boolean;
    nextMovement: Movement;
    speed: number;
    xPosition: number;
    yPosition: number;
    xMargin: number;
    yMargin: number;
}
export interface HoogManInterface extends CharacterInterface {
    lives: number;
}
type Movement = "up" | "right" | "down" | "left" | null;
