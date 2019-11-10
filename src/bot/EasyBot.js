import { Player } from "../game/Player";
import { State } from "../game/State";

export class EasyBot extends Player {
    constructor(name, color) {
        super(name, color);
    }

    async getNextMove(state) {
        const possibleMoves = state.getPossibleMoves();
        let scores = possibleMoves
            .map(move => this.evaluateStateScore(state.makeMove(move.x, move.y), 0))
            .map((score, index) => { return { score, index }; })
            .sort((a, b) => a.score - b.score)
            .reverse();

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
        if (levels <= 0) {
            return this.evaluateBoardScore(state.board);
        }

        return state.getPossibleMoves()
            .map(move => this.evaluateStateScore(state.makeMove(move.x, move.y), levels - 1))
            .sort()
            .reverse()
            [0];
    }

    /**
     * @param {Board} board
     * @returns {number}
     */
    evaluateBoardScore(board) {
        return board.cells
            .map(cell => {
                if (cell.isEmpty()) {
                    return 0;
                }

                const score = this.evaluateCellScore(board, cell.x, cell.y);

                if (cell.disk.color === this.color) {
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
            return 100;
        }

        if (this.isAdjacentToCorner(board, x, y)) {
            return -100;
        }

        if (board.isEdge(x, y)) {
            return 50;
        }

        if (this.isAdjacentToEdge(board, x, y)) {
            return -50;
        }

        return 25;
    }

    /**
     * @param {Board} board
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isAdjacentToCorner(board, x, y) {
        if (board.isCorner(x, y)) {
            return false;
        }

        return (x - 1 <= 0 || x + 1 >= board.width - 1) &&
               (y - 1 <= 0 || y + 1 >= board.height - 1);
    }

    /**
     * @param {Board} board
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isAdjacentToEdge(board, x, y) {
        if (board.isEdge(x, y)) {
            return false;
        }

        return (x - 1 === 0 || x + 1 === board.width - 1) ||
               (y - 1 === 0 || y + 1 === board.height - 1);
    }

    /**
     * @param {Board} board
     * @returns {string}
     */
    createEvaluationTable(board) {
        let output = "";

        for (const row of board.rows) {
            for (const cell of row) {
                const score = this.evaluateCellScore(board, cell.x, cell.y);

                output += score.toString().padStart(4) + " ";
            }

            output += "\n";
        }

        return output;
    }

    clone() {
        return new EasyBot(this.name, this.color);
    }
}
