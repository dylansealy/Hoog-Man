import p5 from "p5";
import {GameBoardInterface, GameVariables} from "./Types";
export default class GameBoard implements GameBoardInterface {
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
    constructor(p: p5, v: GameVariables) {
        this.p = p;
        this.v = v;
        const height = document.querySelector("main").offsetHeight;
        const width = document.querySelector("main").offsetWidth;
        if (height > width) {
            this.canvasDimension = width - 1;
            this.orientation = "portrait";
        } else {
            this.canvasDimension = height - 1;
            this.orientation = "landscape";
        }
        this.xOuter = this.yOuter = this.canvasDimension / 60;
        this.xInner = this.yInner = this.xOuter * 2;
        this.innerHeight = this.canvasDimension - this.yInner * 4;
        this.innerWidth = this.canvasDimension - this.yInner * 2;
        this.outerHeight = this.canvasDimension - this.yOuter * 6;
        this.outerWidth = this.canvasDimension - this.xOuter * 2;
        this.heightUnit = this.innerHeight / 14;
        this.widthUnit = this.innerWidth / 17;
        this.score = 0;
    }
    draw: () => void = () => {
        this.p.push();
        this.p.stroke("#2121DE");
        this.p.strokeWeight(3);
        this.p.rect(this.xInner, this.yInner, this.innerWidth, this.innerHeight, 4);
        this.p.rect(this.xOuter, this.yOuter, this.outerWidth, this.outerHeight, 10);
        this.p.stroke("black");
        this.p.strokeWeight(4);
        this.p.rect(this.xInner + this.widthUnit, this.yInner + this.innerHeight, this.widthUnit, 0);
        this.p.rect(this.xInner + this.widthUnit, this.yInner, this.widthUnit, 0);
        this.p.rect(this.xInner + this.widthUnit, this.yOuter + this.outerHeight, this.widthUnit, 0);
        this.p.rect(this.xInner + this.widthUnit, this.yOuter, this.widthUnit, 0);
        this.p.fill("white");
        this.p.text(`Score: ${this.score}`, this.xInner, this.canvasDimension - (this.canvasDimension - this.outerHeight) / 2.5);
        // this.p.text(`Aantal levens: ${this.v.hoogMan.lives}`, this.xInner + this.widthUnit * 4, this.canvasDimension - (this.canvasDimension - this.outerHeight) / 2.5);
        this.p.pop();
    }
}
