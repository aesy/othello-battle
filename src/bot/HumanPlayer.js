import { Player } from "../game/Player";

export class HumanPlayer extends Player {
    constructor(name, color) {
        super(name, color);
    }

    async getNextMove(state) {
        const tries = 3;
        alert(`Player '${ state.getCurrentPlayer().name }'s turn!`);

        for (let i = 0; i < tries; i++) {
            const x = parseInt(prompt("y (column index)"), 10);
            const y = parseInt(prompt("x (row index)"), 10);

            if (isNaN(x) || isNaN(y)) {
                alert(`Please provide numbers, tries left: ${ tries - i - 1 }`);
            } else if (!state.isValidMove(x, y)) {
                alert(`Please provide valid indices, tries left: ${ tries - i - 1 }`);
            } else {
                return { x, y };
            }
        }

        throw `Player '${ state.getCurrentPlayer().name }' wasn't able to provide valid indices in ${ tries } tries`;
    }

    clone() {
        return new HumanPlayer(this.name, this.color);
    }
}
