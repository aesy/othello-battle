export class Cell {
    /**
     * @type {number}
     */
    x;

    /**
     * @type {number}
     */
    y;

    /**
     * @type {Disk}
     */
    disk;

    /**
     * @param {number} x
     * @param {number} y
     * @param {Disk|null} [disk=null]
     */
    constructor(x, y, disk = null) {
        this.x = x;
        this.y = y;
        this.disk = disk;
    }

    /**
     * @returns {boolean}
     */
    isEmpty() {
        return !Boolean(this.disk);
    }

    /**
     * @returns {Cell}
     */
    clone() {
        let disk = null;

        if (!this.isEmpty()) {
            disk = this.disk.clone();
        }

        return new Cell(this.x, this.y, disk);
    }
}
