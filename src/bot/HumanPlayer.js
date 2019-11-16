import { Player } from "../game/Player";

export class HumanPlayer extends Player {
    constructor(name, color) {
        super(name, color);
    }

    getNextMove(state) {
        return new Promise(resolve => {
            this.resolve = resolve;
        });
    }

    onClick(cell) {
        if (!this.resolve) {
            throw `Player '${ name } received onClick event while not waiting for next move'`;
        }

        this.resolve(cell);
        this.resolve = null;
    }

    clone() {
        return new HumanPlayer(this.name, this.color);
    }
}
