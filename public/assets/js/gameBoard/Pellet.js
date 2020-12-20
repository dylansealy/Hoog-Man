export default class Pellet {
    constructor(p, v, xPosition, yPosition) {
        this.draw = () => {
            this.p.push();
            this.p.fill("yellow");
            this.p.stroke(this.color);
            this.p.strokeWeight(4);
            this.p.circle(this.xPosition, this.yPosition, this.diameter);
            this.p.pop();
        };
        this.checkEaten = index => {
            if (this.v.hoogMan.xPosition - this.xMargin < this.xPosition &&
                this.v.hoogMan.xPosition + this.xMargin > this.xPosition &&
                this.v.hoogMan.yPosition - this.yMargin < this.yPosition &&
                this.v.hoogMan.yPosition + this.yMargin > this.yPosition) {
                this.v.gameBoard.score += 100;
                this.v.pellets.splice(index, 1);
            }
        };
        this.checkCollisionObstacle = () => {
            for (let obstacle in this.v.obstacles) {
                if (this.xPosition < this.v.obstacles[obstacle].xPosition + this.v.obstacles[obstacle].width &&
                    this.xPosition > this.v.obstacles[obstacle].xPosition &&
                    this.yPosition < this.v.obstacles[obstacle].yPosition + this.v.obstacles[obstacle].height &&
                    this.yPosition > this.v.obstacles[obstacle].yPosition) {
                    return true;
                }
            }
            return false;
        };
        this.p = p;
        this.v = v;
        this.color = "yellow";
        this.diameter = this.v.gameBoard.widthUnit * 0.15;
        this.xPosition = this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * (0.5 + xPosition);
        this.yPosition = this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * (0.5 + yPosition);
        this.xMargin = this.v.gameBoard.widthUnit * 0.2;
        this.yMargin = this.v.gameBoard.heightUnit * 0.2;
    }
}
