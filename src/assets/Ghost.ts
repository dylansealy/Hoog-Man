import p5 from "p5";
import { GameVariables, GhostInterface, GhostMode } from "../Types";
import { Character } from "./Character.js";

export class Ghost extends Character implements GhostInterface {
    chaseCounter: number;
    chaseRound: number;
    chaseSequence: Array<number>;
    frightenedCounter: number;
    frightenedRound: number;
    scatterCounter: number;
    scatterRound: number;
    scatterSequence: Array<number>;
    previousMode: GhostMode;
    mode: GhostMode;
    pelletCounter: number;
    pelletThreshold: number;
    xTarget: number;
    yTarget: number;
    constructor(p: p5, v: GameVariables) {
        super(p, v);
        this.chaseCounter = 0;
        this.chaseRound = 0;
        this.chaseSequence = [20, 20, 20];
        this.frightenedCounter = 0;
        this.frightenedRound = 0;
        this.scatterCounter = 0;
        this.scatterRound = 0;
        this.scatterSequence = [7, 7, 5, 5];
        this.previousMode = null;
        this.pelletCounter = 0;
    }
}
