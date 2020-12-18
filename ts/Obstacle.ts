import p5 from "p5";
import { GameVariables, ObstacleInterface } from "./Types";
export default class Obstacle implements ObstacleInterface {
    xPosition: number;
    yPosition: number;
    height: number;
    width: number;
    p: p5
    v: GameVariables;
    constructor(p: p5, v: GameVariables, xMin: number, yMin: number, xMax: number, yMax: number) {
        this.v = v;
        this.p = p;
        this.xPosition = this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * xMin;
        this.yPosition = this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * yMin;
        this.height = this.v.gameBoard.xInner + this.v.gameBoard.heightUnit * yMax - this.yPosition;
        this.width = this.v.gameBoard.yInner + this.v.gameBoard.widthUnit * xMax - this.xPosition;
    }
    draw(): void {
        this.p.push();
        this.p.strokeWeight(2);
        this.p.stroke("#2121DE");
        this.p.rect(this.xPosition, this.yPosition, this.width, this.height, 4);
        this.p.pop();
    }
}
