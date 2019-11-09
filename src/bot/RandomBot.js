import { Player } from "../game/Player";

export class RandomBot extends Player {
    constructor(name, color) {
        super(name, color);
    }

    async getNextMove(state) {
        const possibleMoves = state.getPossibleMoves();
        const randomMove = possibleMoves[ Math.floor(Math.random() * possibleMoves.length) ];

        return { x: randomMove.x, y: randomMove.y };
    }

    clone() {
        return new RandomBot(this.name, this.color);
    }
}
