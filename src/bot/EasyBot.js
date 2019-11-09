import { Player } from "../game/Player";
import { State } from "../game/State";

export class EasyBot extends Player {
    constructor(name, color) {
        super(name, color);
    }

    async getNextMove(state) {
        const possibleMoves = state.getPossibleMoves();
        let scores = possibleMoves
            .map(move => this.evaluateStateScore(state.makeMove(move.x, move.y), 1))
            .map((score, index) => { return { score, index }; })
            .sort((a, b) => a.score - b.score);

        scores = scores.filter(item => item.score === scores[ 0 ].score);
        const index = scores[ Math.floor(Math.random() * scores.length) ].index;
        const move = possibleMoves[ index ];

        return { x: move.x, y: move.y };
    }

    /**
     * @param {State} state
     * @param {number} levels
     * @returns {number}
     */
    evaluateStateScore(state, levels) {
        return state.getPossibleMoves()
            .map(move => {
                if (levels <= 0) {
                    return this.evaluateBoardScore(state.board);
                } else {
                    return this.evaluateStateScore(state.makeMove(move.x, move.y), levels - 1)
                }
            })
            .sort()
            [0];
    }

    /**
     * @param {Board} board
     * @returns {number}
     */
    evaluateBoardScore(board) {
        return board.cells
            .map(cell => {
                const score = this.evaluateCellScore(board, cell.x, cell.y);

                if (cell.isEmpty()) {
                    return 0;
                } else if (cell.disk.color === this.color) {
                    return score;
                } else {
                    return -score;
                }
            })
            .reduce((a, b) => a + b, 0);
    }

    /**
     * @param {Board} board
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    evaluateCellScore(board, x, y) {
        if (board.isCorner(x, y)) {
            return 99;
        }

        if (board.isEdge(x, y)) {
            return 50;
        }

        if (this.isAdjacentToCorner(board, x, y)) {
            return 0;
        }

        return 1;
    }

    /**
     * @param {Board} board
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isAdjacentToCorner(board, x, y) {
        return (Math.max(x - 1, 0) === 0 || Math.max(x + 1, board.width)) &&
               (Math.max(y - 1, 0) === 0 || Math.max(y + 1, board.height));
    }

    clone() {
        return new EasyBot(this.name, this.color);
    }
}
