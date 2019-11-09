export class Direction {
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

    static NORTH = new Direction(0, -1);
    static SOUTH = new Direction(0, +1);
    static WEST = new Direction(-1, 0);
    static EAST = new Direction(+1, 0);
    static NORTH_WEST = new Direction(-1, -1);
    static SOUTH_EAST = new Direction(+1, +1);
    static SOUTH_WEST = new Direction(-1, +1);
    static NORTH_EAST = new Direction(+1, -1);
}
