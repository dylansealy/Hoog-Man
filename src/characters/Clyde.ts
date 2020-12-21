import {Color, GameVariables, GhostInterface, Name} from "../Types";
import Ghost from "../assets/Ghost.js";
import p5 from "p5";

export default class Clyde extends Ghost implements GhostInterface {
    color: Color;
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
        this.color = "orange";
        this.name = "Clyde";
        this.pelletCounter = this.pelletThreshold = 50;
        this.xPosition = this.xStartPosition = this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * 16.5;
        this.yPosition = this.yStartPosition = this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * 0.5;
        this.xTargetTile = this.v.gameBoard.xOuter + this.v.gameBoard.outerWidth;
        this.yTargetTile = this.v.gameBoard.yOuter;
    }
    setMovement: () => void = () => {
        if (this.mode == "chase") {
            if (
                this.xPosition > this.v.hoogMan.xPosition + this.v.gameBoard.widthUnit * 8 ||
                this.xPosition < this.v.hoogMan.xPosition - this.v.gameBoard.widthUnit * 8 ||
                this.yPosition > this.v.hoogMan.yPosition + this.v.gameBoard.heightUnit * 8 ||
                this.yPosition < this.v.hoogMan.yPosition - this.v.gameBoard.heightUnit * 8
            ) {this.movementSequence(this.checkDistanceTarget("Hoog-Man", 0, 0));}
            else {this.movementSequence(this.checkDistanceTarget("Target tile", 0, 0));}
        }
        else if (this.mode == "scatter") {this.movementSequence(this.checkDistanceTarget("Target tile", 0, 0));}
        else if (this.mode == "frightened") {this.frightenedMovement();}
    }
}
