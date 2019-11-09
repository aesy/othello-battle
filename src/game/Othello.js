import { Board } from "./Board";
import { Disk } from "./Disk";
import { State } from "./State";
import { sleep } from "./util";

/**
 * @param {Player[]} players
 * @param {number} width
 * @param {number} height
 * @returns {Board}
 */
function createInitialBoard(players, width, height) {
    let board = new Board(width, height);
    const colors = players.map(player => player.color);
    const centerX = width / 2 - 1;
    const centerY = height / 2 - 1;

    // Add 4 discs in the center
    for (let x = centerX; x <= centerX + 1; x++) {
        for (let y = centerY; y <= centerY + 1; y++) {
            const color = colors[ (x + y) % 2 ];

            board = board.putDisk(x, y, new Disk(color));
        }
    }

    return board;
}

// TODO fix bug in makeMove / isValid methods
// TODO makeMove time measurement

export class Othello {
    /**
     * @type {number}
     * @private
     */
    _step = 0;

    /**
     * @type {State[]}
     * @private
     */
    _history = [];

    /**
     * @param {Player[]} players
     */
    constructor(players) {
        if (players.length !== 2) {
            throw `Othello can only be played by 2 players - ${ players.length } given`;
        }

        const initialBoard = createInitialBoard(players, 8, 8);
        const initialState = new State(players[ 0 ], players[ 1 ], initialBoard);

        this._history.push(initialState);

        // TODO create board view
    }

    /**
     * @returns {State}
     */
    getCurrentState() {
        return this._history[ this._step ];
    }

    /**
     * @returns {Promise<void>} a promise that resolve when the game is over
     * @throws {string} if unable to proceed with the game due to invalid input
     */
    async play() {
        let state = this.getCurrentState();

        while (!state.isGameOver()) {
            const player = state.getCurrentPlayer();

            console.log(`Current board: \n${ state.board.toString() }`);
            console.log(`Player '${ player.name }'s turn!`);
            console.log("Available moves:", state.getPossibleMoves());

            // TODO highlight current player
            // TODO highlight available moves

            await sleep(2);

            if (state.getPossibleMoves().length === 0) {
                // Current player can't do anything, so skip turn
                state = state.rotatePlayers();
                console.log(`Player '${ player.name }' can't make a move, skipping turn...`);
            } else {
                const move = await player.getNextMove(state.clone());

                if (!move || move.x === undefined || move.y === undefined) {
                    throw `Player '${ player.name }' Invalid move object provided. A move must consist of a x and a y coord`;
                }

                console.log(`Player '${ player.name }' decided to make a move at x: ${ move.x }, y: ${ move.y }`);

                const flips = state.predictMove(move.x, move.y);

                console.log("Predicted flipped cells:", flips);

                state = state.makeMove(move.x, move.y);

                console.log(`Player '${ player.name }' made a move and flipped ${ flips.length } disks`);
            }

            this._history.push(state);
            this._step += 1;

            // TODO update board

            await sleep(2);
        }

        console.log("Game over!");
    }
}
