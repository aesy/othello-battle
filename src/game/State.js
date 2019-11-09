import { Disk } from "./Disk";

class Direction {
    /**
     * @type {number}
     */
    xOffset;

    /**
     * @type {number}
     */
    yOffset;

    /**
     * @param {number} xOffset
     * @param {number} yOffset
     */
    constructor(xOffset, yOffset) {
        this.xOffset = xOffset;
        this.yOffset = yOffset;
    }

    /**
     * @returns {Direction[]}
     */
    static all() {
        return [
            this.NORTH, this.SOUTH, this.WEST, this.EAST,
            this.NORTH_WEST, this.SOUTH_EAST, this.SOUTH_WEST, this.NORTH_EAST
        ];
    }

    static NORTH = new Direction(-1, 0);
    static SOUTH = new Direction(+1, 0);
    static WEST = new Direction(0, -1);
    static EAST = new Direction(0, +1);
    static NORTH_WEST = new Direction(-1, -1);
    static SOUTH_EAST = new Direction(+1, +1);
    static SOUTH_WEST = new Direction(+1, -1);
    static NORTH_EAST = new Direction(-1, +1);
}

export class State {
    /**
     * @type {Board}
     * @private
     */
    _board;

    /**
     * @type {Player}
     * @private
     */
    _player;

    /**
     * @type {Player}
     * @private
     */
    _opponent;

    /**
     * @param {Player} player
     * @param {Player} opponent
     * @param {Board} board
     */
    constructor(player, opponent, board) {
        this._board = board;
        this._player = player;
        this._opponent = opponent;
    }

    /**
     * @returns {Board}
     */
    get board() {
        return this._board.clone();
    }

    /**
     * @returns {Player} the current player
     */
    getCurrentPlayer() {
        return this._player.clone();
    }

    /**
     * @returns {Player} the opponent of the current player
     */
    getOpponentPlayer() {
        return this._opponent.clone();
    }

    /**
     * Rotates players, making the opponent player the current player
     *
     * @returns {State} the new state with the players rotated
     */
    rotatePlayers() {
        const state = this.clone();

        state._player = this._opponent;
        state._opponent = this._player;

        return state;
    }

    /**
     * Gets the possible cells the current player may use to make a move
     *
     * @returns {Cell[]} the possible cells the current player may use to make their move
     */
    getPossibleMoves() {
        return this.board.cells
            .filter(cell => this.isValidMove(cell.x, cell.y));
    }

    /**
     * Checks whether a coordinate of a board cell is valid for a player to use to make a move
     *
     * @param {number} x
     * @param {number} y
     * @returns {boolean} whether the given coords may be used the the given player to make a move
     */
    isValidMove(x, y) {
        if (!this.board.isWithinBoard(x, y)) {
            return false;
        }

        const player = this.getCurrentPlayer();
        const cell = this.board.getCell(x, y);

        if (!cell.isEmpty()) {
            return false;
        }

        for (const direction of Direction.all()) {
            let gap = 0;
            let cell = this.board.getCell(x, y);

            while (true) {
                if (!this.board.isWithinBoard(cell.x + direction.xOffset, cell.y + direction.yOffset)) {
                    break;
                }

                cell = this.board.getCell(cell.x + direction.xOffset, cell.y + direction.yOffset);

                if (cell.isEmpty()) {
                    break;
                }

                const disk = cell.disk;

                if (disk === null) {
                    break;
                }

                if (disk.color === player.color) {
                    if (gap > 0) {
                        return true;
                    } else {
                        break;
                    }
                }

                gap += 1;
            }
        }

        return false;
    }

    /**
     * Makes a prediction of what cells will be flipped if a given player makes a move at the given
     * coordinates.
     *
     * @param {number} x
     * @param {number} y
     * @returns {Cell[]}
     * @throws {string} if the given coords are invalid
     */
    predictMove(x, y) {
        const player = this.getCurrentPlayer();
        const flips = [];

        if (!this.isValidMove(x, y)) {
            throw `Player '${ player.name }' tried to predict an invalid move (${ x }, ${ y })`;
        }

        for (const direction of Direction.all()) {
            let cell = this.board.getCell(x, y);

            while (true) {
                if (!this.board.isWithinBoard(cell.x + direction.xOffset, cell.y + direction.yOffset)) {
                    break;
                }

                cell = this.board.getCell(cell.x + direction.xOffset, cell.y + direction.yOffset);

                if (cell.isEmpty()) {
                    break;
                }

                const disk = cell.disk;

                if (disk === null) {
                    break;
                }

                if (disk.color === player.color) {
                    break;
                } else {
                    flips.push({ x: cell.x, y: cell.y });
                }
            }
        }

        return flips;
    }

    /**
     * Makes a move and returns the new state, with disks flipped and players rotated. This new
     * state may be used to make further predictions.
     *
     * @param {number} x
     * @param {number} y
     * @returns {State} the new state with the disks flipped and players rotated
     * @throws {string} if the given coords are invalid
     */
    makeMove(x, y) {
        const player = this.getCurrentPlayer();

        if (!this.board.isWithinBoard(x, y)) {
            throw `Player '${ player.name }' tried to put a disk outside the board (${ x }, ${ y })`;
        }

        const cell = this.board.getCell(x, y);

        if (!cell.isEmpty()) {
            throw `Player '${ player.name }' tried to put a disk in a cell that already contains a disk (${ x }, ${ y })`;
        }

        if (!this.isValidMove(x, y)) {
            throw `Player '${ player.name }' tried to put a disk in a cell that isn't valid (${ x }, ${ y })`;
        }

        const state = this.clone();
        const flips = this.predictMove(x, y);

        for (const flip of flips) {
            state._board = state.board.putDisk(flip.x, flip.y, new Disk(player.color));
        }

        return state.rotatePlayers();
    }

    /**
     * Checks whether the game is over. The game is over when the current player can do any moves.
     *
     * @returns {boolean}
     */
    isGameOver() {
        return this.getPossibleMoves().length === 0;
    }

    /**
     * Creates a deep clone of this state object.
     *
     * @returns {State}
     */
    clone() {
        const player = this._player.clone();
        const opponent = this._opponent.clone();
        const board = this._board.clone();

        return new State(player, opponent, board);
    }
}
