export class Disk {
    /**
     * @type {string}
     */
    color;

    /**
     * @param {string} color
     */
    constructor(color) {
        this.color = color;
    }

    /**
     * @returns {Disk}
     */
    clone() {
        return new Disk(this.color);
    }
}
