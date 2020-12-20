import p5 from "p5";
export interface GameVariables {
    blinky: GhostInterface;
    clyde: GhostInterface;
    hoogMan: HoogManInterface;
    inky: GhostInterface;
    pinky: GhostInterface;
    game: p5;
    gameBoard: GameBoardInterface;
    gesturePosition: Array<number>;
    inputMethod: "keyboard" | "touch" | "gestures";
    obstacleCoordinates: Array<Array<number>>;
    obstacles: Array<ObstacleInterface>;
    pellets: Array<PelletInterface>;
    endGame: () => void;
}
export interface GameBoardInterface {
    canvasDimension: number;
    frameRate: number;
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
    color: Color;
    diameter: number;
    previousMovement: Movement;
    movement: Movement;
    nextMovement: Movement;
    name: Name;
    p: p5;
    speed: number;
    v: GameVariables;
    xPosition: number;
    yPosition: number;
    xStartPosition: number;
    yStartPosition: number;
    checkCollision: () => void;
    checkCollisionInput: (targetDirection: Movement) => boolean;
    checkNextMovement: () => void;
    constrainPosition: () => void;
    draw: () => void;
    resetMovement: (afterCollision: boolean) => void;
    resetCharacter: () => void;
}
export interface HoogManInterface extends CharacterInterface {
    lives: number;
}
export interface GhostInterface extends CharacterInterface {
    chaseCounter: number;
    chaseRound: number;
    chaseSequence: Array<number>;
    frightenedCounter: number;
    frightenedRound: number;
    frightenedTime: number;
    scatterCounter: number;
    scatterRound: number;
    scatterSequence: Array<number>;
    previousMode: GhostMode;
    mode: GhostMode;
    pelletCounter: number;
    pelletThreshold: number;
    xTargetTile: number;
    yTargetTile: number;
    checkDistanceTarget: (target: "Hoog-Man" | "Target tile", xMargin: number, yMargin: number) => Array<number>;
    frightenedMovement: () => void;
    iterationVariables: () => void;
    movementSequence: (movementOrder: Array<number>) => void;
    setMovement: () => void;
    setNextMovement: (movementOrder: Array<number>, index: number) => boolean;
}
export type Color = "yellow" | "red" | "pink" | "blue" | "orange";
export type GhostMode = "chase" | "scatter" | "frightened";
export type Movement = "up" | "right" | "down" | "left";
export type Name = "Hoog-Man" | "Blinky" | "Pinky" | "Inky" | "Clyde";
