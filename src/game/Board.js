import { Cell } from "./Cell";
import { Disk } from "./Disk";

export class Board {
    /**
     * @type {Cell[][]}
     * @private
     */
    _data = [];

    /**
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height) {
        if (width < 0 || height < 0) {
            throw "Board size must be a positive number";
        }

        // Initialize board with empty cells
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (this._data.length <= y) {
                    this._data.push([]);
                }

                const row = this._data[ y ];

                if (row.length <= x) {
                    row.push(new Cell(x, y));
                }
            }
        }
    }

    /**
     * @returns {number}
     */
    get width() {
        if (this._data.length < 1) {
            return 0;
        }

        return this._data[ 0 ].length;
    }

    /**
     * @returns {number}
     */
    get height() {
        return this._data.length;
    }

    /**
     * @returns {Cell[]}
     */
    get cells() {
        const cells = [];

        for (const row of this.rows) {
            cells.push(...row);
        }

        return cells;
    }

    /**
     * @returns {Cell[][]}
     */
    get rows() {
        return this._data.map(row => {
            return row.map(cell => {
                return cell.clone();
            });
        });
    }

    /**
     * @returns {Cell[][]}
     */
    get columns() {
        if (this.rows.length < 1) {
            return [];
        }

        return this._data[ 0 ].map((column, i) => {
            return this._data.map(row => {
                return row[ i ].clone();
            });
        });
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isWithinBoard(x, y) {
        return x >= 0 && x < this.width &&
               y >= 0 && y < this.height;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {Cell|null}
     */
    getCell(x, y) {
        if (!this.isWithinBoard(x, y)) {
            return null;
        }

        return this._data[ y ][ x ].clone();
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {Disk} disk
     * @returns {Board}
     * @throws {string} if the given coords are invalid
     */
    putDisk(x, y, disk) {
        if (!this.isWithinBoard(x, y)) {
            throw `Tried to put disk in cell outside of board (x: ${ x }, y: ${ y })`;
        }

        const board = this.clone();

        board._data[ y ][ x ].disk = disk;

        return board;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {Board}
     * @throws {string} if the given coords are invalid
     */
    clearCell(x, y) {
        if (!this.isWithinBoard(x, y)) {
            throw `Tried to clear cell outside of board (x: ${ x }, y: ${ y })`;
        }

        const board = this.clone();

        board._data[ y ][ x ].disk = null;

        return board;
    }

    /**
     * @returns {Board}
     */
    clone() {
        const board = new Board();

        board._data = this.rows;

        return board;
    }

    /**
     * @returns {string}
     */
    toString() {
        let output = "";

        for (const row of this.rows) {
            for (const cell of row) {
                if (cell.disk === null) {
                    output += "□";
                } else if (cell.disk.color === "white") {
                    output += "○";
                } else if (cell.disk.color === "black") {
                    output += "●";
                }
            }

            output += "\n";
        }

        return output;
    }

    /**
     * @type {string|void[][]} array
     * @returns {Board}
     */
    static fromArray(array) {
        let width = 0;
        let height = array.length;

        for (const row of array) {
            width = Math.max(row.length, width);
        }

        let board = new Board(width, height);

        for (let y = 0; y < array.length; y++) {
            const row = array[ y ];

            for (let x = 0; x < row.length; x++) {
                const color = row[ x ];

                if (!color) {
                    continue;
                }

                board = board.putDisk(x, y, new Disk(color));
            }
        }

        return board;
    }
}
