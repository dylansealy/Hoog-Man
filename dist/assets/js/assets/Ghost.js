import Character from "./Character.js";
export default class Ghost extends Character {
    constructor(p, v) {
        super(p, v);
        this.iterationVariables = () => {
            if (this.mode == null) {
                if (this.pelletCounter <= 0) {
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
                    switch (this.name) {
                        case "Pinky":
                            if (this.v.blinky.movement != null) {
                                freeGhost(500);
                            }
                            break;
                        case "Inky":
                            if (this.v.pinky.movement != null) {
                                freeGhost(1000);
                            }
                            break;
                        case "Clyde":
                            if (this.v.inky.movement != null) {
                                freeGhost(1000);
                            }
                            break;
                    }
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
            if (this.mode == "frightened") {
                this.v.frightenedTime = Math.round(this.v.pellets.length * 0.05) + 1;
                this.speed = 88 / 60 / 650 * this.v.gameBoard.innerHeight * 0.65;
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
                }
                if (this.name == "Blinky") {
                    this.v.frightenedCounter++;
                }
            }
            else {
                this.speed = 88 / 60 / 650 * this.v.gameBoard.innerHeight;
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
            let xTarget = 0;
            let yTarget = 0;
            if (target == "Hoog-Man") {
                xTarget = this.v.hoogMan.xPosition + this.v.gameBoard.widthUnit * xMargin;
                yTarget = this.v.hoogMan.yPosition + this.v.gameBoard.heightUnit * yMargin;
            }
            else {
                xTarget = this.xTargetTile;
                yTarget = this.yTargetTile;
            }
            const upDistance = this.p.dist(this.xPosition, this.yPosition - this.v.gameBoard.heightUnit * 0.5, xTarget, yTarget);
            const rightDistance = this.p.dist(this.xPosition + this.v.gameBoard.widthUnit * 0.5, this.yPosition, xTarget, yTarget);
            const downDistance = this.p.dist(this.xPosition, this.yPosition + this.v.gameBoard.heightUnit * 0.5, xTarget, yTarget);
            const leftDistance = this.p.dist(this.xPosition - this.v.gameBoard.widthUnit * 0.5, this.yPosition, xTarget, yTarget);
            this.p.stroke("white");
            this.p.line(this.xPosition, this.yPosition - this.v.gameBoard.heightUnit * 0.5, xTarget, yTarget);
            this.p.line(this.xPosition + this.v.gameBoard.widthUnit * 0.5, this.yPosition, xTarget, yTarget);
            this.p.line(this.xPosition, this.yPosition + this.v.gameBoard.heightUnit * 0.5, xTarget, yTarget);
            this.p.line(this.xPosition - this.v.gameBoard.widthUnit * 0.5, this.yPosition, xTarget, yTarget);
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
                        setTimeout(() => this.nextMovement = targetMovement, 50);
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
        this.chaseCounter = 0;
        this.chaseRound = 0;
        this.chaseSequence = [20, 20, 20];
        this.scatterCounter = 0;
        this.scatterRound = 0;
        this.scatterSequence = [7, 7, 5, 5];
        this.previousMode = null;
        this.mode = null;
    }
}
