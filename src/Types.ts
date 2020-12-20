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
    draw: () => void;
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
    checkCollisionObstacle: () => boolean;
    checkEaten: (index: number) => void;
    draw: () => void;
}
export interface ObstacleInterface {
    height: number;
    width: number;
    p: p5;
    v: GameVariables;
    xPosition: number;
    yPosition: number;
    draw: () => void;
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
    checkCollision: () => void;
    checkCollisionInput: () => boolean;
    checkNextMovement: () => void;
    constrainPosition: () => void;
    draw: () => void;
    resetMovement: (afterCollision: boolean) => void;
}
export interface HoogManInterface extends CharacterInterface {
    lives: number;
}
export type Movement = "up" | "right" | "down" | "left";
export type Name = "Hoog-Man" | "Blinky" | "Pinky" | "Inky" | "Clyde";
