export default class Obstacle {
    constructor(p, v, xMin, yMin, xMax, yMax) {
        this.p = p;
        this.v = v;
        this.xPosition = this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * xMin;
        this.yPosition = this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * yMin;
        this.height = this.v.gameBoard.xInner + this.v.gameBoard.heightUnit * yMax - this.yPosition;
        this.width = this.v.gameBoard.yInner + this.v.gameBoard.widthUnit * xMax - this.xPosition;
    }
    draw() {
        this.p.push();
        this.p.stroke("#2121DE");
        this.p.strokeWeight(2);
        this.p.rect(this.xPosition, this.yPosition, this.width, this.height, 4);
        this.p.pop();
    }
}
