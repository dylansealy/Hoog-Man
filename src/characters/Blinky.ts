import {Color, GameVariables, GhostInterface, GhostMode, Name} from "../Types";
import Ghost from "../assets/Ghost.js";
import p5 from "p5";

export default class Blinky extends Ghost implements GhostInterface {
    color: Color;
    mode: GhostMode;
    name: Name;
    pelletCounter: number;
    pelletThreshold: number;
    xPosition: number;
    yPosition: number;
    xStartPosition: number;
    yStartPosition: number;
    xTargetTile: number;
    yTargetTile: number;
    constructor(p: p5, v: GameVariables) {
        super(p, v);
        this.color = "red";
        this.mode = "scatter";
        this.movement = "left";
        this.name = "Blinky";
        this.pelletCounter = 0;
        this.pelletThreshold = 0;
        this.xPosition = this.xStartPosition = this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * 13.5;
        this.yPosition = this.yStartPosition = this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * 0.5;
        this.xTargetTile = this.v.gameBoard.xOuter;
        this.yTargetTile = this.v.gameBoard.yOuter + v.gameBoard.outerHeight;
    }
    setMovement: () => void = () => {
        if (this.mode == "chase") {this.movementSequence(this.checkDistanceTarget("Hoog-Man", 0, 0));}
        else if (this.mode == "scatter") {this.movementSequence(this.checkDistanceTarget("Target tile", 0, 0));}
        else if (this.mode == "frightened") {this.frightenedMovement();}
    }
}
