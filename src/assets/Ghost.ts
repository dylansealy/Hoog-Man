import {GameVariables, GhostInterface, GhostMode, Movement} from "../Types";
import Character from "./Character.js";
import p5 from "p5";

export default class Ghost extends Character implements GhostInterface {
    chaseCounter: number;
    chaseRound: number;
    chaseSequence: Array<number>;
    frightenedCounter: number;
    frightenedTime: number;
    scatterCounter: number;
    scatterRound: number;
    scatterSequence: Array<number>;
    previousMode: GhostMode;
    mode: GhostMode;
    constructor(p: p5, v: GameVariables) {
        super(p, v);
        this.chaseCounter = 0;
        this.chaseRound = 0;
        this.chaseSequence = [20, 20, 20];
        this.frightenedCounter = 0;
        this.frightenedTime = 0;
        this.scatterCounter = 0;
        this.scatterRound = 0;
        this.scatterSequence = [7, 7, 5, 5];
        this.previousMode = null;
        this.mode = null;
    } // Updates variabelen na elke iteratie van de p5 draw functie.
    iterationVariables: () => void = () => {
        if (this.mode == null) {
            if (this.pelletCounter == 0) { // Checkt of een ghost het huis mag verlaten.
                setTimeout(() => { // Zorgt ervoor dat een ghost uit het huis gaat na minimaal 400 ms.
                    this.mode = "scatter";
                    this.xPosition = this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * 13.5;
                }, 400);
            } else if (this.name == "Inky" || this.name == "Clyde") {
                // Zorgt ervoor dat de plletCounter omlaag gaat.
                if (this.name == "Inky") {this.pelletCounter = this.pelletThreshold - (138 - this.v.pellets.length);}
                else if (this.name == "Clyde" && this.v.inky.pelletCounter == 0) {
                    this.pelletCounter = this.pelletThreshold + this.v.inky.pelletThreshold - (138 - this.v.pellets.length);
                }
            }
        }
        else if (this.mode == "frightened") {
            this.frightenedTime = Math.round(this.v.pellets.length * 0.05) + 1;
            this.speed = 88 / 60 / 650 * this.v.gameBoard.innerHeight * 0.8;
            if (Math.floor(this.frightenedCounter / this.v.gameBoard.frameRate) == this.frightenedTime) { // Checkt of een ghost lang genoeg frightened is geweest.
                this.mode = this.previousMode;
                this.frightenedCounter = 0;
            } this.frightenedCounter++;
        } else {
            this.speed = 88 / 60 / 650 * this.v.gameBoard.innerHeight;
            if (this.mode == "scatter") {
                if (Math.floor(this.scatterCounter / this.v.gameBoard.frameRate) == this.scatterSequence[this.scatterRound]) {
                    this.mode = "chase";
                    this.scatterCounter = 0;
                    this.scatterRound++;
                } this.scatterCounter++;
            } else {
                if (Math.floor(this.chaseCounter / this.v.gameBoard.frameRate) == this.chaseSequence[this.chaseRound]) {
                    this.mode = "scatter";
                    this.chaseCounter = 0;
                    this.chaseRound++;
                } this.chaseCounter++;
            }
        }
    } // Zorgt ervoor dat de ghost altijd een nieuwe bewegingsrichting heeft die mogelijk is.
    movementSequence: (movementOrder: Array<number>) => void = movementOrder => {
        if (!this.setNextMovement(movementOrder, 0) && this.movement == null) { // Movement check zorgt ervoor dat ghosts atlijd kan bewegen.
            if (!this.setNextMovement(movementOrder, 1)) {
                if (!this.setNextMovement(movementOrder, 2)) {
                    this.setNextMovement(movementOrder, 3);
                }
            }
        }
    } // Bepaalt de afstand tussen een ghost en zijn doelwit.
    checkDistanceTarget: (target: "Hoog-Man" | "Target tile", xMargin: number, yMargin: number) => Array<number> = (target, xMargin, yMargin) => {
        let xTarget = 0;
        let yTarget = 0;
        // Checkt wie of wat het doelwit is en past de coördinaten daarop aan.
        if (target == "Hoog-Man") {
            xTarget = this.v.hoogMan.xPosition + this.v.gameBoard.widthUnit * xMargin;
            yTarget = this.v.hoogMan.yPosition + this.v.gameBoard.heightUnit * yMargin;
        } else {
            xTarget = this.xTargetTile;
            yTarget = this.yTargetTile;
        } // Bepaalt de afstand tussen een ghost zijn doelwit
        const upDistance = this.p.dist(this.xPosition, this.yPosition - this.v.gameBoard.heightUnit * 0.5, xTarget, yTarget);
        const rightDistance = this.p.dist( this.xPosition + this.v.gameBoard.widthUnit * 0.5, this.yPosition, xTarget, yTarget);
        const downDistance = this.p.dist(this.xPosition, this.yPosition + this.v.gameBoard.heightUnit * 0.5, xTarget, yTarget);
        const leftDistance = this.p.dist(this.xPosition - this.v.gameBoard.widthUnit * 0.5, this.yPosition, xTarget, yTarget);
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
            // * Checkt of er geen botsing plaatsvindt na de nieuwe bewegingsrichting.
            // * Checkt of de nieuwe bewegingsrichting niet tegenovergesteld is aan de huidige.
            // * Checkt of de nieuwe bewegingsrichting niet gelijk is aan de huidige. Dit voorkomt dat previousMovement wordt overschreven.
            if (!this.checkCollisionInput(targetMovement) && this.movement != forbiddenMovement && this.movement != targetMovement) {
                // Checkt of de nieuwe bewegingsrichting niet tegenovergesteld is aan de bewegingsrichting voor de huidige.
                if (this.previousMovement != forbiddenMovement || this.movement == forbiddenMovement && this.collision == false) {
                    this.nextMovement = targetMovement;
                    return true;
                } else if (this.previousMovement == forbiddenMovement && this.collision == true) {
                    // Zorgt ervoor dat de nieuwe bewegingsrichting wordt geupdatet na minimaal 50 ms. Dit voorkomt dat een ghost niet terug kan gaan.
                    setTimeout(() => this.nextMovement = targetMovement, 50);
                    return true;
                }
            } return false;
        }; // Checkt voor elke voorkeursbewegingsrichting of dit mogelijk is.
        switch(movementOrder[index]) {
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
