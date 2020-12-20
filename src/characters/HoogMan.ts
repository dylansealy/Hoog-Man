import p5 from "p5";
import {Character} from "../assets/Character.js";
import {GameVariables, HoogManInterface} from "../Types";

export class HoogMan extends Character implements HoogManInterface {
    lives: number;
    constructor(p: p5, v: GameVariables) {
        super(p, v);
        this.color = "yellow";
        this.lives = 3;
        this.name = "Hoog-Man";
        this.xPosition = this.xStartPosition = this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * 9.5;
        this.yPosition = this.yStartPosition = this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * 7.5;
    }
}
