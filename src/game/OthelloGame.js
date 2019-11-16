import React from "react";
import ReactDOM from "react-dom";
import { OthelloUI } from "../ui/OthelloUI";
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

export class OthelloGame {
    /**
     * @type {number}
     * @private
     */
    _turn = 0;

    /**
     * @type {State[]}
     * @private
     */
    _states = [];

    /**
     * @param {Player[]} players
     */
    constructor(players) {
        if (players.length !== 2) {
            throw `Othello can only be played by 2 players - ${ players.length } given`;
        }

        const initialBoard = createInitialBoard(players, 8, 8);
        const initialState = new State(players[ 0 ], players[ 1 ], initialBoard);

        this.updateState(initialState);
    }

    /**
     * @returns {State}
     */
    getCurrentState() {
        return this._states[ this._turn ];
    }

    /**
     * @param {State} state
     */
    updateState(state) {
        this._states.push(state);

        if (this.getCurrentTurn() >= this._states.length - 2) {
            this.setTurn(this._states.length - 1);
        } else {
            this.updateView();
        }
    }

    /**
     * @returns {number}
     */
    getCurrentTurn() {
        return this._turn;
    }

    /**
     * @param {number} turn
     */
    setTurn(turn) {
        this._turn = turn;

        this.updateView();
    }

    /**
     * @param {Cell} cell
     */
    onClick(cell) {
        if (this.getCurrentTurn() !== this._states.length - 1) {
            return;
        }

        const state = this.getCurrentState();
        const player = state.getCurrentPlayer();

        if (typeof player.onClick === "function") {
            player.onClick(cell);
        }
    }

    updateView() {
        ReactDOM.render(
            <OthelloUI game={ this }/>,
            document.getElementById("content")
        );
    }

    /**
     * @returns {Promise<void>} a promise that resolve when the game is over
     * @throws {string} if unable to proceed with the game due to invalid input
     */
    async play() {
        let state = this.getCurrentState();

        while (!state.isGameOver()) {
            const player = state.getCurrentPlayer();

            await sleep(0);

            if (state.getPossibleMoves().length === 0) {
                // Current player can't do anything, so skip turn
                state = state.rotatePlayers();
            } else {
                const move = await player.getNextMove(state.clone());

                if (!move || move.x === undefined || move.y === undefined) {
                    throw `Player '${ player.name }' Invalid move object provided. A move must consist of a x and a y coord`;
                }

                state = state.makeMove(move.x, move.y);
            }

            this.updateState(state);

            await sleep(0);
        }
    }
}
