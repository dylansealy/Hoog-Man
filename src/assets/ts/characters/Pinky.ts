import {Color, GameVariables, GhostInterface, Name} from "../Types";
import p5, {Image} from "p5";
import Ghost from "../assets/Ghost.js";

export default class Pinky extends Ghost implements GhostInterface {
    color: Color;
    image: Image;
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
        this.color = "pink";
        this.image = this.p.loadImage("assets/images/pinky.png");
        this.name = "Pinky";
        this.pelletCounter = this.pelletThreshold = 0;
        this.xPosition = this.xStartPosition = this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * 14.5;
        this.yPosition = this.yStartPosition = this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * 0.5;
        this.xTargetTile = this.v.gameBoard.xOuter;
        this.yTargetTile = this.v.gameBoard.yOuter;
    }
    setMovement: () => void = () => {
        if (this.mode == "chase") {
            switch (this.v.hoogMan.movement) {
            case "up": this.movementSequence(this.checkDistanceTarget("Hoog-Man", -4, -4)); break;
            case "right": this.movementSequence(this.checkDistanceTarget("Hoog-Man", 4, 0)); break;
            case "down": this.movementSequence(this.checkDistanceTarget("Hoog-Man", 0, 4)); break;
            case "left": this.movementSequence(this.checkDistanceTarget("Hoog-Man", -4, 0)); break;
            default:
                switch (this.v.hoogMan.previousMovement) {
                case "up": this.movementSequence(this.checkDistanceTarget("Hoog-Man", -4, -4)); break;
                case "right": this.movementSequence(this.checkDistanceTarget("Hoog-Man", 4, 0)); break;
                case "down": this.movementSequence(this.checkDistanceTarget("Hoog-Man", 0, 4)); break;
                case "left": this.movementSequence(this.checkDistanceTarget("Hoog-Man", -4, 0)); break;
                default: this.movementSequence(this.checkDistanceTarget("Hoog-Man", 0, 0)); break;
                } break;
            }
        }
        else if (this.mode == "scatter") {this.movementSequence(this.checkDistanceTarget("Target tile", 0, 0));}
        else {this.frightenedMovement();}
    }
}
