export default class Pellet {
    constructor(p, v, xPosition, yPosition) {
        this.v = v;
        this.p = p;
        this.color = "yellow";
        this.diameter = this.v.gameBoard.widthUnit * 0.15;
        this.xMargin = this.v.gameBoard.widthUnit * 0.2;
        this.yMargin = this.v.gameBoard.heightUnit * 0.2;
        this.xPosition = this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * (0.5 + xPosition);
        this.yPosition = this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * (0.5 + yPosition);
    }
    draw() {
        this.p.push();
        this.p.strokeWeight(4);
        this.p.stroke(this.color);
        this.p.fill("yellow");
        this.p.circle(this.xPosition, this.yPosition, this.diameter);
        this.p.pop();
    }
    checkEaten(counter) {
        if (this.v.hoogMan.xPosition - this.xMargin < this.xPosition &&
            this.v.hoogMan.xPosition + this.xMargin > this.xPosition &&
            this.v.hoogMan.yPosition - this.yMargin < this.yPosition &&
            this.v.hoogMan.yPosition + this.yMargin > this.yPosition) {
            this.v.gameBoard.score += 100;
            this.v.pellets.splice(counter, 1);
        }
    }
    checkCollision() {
        for (let obstacle in this.v.obstacles) {
            if (this.xPosition > this.v.obstacles[obstacle][0] &&
                this.xPosition)
                this.yPosition;
            this.yPosition;
            {
                return true;
            }
        }
        // this.v.xInner + this.v.widthUnit * (0.5 + xPellet) > this.v.obstacles[ob][0] &&
        // this.v.xInner + this.v.widthUnit * (0.5 + xPellet) < this.v.obstacles[ob][2] &&
        // this.v.yInner + this.v.heightUnit * (0.5 + yPellet) > this.v.obstacles[ob][1] &&
        // this.v.yInner + this.v.heightUnit * (0.5 + yPellet) < this.v.obstacles[ob][3]
    }
}
