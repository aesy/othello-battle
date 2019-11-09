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

/**
 * @param {State} state
 */
function updateScoreBoard(state) {
    const scoreboard = document.getElementById("scoreboard");

    while (scoreboard.firstChild) {
        scoreboard.removeChild(scoreboard.firstChild);
    }

    const players = [ state.getCurrentPlayer(), state.getOpponentPlayer() ]
        .sort((p1, p2) => p1.color < p2.color ? 1 : -1);

    for (const player of players) {
        const entry = document.createElement("div");
        entry.classList.add("entry");
        const name = document.createElement("span");
        name.classList.add("name");
        name.innerText = player.name;
        const disk = document.createElement("span");
        disk.classList.add("disk", player.color);
        const score = document.createElement("span");
        score.classList.add("score");
        score.innerText = String(state.board.getFilledCells(player.color).length);

        if (state.getCurrentPlayer().color === player.color) {
            name.classList.add("active");
        }

        entry.appendChild(name);
        entry.appendChild(disk);
        entry.appendChild(score);

        scoreboard.appendChild(entry);
    }
}

/**
 * @param {State} state
 */
function updateBoard(state) {
    const board = document.getElementById("board");

    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }

    for (const row of state.board.rows) {
        const rowElement = document.createElement("div");
        rowElement.classList.add("row");

        for (const cell of row) {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");

            const movable = state.getPossibleMoves()
                .find(move => move.x === cell.x && move.y === cell.y);

            if (!cell.isEmpty() || movable) {
                const diskElement = document.createElement("div");

                if (movable) {
                    diskElement.classList.add("disk", "phantom");
                } else {
                    diskElement.classList.add("disk", cell.disk.color);
                }

                cellElement.appendChild(diskElement);
            }

            rowElement.appendChild(cellElement);
        }

        board.appendChild(rowElement);
    }
}

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

        updateScoreBoard(state);
        updateBoard(state);

        while (!state.isGameOver()) {
            const player = state.getCurrentPlayer();

            console.log(`Current board: \n${ state.board.toString() }`);
            console.log(`Player '${ player.name }'s turn!`);
            console.log("Available moves:", state.getPossibleMoves());

            await sleep(2);

            if (state.getPossibleMoves().length === 0) {
                // Current player can't do anything, so skip turn
                state = state.rotatePlayers();
                console.log(`Player '${ player.name }' can't make a move, skipping turn...`);
            } else {
                const before = performance.now();
                const move = await player.getNextMove(state.clone());
                const after = performance.now();
                const timeSpent = after - before;

                if (!move || move.x === undefined || move.y === undefined) {
                    throw `Player '${ player.name }' Invalid move object provided. A move must consist of a x and a y coord`;
                }

                console.log(`Player '${ player.name }' decided to make a move at x: ${ move.x }, y: ${ move.y }. They took ${ timeSpent.toFixed(2) }ms to decide.`);

                const flips = state.predictMove(move.x, move.y);

                console.log("Predicted flipped cells:", flips);

                state = state.makeMove(move.x, move.y);

                console.log(`Player '${ player.name }' made a move and flipped ${ flips.length } disks`);
            }

            this._history.push(state);
            this._step += 1;

            updateScoreBoard(state);
            updateBoard(state);

            await sleep(2);
        }

        const player1 = state.getCurrentPlayer();
        const player2 = state.getOpponentPlayer();
        const player1Score = state.board.getFilledCells(player1.color).length;
        const player2Score = state.board.getFilledCells(player2.color).length;

        console.log("Game over!");
        console.log(`Current board: \n${ state.board.toString() }`);
        console.log(`Player ${ player1.name } (${ player1.color }): ${ player1Score }`);
        console.log(`Player ${ player2.name } (${ player2.color }): ${ player2Score }`);
    }
}
