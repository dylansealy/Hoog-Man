import {CharacterInterface, Color, GameVariables, Movement, Name} from "../Types";
import p5 from "p5";

export default class Character implements CharacterInterface {
    collision: boolean;
    diameter: number;
    previousMovement: Movement;
    movement: Movement;
    nextMovement: Movement;
    p: p5;
    speed: number;
    v: GameVariables;
    // Properties om fouten in de TSC te voorkomen. TS(1), TS(6)
    color: Color;
    name: Name;
    xPosition: number;
    yPosition: number;
    xStartPosition: number;
    yStartPosition: number;
    // Zorgt ervoor dat het object wordt gedefinieerd met enkele properties.
    constructor(p: p5, v: GameVariables) {
        this.v = v;
        this.collision = false;
        this.diameter = this.v.gameBoard.heightUnit / 2;
        this.previousMovement = null;
        this.movement = null;
        this.nextMovement = null;
        this.p = p;
        this.speed = 88 / 60 / 650 * this.v.gameBoard.innerHeight;
    } // Tekent een character en zorgt ervoor dat de x, y positie wordt geupdatet.
    draw: () => void = () => {
        this.p.push();
        this.p.fill(this.color);
        this.p.noStroke();
        this.p.ellipse(this.xPosition, this.yPosition, this.diameter);
        this.p.pop();
        switch (this.movement) {
        case "up": this.yPosition -= this.speed; break;
        case "right": this.xPosition += this.speed; break;
        case "down": this.yPosition += this.speed; break;
        case "left": this.xPosition -= this.speed; break;
        }
    } // Checkt of een character in aanraking komt met iets.
    checkCollision: () => void = () => {
        this.collision = false;
        if (this.name != "Hoog-Man") { // Checkt of een ghost in aanraking komt met Hoog-Man.
            if ( // / 2, of / 3 als marge.
                this.xPosition + this.diameter / 3 >= this.v.hoogMan.xPosition - this.v.hoogMan.diameter / 2 &&
                this.xPosition - this.diameter / 3 <= this.v.hoogMan.xPosition + this.v.hoogMan.diameter / 2 &&
                this.yPosition + this.diameter / 3 >= this.v.hoogMan.yPosition - this.v.hoogMan.diameter / 2 &&
                this.yPosition - this.diameter / 3 <= this.v.hoogMan.yPosition + this.v.hoogMan.diameter / 2
            ) {return this.v.endGame(this.p);}
        }
        for (const obstacle in this.v.obstacles) {
            if ( // Checkt of een character botst met een barrière. 1 als marge, want anders is deze statement altijd waar.
                this.xPosition - this.v.gameBoard.widthUnit * 0.5 + 1 < this.v.obstacles[obstacle].xPosition + this.v.obstacles[obstacle].width &&
                this.xPosition + this.v.gameBoard.widthUnit * 0.5 - 1 > this.v.obstacles[obstacle].xPosition &&
                this.yPosition - this.v.gameBoard.heightUnit * 0.5 + 1 < this.v.obstacles[obstacle].yPosition + this.v.obstacles[obstacle].height &&
                this.yPosition + this.v.gameBoard.heightUnit * 0.5 - 1 > this.v.obstacles[obstacle].yPosition
            ) {return this.resetMovement(true);}
            else if ( // Checkt of een character botst met een buitenlijn.
                this.xPosition - this.v.gameBoard.widthUnit * 0.5 + 1 < this.v.gameBoard.xInner ||
                this.xPosition + this.v.gameBoard.widthUnit * 0.5 - 1 > this.v.gameBoard.xInner + this.v.gameBoard.innerWidth ||
                this.yPosition - this.v.gameBoard.heightUnit * 0.5 + 1 < this.v.gameBoard.yInner ||
                this.yPosition + this.v.gameBoard.heightUnit * 0.5 -1 > this.v.gameBoard.yInner + this.v.gameBoard.innerHeight
            ) {return this.resetMovement(true);}
        } return undefined;
    } // Zorgt ervoor dat de huidige bewegingsrichting wordt geupdatet met de nieuwe.
    checkNextMovement: () => void = () => {
        // Checkt of er geen botsing plaatsvindt, this.nextMovement niet onnodig wordt overschreven en of this.nextMovement gedefinieerd is.
        if (!this.checkCollisionInput(this.nextMovement) && this.nextMovement != this.movement && this.nextMovement != null) {
            if (this.movement != null) {this.previousMovement = this.movement;}
            const newMovement = this.nextMovement;
            this.resetMovement(false);
            this.movement = newMovement;
            this.constrainPosition();
        }
    } // Resets de bewegingsrichting.
    resetMovement: (afterCollision: boolean) => void = afterCollision => {
        if (this.movement != null) {this.previousMovement = this.movement;}
        this.collision = true;
        this.movement = null;
        this.nextMovement = null;
        if (afterCollision) {this.constrainPosition();}
    } // Checkt of er niet een botsing plaatsvindt na de nieuwe bewegingsrichting.
    checkCollisionInput: (targetMovement: Movement) => boolean = targetMovement => {
        for (const obstacle in this.v.obstacles) {
            switch (targetMovement) {
            case "up":
                if ( // Checkt of Hoog-Man door een gat in de buitenlijn gaaat.
                    this.xPosition < this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * 2 &&
                    this.xPosition > this.v.gameBoard.xInner + this.v.gameBoard.widthUnit &&
                    this.yPosition < this.v.gameBoard.yInner + this.v.gameBoard.heightUnit &&
                    this.yPosition > this.v.gameBoard.yInner &&
                    this.name == "Hoog-Man"
                ) {
                    this.yPosition = this.v.gameBoard.yInner + this.v.gameBoard.innerHeight;
                    return false;
                } else if ( // Checkt of er geen botsing plaatsvindt met een buitenlijn.
                    this.yPosition > this.v.gameBoard.yInner &&
                    this.yPosition < this.v.gameBoard.yInner + this.v.gameBoard.heightUnit
                ) {return true;}
                else if ( // Checkt of er geen botsing plaatsvindt met een barrière. 0.05 als marge zodat deze statement minder snel waar is.
                    this.xPosition - this.v.gameBoard.widthUnit * 0.45 <= this.v.obstacles[obstacle].xPosition + this.v.obstacles[obstacle].width &&
                    this.xPosition + this.v.gameBoard.widthUnit * 0.45 >= this.v.obstacles[obstacle].xPosition &&
                    this.yPosition - this.v.gameBoard.heightUnit * 0.55 <= this.v.obstacles[obstacle].yPosition + this.v.obstacles[obstacle].height &&
                    this.yPosition + this.v.gameBoard.heightUnit * 0.45 >= this.v.obstacles[obstacle].yPosition
                ) {return true;}
                break;
            case "right":
                if (
                    this.xPosition > this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * 16 &&
                    this.xPosition < this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * 17
                ) {return true;}
                else if (
                    this.xPosition - this.v.gameBoard.widthUnit * 0.45 <= this.v.obstacles[obstacle].xPosition + this.v.obstacles[obstacle].width &&
                    this.xPosition + this.v.gameBoard.widthUnit * 0.55 >= this.v.obstacles[obstacle].xPosition &&
                    this.yPosition - this.v.gameBoard.heightUnit * 0.45 <= this.v.obstacles[obstacle].yPosition + this.v.obstacles[obstacle].height &&
                    this.yPosition + this.v.gameBoard.heightUnit * 0.45 >= this.v.obstacles[obstacle].yPosition
                ) {return true;}
                break;
            case "down":
                if (
                    this.xPosition < this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * 2 &&
                    this.xPosition > this.v.gameBoard.xInner + this.v.gameBoard.widthUnit &&
                    this.yPosition < this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * 14 &&
                    this.yPosition > this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * 13 &&
                    this.name == "Hoog-Man"
                ) {
                    this.yPosition = this.v.gameBoard.yInner;
                    return false;
                } else if (
                    this.yPosition > this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * 13 &&
                    this.yPosition < this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * 14
                ) {return true;}
                else if (
                    this.xPosition - this.v.gameBoard.widthUnit * 0.45 <= this.v.obstacles[obstacle].xPosition + this.v.obstacles[obstacle].width &&
                    this.xPosition + this.v.gameBoard.widthUnit * 0.45 >= this.v.obstacles[obstacle].xPosition &&
                    this.yPosition - this.v.gameBoard.heightUnit * 0.45 <= this.v.obstacles[obstacle].yPosition + this.v.obstacles[obstacle].height &&
                    this.yPosition + this.v.gameBoard.heightUnit * 0.55 >= this.v.obstacles[obstacle].yPosition
                ) {return true;}
                break;
            case "left":
                if (
                    this.xPosition > this.v.gameBoard.xInner &&
                    this.xPosition < this.v.gameBoard.xInner + this.v.gameBoard.widthUnit
                ) {return true;}
                else if (
                    this.xPosition - this.v.gameBoard.widthUnit * 0.55 <= this.v.obstacles[obstacle].xPosition + this.v.obstacles[obstacle].width &&
                    this.xPosition + this.v.gameBoard.widthUnit * 0.45 >= this.v.obstacles[obstacle].xPosition &&
                    this.yPosition - this.v.gameBoard.heightUnit * 0.45 <= this.v.obstacles[obstacle].yPosition + this.v.obstacles[obstacle].height &&
                    this.yPosition + this.v.gameBoard.heightUnit * 0.45 >= this.v.obstacles[obstacle].yPosition
                ) {return true;}
                break;
            }
        } return false;
    } // Herpositioneert een character zodat de x en of y coördinaat altijd voorspelbaar is.
    constrainPosition: () => void = () => {
        const xConstrain = (): void => {
            for (let i = 0; i < 17; i++) {
                if ( // Checkt in welke kolom een character is.
                    this.xPosition > this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * i &&
                    this.xPosition < this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * (i + 1)
                ) {
                    this.xPosition = this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * (i + 0.5);
                    break;
                }
            }
        };
        const yConstrain = (): void => {
            for (let i = 0; i < 14; i++) {
                if (
                    this.yPosition > this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * i &&
                    this.yPosition < this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * (i + 1)
                ) {
                    this.yPosition = this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * (i + 0.5);
                    break;
                }
            }
        };
        if (this.movement == "left" || this.movement == "right") {yConstrain();}
        else if (this.movement == "up" || this.movement == "down") {xConstrain();}
        else {
            xConstrain();
            yConstrain();
        }
    } // Resets enkele waarden van een character nadat Hoog-Man een leven verliest.
    resetCharacter: () => void = () => {
        this.xPosition = this.xStartPosition;
        this.yPosition = this.yStartPosition;
        this.previousMovement = null;
        if (this.name == "Blinky") {this.movement = "left";}
        else {this.movement = null;}
        if (this.name != "Hoog-Man" && this.name != "Blinky") {this.mode = null;}
    }
}
