import { Character } from "./Character.js";
export class Ghost extends Character {
    constructor(p, v) {
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
