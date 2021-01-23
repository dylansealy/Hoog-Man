export default class Pellet {
    constructor(p, v, xPosition, yPosition, powerPellet) {
        this.checkCollisionObstacle = () => {
            for (const obstacle in this.v.obstacles) {
                if (this.xPosition < this.v.obstacles[obstacle].xPosition + this.v.obstacles[obstacle].width &&
                    this.xPosition > this.v.obstacles[obstacle].xPosition &&
                    this.yPosition < this.v.obstacles[obstacle].yPosition + this.v.obstacles[obstacle].height &&
                    this.yPosition > this.v.obstacles[obstacle].yPosition) {
                    return true;
                }
            }
            return false;
        };
        this.draw = () => {
            this.p.push();
            this.p.fill(this.color);
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
                this.v.pelletSound.pause();
                this.v.pelletSound.currentTime = 0;
                this.v.pelletSound.play();
                this.v.gameBoard.score += 100;
                this.v.pellets.splice(index, 1);
                if (this.v.hoogMan.lives < 3) {
                    this.v.pelletCounter++;
                }
                if (this.v.pellets.length == 0) {
                    this.v.endGame(this.p, false);
                }
                else if (this.powerPellet) {
                    this.v.frightenedSound.pause();
                    this.v.frightenedSound.currentTime = 0;
                    this.v.backgroundMusic.volume = 0.35;
                    this.v.frightenedSound.play();
                    this.v.blinky.previousMode = this.v.blinky.mode;
                    this.v.inky.previousMode = this.v.inky.mode;
                    this.v.pinky.previousMode = this.v.pinky.mode;
                    this.v.clyde.previousMode = this.v.clyde.mode;
                    this.v.frightenedCounter = 0;
                    if (this.v.inky.mode != null) {
                        this.v.inky.mode = "frightened";
                    }
                    if (this.v.clyde.mode != null) {
                        this.v.clyde.mode = "frightened";
                    }
                    this.v.blinky.mode = this.v.pinky.mode = "frightened";
                }
            }
        };
        this.powerPellet = powerPellet;
        this.v = v;
        this.color = this.powerPellet ? "#1eadd9" : "yellow";
        this.diameter = this.powerPellet ? this.v.gameBoard.widthUnit * 0.35 : this.v.gameBoard.widthUnit * 0.15;
        this.p = p;
        this.xMargin = this.v.gameBoard.widthUnit * 0.2;
        this.yMargin = this.v.gameBoard.heightUnit * 0.2;
        this.xPosition = this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * (0.5 + xPosition);
        this.yPosition = this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * (0.5 + yPosition);
    }
}
