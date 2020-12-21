// Import om fouten in de TSC te voorkomen. TS(1)
import p5 from "p5";
// Definieert aan welke vorm een class/object minimaal moet voldoen. TS(2)
export interface GameVariables {
    blinky: GhostInterface; // Koppelt een interface aan een property. TS(3)
    clyde: GhostInterface;
    hoogMan: HoogManInterface;
    inky: GhostInterface;
    pinky: GhostInterface;
    game: p5;
    gameBoard: GameBoardInterface;
    gesturePosition: Array<number>; // Type geeft aan dat het datatype een array is bestaande uit alleen maar cijfers.
    inputMethod: "keyboard" | "touch" | "gestures"; // Type geeft aan dat de property alleen gelijk mag zijn aan de gedifinieerde waarden. TS(4)
    obstacleCoordinates: Array<Array<number>>; // Type geeft aan dat het dataype een array is die weer bestaat uit een array van cijfers.
    obstacles: Array<ObstacleInterface>; // Type geeft aan dat het datatype een array is die bestaat uit childs van de class die gebruik maakt van de interface.
    pellets: Array<PelletInterface>;
    endGame: () => void; // Type geeft aan dat de functie niets returned. TS(5)
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
    draw: () => void;
    checkEaten: (index: number) => void; // Definieert de parameter en bijbehorende datatype van een functie.
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
    diameter: number;
    previousMovement: Movement; // Type geeft aan dat de property alleen gelijk mag zijn aan de waarden van de zelfgedefinieerde type. TS(4)
    movement: Movement;
    nextMovement: Movement;
    p: p5;
    speed: number;
    v: GameVariables;
    // Properties worden gedefinieerd in de HoogMan class of in een child van de Ghost class. TS(6)
    color: Color;
    name: Name;
    xPosition: number;
    yPosition: number;
    xStartPosition: number;
    yStartPosition: number;

    draw: () => void;
    checkCollision: () => void;
    checkNextMovement: () => void;
    resetMovement: (afterCollision: boolean) => void;
    checkCollisionInput: (targetDirection: Movement) => boolean;
    constrainPosition: () => void;
    resetCharacter: () => void;
} // Extends zorgt ervoor dat properties en methods worden overgenomen. TS(7)
export interface HoogManInterface extends CharacterInterface {lives: number;}
export interface GhostInterface extends CharacterInterface {
    chaseCounter: number;
    chaseRound: number;
    chaseSequence: Array<number>;
    frightenedCounter: number;
    frightenedTime: number;
    scatterCounter: number;
    scatterRound: number;
    scatterSequence: Array<number>;
    previousMode: GhostMode;
    mode: GhostMode; // Property wordt voor Blinky gedefinieerd in zijn eigen class. TS(6)
    // Properties en method worden gedefinieerd in de ghosts hun eigen class. TS(6)
    pelletCounter: number;
    pelletThreshold: number;
    xTargetTile: number;
    yTargetTile: number;
    setMovement: () => void;

    iterationVariables: () => void;
    movementSequence: (movementOrder: Array<number>) => void;
    checkDistanceTarget: (target: "Hoog-Man" | "Target tile", xMargin: number, yMargin: number) => Array<number>;
    setNextMovement: (movementOrder: Array<number>, index: number) => boolean;
    frightenedMovement: () => void;
} // Zelfgedefinieerde typen. TS(4)
export type Color = "yellow" | "red" | "pink" | "blue" | "orange";
export type GhostMode = "chase" | "scatter" | "frightened";
export type Movement = "up" | "right" | "down" | "left";
export type Name = "Hoog-Man" | "Blinky" | "Pinky" | "Inky" | "Clyde";
