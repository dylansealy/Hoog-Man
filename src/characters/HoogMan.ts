import p5 from "p5";
import {Character} from "../assets/Character.js";
import {GameVariables, HoogManInterface} from "../Types";

export class HoogMan extends Character implements HoogManInterface {
    lives: number;
    constructor(p: p5, v: GameVariables) {
        super(p, v);
        this.color = "yellow";
        this.name = "Hoog-Man";
        this.xPosition = this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * 9.5;
        this.yPosition = this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * 7.5;
    }
}
