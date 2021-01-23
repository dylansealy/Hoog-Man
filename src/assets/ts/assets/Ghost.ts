import {GameVariables, GhostInterface, GhostMode, Movement} from "../Types";
import Character from "./Character.js";
import p5 from "p5";

export default class Ghost extends Character implements GhostInterface {
    chaseCounter: number;
    chaseRound: number;
    chaseSequence: Array<number>;
    scatterCounter: number;
    scatterRound: number;
    scatterSequence: Array<number>;
    previousMode: GhostMode;
    mode: GhostMode;
    constructor(p: p5, v: GameVariables) {
        super(p, v);
        this.chaseCounter = this.chaseRound = 0;
        this.chaseSequence = [18, 19, 20];
        this.scatterCounter = this.scatterRound = 0;
        this.scatterSequence = [6, 5, 4, 3];
        this.previousMode = this.mode = null;
    } // Updates variabelen na elke iteratie van de p5 draw functie.
    iterationVariables: () => void = () => {
        const freeGhost = (delay: number) => {
            setTimeout(() => { // Zorgt ervoor dat een ghost uit het huis gaat na een bepaalde tijd.
                this.xPosition = this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * 13.5;
                this.mode = this.v.blinky.mode == "frightened" ? "frightened" : "scatter";
            }, delay);
        };
        if (this.v.hoogMan.lives == 3) {
            if (this.mode == null && this.movement == null && this.previousMovement == null) {
                // Checkt of een ghost het huis mag verlaten.
                if (this.pelletCounter <= 0) {freeGhost(500);}
                else if (this.name == "Inky" || this.name == "Clyde") {
                    // Zorgt ervoor dat de pelletCounter omlaag gaat.
                    if (this.name == "Inky") {this.pelletCounter = this.pelletThreshold - (138 - this.v.pellets.length);}
                    else if (this.name == "Clyde" && this.v.inky.pelletCounter <= 0) {
                        this.pelletCounter = this.pelletThreshold + this.v.inky.pelletThreshold - (138 - this.v.pellets.length);
                    }
                }
            }
        }
        else if (this.v.pelletCounter == 5 && this.name == "Pinky") {freeGhost(500);}
        else if (this.v.pelletCounter == 15 && this.name == "Inky") {freeGhost(500);}
        else if (this.v.pelletCounter == 25 && this.name == "Clyde") {freeGhost(500);}
        if (this.mode == "frightened") {
            this.v.frightenedTime = Math.round(this.v.pellets.length * 0.05) + 2;
            this.speed = 88 / 60 / 650 * this.v.gameBoard.innerHeight * 0.65;
            // Zorgt ervoor dat ghosts omdraaien nadat frightened mode is geactiveerd.
            if (this.name == "Blinky" && this.v.frightenedCounter == 0 || this.name != "Blinky" && this.v.frightenedCounter == 1) {
                switch (this.movement) {
                case "up": this.movement = "down"; break;
                case "right": this.movement = "left"; break;
                case "down": this.movement = "up"; break;
                case "left": this.movement = "right"; break;
                case null: break;
                }
            }
            if (Math.floor(this.v.frightenedCounter / this.v.gameBoard.frameRate) >= this.v.frightenedTime - 2) {this.v.frightenedEnding = true;}
            if (Math.floor(this.v.frightenedCounter / this.v.gameBoard.frameRate) == this.v.frightenedTime) { // Checkt of een ghost lang genoeg frightened is geweest.
                this.mode = this.previousMode != null ? this.previousMode : "scatter";
                setTimeout(() => {
                    if (this.v.blinky.mode != "frightened") {this.v.frightenedCounter = 0;}
                }, 1000);
                this.v.frightenedSound.pause();
                this.v.backgroundMusic.volume = 0.55;
                this.v.frightenedEnding = false;
            } // Zorgt ervoor dat de counter niet te vaak wordt geüpdatet.
            if (this.name == "Blinky") {this.v.frightenedCounter++;}
        } else {
            this.speed = 88 / 60 / 650 * this.v.gameBoard.innerHeight * 1.2;
            if (this.mode == "scatter") {
                if (Math.floor(this.scatterCounter / this.v.gameBoard.frameRate) == this.scatterSequence[this.scatterRound]) {
                    this.mode = "chase";
                    this.scatterCounter = 0;
                    this.scatterRound++;
                } this.scatterCounter++;
            } else if (this.mode == "chase") {
                if (Math.floor(this.chaseCounter / this.v.gameBoard.frameRate) == this.chaseSequence[this.chaseRound]) {
                    this.mode = "scatter";
                    this.chaseCounter = 0;
                    this.chaseRound++;
                } this.chaseCounter++;
            }
        }
    } // Zorgt ervoor dat de ghost altijd een nieuwe bewegingsrichting heeft die mogelijk is.
    movementSequence: (movementOrder: Array<number>) => void = movementOrder => {
        if (!this.setNextMovement(movementOrder, 0) && this.movement == null) { // Movement check zorgt ervoor dat ghosts altijd kan bewegen.
            if (!this.setNextMovement(movementOrder, 1)) {
                if (!this.setNextMovement(movementOrder, 2)) {
                    this.setNextMovement(movementOrder, 3);
                }
            }
        }
    } // Bepaalt de afstand tussen een ghost en zijn doelwit.
    checkDistanceTarget: (target: "Hoog-Man" | "Target tile", xMargin: number, yMargin: number) => Array<number> = (target, xMargin, yMargin) => {
        let xTarget: number, yTarget: number;
        // Checkt wie of wat het doelwit is en past de coördinaten daarop aan.
        if (target == "Hoog-Man") {
            xTarget = this.v.hoogMan.xPosition + this.v.gameBoard.widthUnit * xMargin;
            yTarget = this.v.hoogMan.yPosition + this.v.gameBoard.heightUnit * yMargin;
            if (this.name == "Inky") { // Zorgt ervoor dat het doelwit afhankelijk is van Blinky zijn positie.
                if (this.v.blinky.xPosition < xTarget) {xMargin = xTarget - this.v.blinky.xPosition;}
                else if (this.v.blinky.xPosition > xTarget) {xMargin = (this.v.blinky.xPosition - xTarget) * -1;}
                else {xMargin = 0;}
                if (this.v.blinky.yPosition < yTarget) {yMargin = yTarget - this.v.blinky.yPosition;}
                else if (this.v.blinky.yPosition > yTarget) {yMargin = (this.v.blinky.yPosition - yTarget) * -1;}
                else {yMargin = 0;}
            } else {xMargin = yMargin = 0;}
        } else {
            xTarget = this.xTargetTile;
            yTarget = this.yTargetTile;
        } // Bepaalt de afstand tussen een ghost zijn doelwit
        const upDistance = this.p.dist(this.xPosition, this.yPosition - this.v.gameBoard.heightUnit * 0.5, xTarget + xMargin, yTarget + yMargin);
        const rightDistance = this.p.dist(this.xPosition + this.v.gameBoard.widthUnit * 0.5, this.yPosition, xTarget + xMargin, yTarget + yMargin);
        const downDistance = this.p.dist(this.xPosition, this.yPosition + this.v.gameBoard.heightUnit * 0.5, xTarget + xMargin, yTarget + yMargin);
        const leftDistance = this.p.dist(this.xPosition - this.v.gameBoard.widthUnit * 0.5, this.yPosition, xTarget + xMargin, yTarget + yMargin);
        const distance = [upDistance, rightDistance, downDistance, leftDistance]; // Standaard bewegingsrichtingvolgorde.
        const movementOrder = []; // Houdt bij wat de volgorde is van de voorkeursbewegingrichting.
        for (let i = 0; i < distance.length; i++) {
            const smallestDistance = Math.min(...distance); // Bepaalt wat de kleinste afstand is.
            const index = distance.indexOf(smallestDistance); // Bepaalt de index van deze afstand in de standaard bewegingsrichtingvolgorde.
            movementOrder.push(index);
            distance[index] *= 100; // Zorgt ervoor dat de kleinste afstand groter wordt.
        } return movementOrder;
    } // Zorgt ervoor dat de nieuwe bewegingsrichting wordt gedefinieerd.
    setNextMovement: (movementOrder: Array<number>, index: number) => boolean = (movementOrder, index) => {
        const checkPossibilityMovement = (targetMovement: Movement, forbiddenMovement: Movement) => { // Checkt of de nieuwe bewegingsrichting mogelijk is.
            /*
             * Checkt of er geen botsing plaatsvindt na de nieuwe bewegingsrichting.
             * Checkt of de nieuwe bewegingsrichting niet tegenovergesteld is aan de huidige.
             * Checkt of de nieuwe bewegingsrichting niet gelijk is aan de huidige. Dit voorkomt dat previousMovement wordt overschreven.
             */
            if (!this.checkCollisionInput(targetMovement) && this.movement != forbiddenMovement && this.movement != targetMovement) {
                // Checkt of de nieuwe bewegingsrichting niet tegenovergesteld is aan de bewegingsrichting voor de huidige.
                if (this.previousMovement != forbiddenMovement || this.movement == forbiddenMovement && this.collision == false) {
                    this.nextMovement = targetMovement;
                    return true;
                } else if (this.previousMovement == forbiddenMovement && this.collision == true) {
                    // Zorgt ervoor dat de nieuwe bewegingsrichting wordt geüpdatet na minimaal 50 ms. Dit voorkomt dat een ghost niet terug kan gaan.
                    const delay = this.mode != "frightened" ? 50 : 80;
                    setTimeout(() => this.nextMovement = targetMovement, delay);
                    return true;
                }
            } return false;
        }; // Checkt voor elke voorkeursbewegingsrichting of dit mogelijk is.
        switch (movementOrder[index]) {
        case 0: return checkPossibilityMovement("up", "down");
        case 1: return checkPossibilityMovement("right", "left");
        case 2: return checkPossibilityMovement("down", "up");
        case 3: return checkPossibilityMovement("left", "right");
        default: return false;
        }
    } // Bepaalt de bewegingsrichting van een ghost wanneer deze in frightened mode zit.
    frightenedMovement: () => void = () => {
        const movementOrder = [0, 1, 2, 3].sort(() => Math.random() - 0.5); // Bepaalt random een voorkeursrichting sequence.
        // Selecteert random een index.
        let randomIndex = Math.floor(Math.random() * 4);
        if (!this.setNextMovement(movementOrder, randomIndex) && this.movement == null) {
            movementOrder.splice(randomIndex, 1); // Verwijdert de bewegingsrichting ui de array.
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
    }
}
