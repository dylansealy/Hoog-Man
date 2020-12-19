import p5 from "p5";
import { CharacterInterface, GameVariables, Movement } from "./Types";

export class Character implements CharacterInterface {
    collision: boolean;
    color: string;
    diameter: number;
    previousMovement: Movement;
    movement: Movement;
    nextMovement: Movement;
    p: p5;
    speed: number;
    v: GameVariables;
    xPosition: number;
    yPosition: number;
    constructor(p: p5, v: GameVariables) {
        this.p = p;
        this.v = v;
        this.collision = false;
        this.color = null;
        this.diameter = this.v.gameBoard.heightUnit / 2;
        this.previousMovement = null;
        this.movement = null;
        this.nextMovement = null;
        this.speed = 88 / 60 / 650 * this.v.gameBoard.innerHeight
        this.xPosition = null;
        this.yPosition = null;
    }
    checkCollision(): void {
        for (let obstacle in this.v.obstacles) {
            if (
                this.xPosition - this.v.gameBoard.widthUnit * 0.5 + 1 < this.v.obstacles[obstacle].xPosition + this.v.obstacles[obstacle].width &&
                this.xPosition + this.v.gameBoard.widthUnit * 0.5 - 1 > this.v.obstacles[obstacle].xPosition &&
                this.yPosition - this.v.gameBoard.heightUnit * 0.5 + 1 < this.v.obstacles[obstacle].yPosition + this.v.obstacles[obstacle].height &&
                this.yPosition + this.v.gameBoard.heightUnit * 0.5 - 1 > this.v.obstacles[obstacle].yPosition
            ) {return this.resetMovement(true);}
            else if (
                this.xPosition - this.v.gameBoard.widthUnit * 0.5 + 1 < this.v.gameBoard.xInner ||
                this.xPosition + this.v.gameBoard.widthUnit * 0.5 - 1 > this.v.gameBoard.xInner + this.v.gameBoard.innerWidth ||
                this.yPosition - this.v.gameBoard.heightUnit * 0.5 + 1 < this.v.gameBoard.yInner ||
                this.yPosition + this.v.gameBoard.heightUnit * 0.5 -1 > this.v.gameBoard.yInner + this.v.gameBoard.innerHeight
            ) {return this.resetMovement(true);}
        }
    }
    constrainPosition(): void {
        const xConstrain = (): number => {
            for (let i = 0; i < 17; i++) {
                if (
                    this.xPosition > this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * i &&
                    this.xPosition < this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * (i + 1)
                ) {return this.xPosition = this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * (i + 0.5);}
            }
        }
        const yConstrain = (): number => {
            for (let i = 0; i < 14; i++) {
                if (
                    this.yPosition > this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * i &&
                    this.yPosition < this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * (i + 1)
                ) {return this.yPosition = this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * (i + 0.5);}
            }
        }
        if (this.movement == "left" || this.movement == "right") {yConstrain();}
        else if (this.movement == "up" || this.movement == "down") {xConstrain();}
        else {
            xConstrain();
            yConstrain();
        }
    }
    draw(): void {
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
    }
    resetMovement(afterCollision: boolean): void {
        if (this.movement != null) {this.previousMovement = this.movement;}
        this.collision = true;
        this.movement = null;
        this.nextMovement = null;
        this.xMovement = false;
        this.yMovement = false;
        if (afterCollision) {this.constrainPosition();}
    }
}
