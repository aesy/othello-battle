export class Player {
    /**
     * @type {string}
     */
    name;

    /**
     * @type {string}
     */
    color;

    /**
     * @param {string} name
     * @param {string} color
     */
    constructor(name, color) {
        if (!name) {
            throw `Player with invalid (empty) name`;
        }

        if (!color) {
            throw `Player '${ name }' with an invalid (empty) color`;
        }

        this.name = name;
        this.color = color;
    }

    /**
     * @abstract
     * @param {State} state
     * @returns {Promise<{x: number, y: number}>}
     */
    async getNextMove(state) {
        throw `Player '${ this.name }' has not implemented Player#getNextMove(state)`;
    }

    /**
     * @abstract
     * @returns {Player}
     */
    clone() {
        return new Player(this.name, this.color);
    }
}
