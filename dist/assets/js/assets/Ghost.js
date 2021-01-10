import Character from "./Character.js";
export default class Ghost extends Character {
    constructor(p, v) {
        super(p, v);
        this.iterationVariables = () => {
            const freeGhost = (delay) => {
                setTimeout(() => {
                    this.xPosition = this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * 13.5;
                    if (this.v.blinky.mode == "frightened") {
                        this.mode = "frightened";
                    }
                    else {
                        this.mode = "scatter";
                    }
                }, delay);
            };
            if (this.v.hoogMan.lives == 3) {
                if (this.mode == null && this.movement == null && this.previousMovement == null) {
                    if (this.pelletCounter <= 0) {
                        freeGhost(500);
                    }
                    else if (this.name == "Inky" || this.name == "Clyde") {
                        if (this.name == "Inky") {
                            this.pelletCounter = this.pelletThreshold - (138 - this.v.pellets.length);
                        }
                        else if (this.name == "Clyde" && this.v.inky.pelletCounter <= 0) {
                            this.pelletCounter = this.pelletThreshold + this.v.inky.pelletThreshold - (138 - this.v.pellets.length);
                        }
                    }
                }
            }
            else if (this.v.pelletCounter == 5 && this.name == "Pinky") {
                freeGhost(500);
            }
            else if (this.v.pelletCounter == 15 && this.name == "Inky") {
                freeGhost(500);
            }
            else if (this.v.pelletCounter == 25 && this.name == "Clyde") {
                freeGhost(500);
            }
            if (this.mode == "frightened") {
                this.v.frightenedTime = Math.round(this.v.pellets.length * 0.05) + 2;
                this.speed = 88 / 60 / 650 * this.v.gameBoard.innerHeight * 0.65;
                if (this.name == "Blinky" && this.v.frightenedCounter == 0 || this.name != "Blinky" && this.v.frightenedCounter == 1) {
                    switch (this.movement) {
                        case "up":
                            this.movement = "down";
                            break;
                        case "right":
                            this.movement = "left";
                            break;
                        case "down":
                            this.movement = "up";
                            break;
                        case "left":
                            this.movement = "right";
                            break;
                        case null: break;
                    }
                }
                if (Math.floor(this.v.frightenedCounter / this.v.gameBoard.frameRate) >= this.v.frightenedTime - 2) {
                    this.v.frightenedEnding = true;
                }
                if (Math.floor(this.v.frightenedCounter / this.v.gameBoard.frameRate) == this.v.frightenedTime) {
                    if (this.previousMode != null) {
                        this.mode = this.previousMode;
                    }
                    else {
                        this.mode = "scatter";
                    }
                    setTimeout(() => {
                        if (this.v.blinky.mode != "frightened") {
                            this.v.frightenedCounter = 0;
                        }
                    }, 1000);
                    this.v.frightenedSound.pause();
                    this.v.backgroundMusic.volume = 0.55;
                    this.v.frightenedEnding = false;
                }
                if (this.name == "Blinky") {
                    this.v.frightenedCounter++;
                }
            }
            else {
                this.speed = 88 / 60 / 650 * this.v.gameBoard.innerHeight * 1.2;
                if (this.mode == "scatter") {
                    if (Math.floor(this.scatterCounter / this.v.gameBoard.frameRate) == this.scatterSequence[this.scatterRound]) {
                        this.mode = "chase";
                        this.scatterCounter = 0;
                        this.scatterRound++;
                    }
                    this.scatterCounter++;
                }
                else if (this.mode == "chase") {
                    if (Math.floor(this.chaseCounter / this.v.gameBoard.frameRate) == this.chaseSequence[this.chaseRound]) {
                        this.mode = "scatter";
                        this.chaseCounter = 0;
                        this.chaseRound++;
                    }
                    this.chaseCounter++;
                }
            }
        };
        this.movementSequence = movementOrder => {
            if (!this.setNextMovement(movementOrder, 0) && this.movement == null) {
                if (!this.setNextMovement(movementOrder, 1)) {
                    if (!this.setNextMovement(movementOrder, 2)) {
                        this.setNextMovement(movementOrder, 3);
                    }
                }
            }
        };
        this.checkDistanceTarget = (target, xMargin, yMargin) => {
            let xTarget, yTarget;
            if (target == "Hoog-Man") {
                xTarget = this.v.hoogMan.xPosition + this.v.gameBoard.widthUnit * xMargin;
                yTarget = this.v.hoogMan.yPosition + this.v.gameBoard.heightUnit * yMargin;
                if (this.name == "Inky") {
                    if (this.v.blinky.xPosition < xTarget) {
                        xMargin = xTarget - this.v.blinky.xPosition;
                    }
                    else if (this.v.blinky.xPosition > xTarget) {
                        xMargin = (this.v.blinky.xPosition - xTarget) * -1;
                    }
                    else {
                        xMargin = 0;
                    }
                    if (this.v.blinky.yPosition < yTarget) {
                        yMargin = yTarget - this.v.blinky.yPosition;
                    }
                    else if (this.v.blinky.yPosition > yTarget) {
                        yMargin = (this.v.blinky.yPosition - yTarget) * -1;
                    }
                    else {
                        yMargin = 0;
                    }
                }
                else {
                    xMargin = yMargin = 0;
                }
            }
            else {
                xTarget = this.xTargetTile;
                yTarget = this.yTargetTile;
            }
            const upDistance = this.p.dist(this.xPosition, this.yPosition - this.v.gameBoard.heightUnit * 0.5, xTarget + xMargin, yTarget + yMargin);
            const rightDistance = this.p.dist(this.xPosition + this.v.gameBoard.widthUnit * 0.5, this.yPosition, xTarget + xMargin, yTarget + yMargin);
            const downDistance = this.p.dist(this.xPosition, this.yPosition + this.v.gameBoard.heightUnit * 0.5, xTarget + xMargin, yTarget + yMargin);
            const leftDistance = this.p.dist(this.xPosition - this.v.gameBoard.widthUnit * 0.5, this.yPosition, xTarget + xMargin, yTarget + yMargin);
            const distance = [upDistance, rightDistance, downDistance, leftDistance];
            const movementOrder = [];
            for (let i = 0; i < distance.length; i++) {
                const smallestDistance = Math.min(...distance);
                const index = distance.indexOf(smallestDistance);
                movementOrder.push(index);
                distance[index] *= 100;
            }
            return movementOrder;
        };
        this.setNextMovement = (movementOrder, index) => {
            const checkPossibilityMovement = (targetMovement, forbiddenMovement) => {
                if (!this.checkCollisionInput(targetMovement) && this.movement != forbiddenMovement && this.movement != targetMovement) {
                    if (this.previousMovement != forbiddenMovement || this.movement == forbiddenMovement && this.collision == false) {
                        this.nextMovement = targetMovement;
                        return true;
                    }
                    else if (this.previousMovement == forbiddenMovement && this.collision == true) {
                        let delay;
                        if (this.mode != "frightened") {
                            delay = 50;
                        }
                        else {
                            delay = 80;
                        }
                        setTimeout(() => this.nextMovement = targetMovement, delay);
                        return true;
                    }
                }
                return false;
            };
            switch (movementOrder[index]) {
                case 0: return checkPossibilityMovement("up", "down");
                case 1: return checkPossibilityMovement("right", "left");
                case 2: return checkPossibilityMovement("down", "up");
                case 3: return checkPossibilityMovement("left", "right");
                default: return false;
            }
        };
        this.frightenedMovement = () => {
            const movementOrder = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
            let randomIndex = Math.floor(Math.random() * 4);
            if (!this.setNextMovement(movementOrder, randomIndex) && this.movement == null) {
                movementOrder.splice(randomIndex, 1);
                randomIndex = Math.floor(Math.random() * 3);
                if (!this.setNextMovement(movementOrder, randomIndex)) {
                    movementOrder.splice(randomIndex, 1);
                    randomIndex = Math.floor(Math.random() * 2);
                    if (!this.setNextMovement(movementOrder, randomIndex)) {
                        movementOrder.splice(randomIndex, 1);
                        this.setNextMovement(movementOrder, 0);
                    }
                }
            }
        };
        this.chaseCounter = this.chaseRound = 0;
        this.chaseSequence = [18, 19, 20];
        this.scatterCounter = this.scatterRound = 0;
        this.scatterSequence = [6, 5, 4, 3];
        this.previousMode = this.mode = null;
    }
}
