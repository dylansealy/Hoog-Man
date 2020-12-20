import { Character } from "../assets/Character.js";
export class HoogMan extends Character {
    constructor(p, v) {
        super(p, v);
        this.color = "yellow";
        this.lives = 3;
        this.name = "Hoog-Man";
        this.xPosition = this.xStartPosition = this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * 9.5;
        this.yPosition = this.yStartPosition = this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * 7.5;
    }
}
