import { Player } from "../game/Player";
import { State } from "../game/State";
import { STATUS_CODES } from "http";

export class SuperBot extends Player {
    constructor(name, color) {
        super(name, color);
    }

    /**
     * @param {State} state 
     */
    async getNextMove(state) {
        const possibleMoves = state.getPossibleMoves()
        const cornerCells = state.board.getCornerCells()
        /*for(i = 0; i < possibleMoves.length; i++) {
            if(state.board.isEdge(possibleMoves[i].x, possibleMoves[i].y) && possibleMoves[i].x == 0) {
                let error = false
                while(!error) {

                }
            }
        }*/
        for(let i = 0; i < possibleMoves.length; i++) {
            if(state.board.isCorner(possibleMoves[i].x, possibleMoves[i].y)) {
                return { x: possibleMoves[i].x, y: possibleMoves[i].y }
            }
        }
        for(let i = 0; i < possibleMoves.length; i++) {
            if(state.makeMove(possibleMoves[i].x, possibleMoves[i].y).getPossibleMoves().length === 0) {
                return { x: possibleMoves[i].x, y: possibleMoves[i].y }
            }
        }
        const possibleSurroundedMoves = []
        for(let i = 0; i < possibleMoves.length; i++) {
            let adjacentCells = state.board.getAdjacentCells(possibleMoves[i].x, possibleMoves[i].y)
            let error = false
            for(let j = 0; j < adjacentCells.length; j++) {
                if(adjacentCells[j].isEmpty()) {
                    error = true
                    break;
                }
            }
            if(error === false) {
                if(state.board.isEdge(possibleMoves[i].x, possibleMoves[i].y)) {
                    console.log({ x: possibleMoves[i].x, y: possibleMoves[i].y })
                    return { x: possibleMoves[i].x, y: possibleMoves[i].y }
                } else {
                    possibleSurroundedMoves.push(possibleMoves[i])
                }
            }
        }
        if(possibleSurroundedMoves.length !== 0) {
            console.log({ x: possibleSurroundedMoves[i].x, y: possibleSurroundedMoves[i].y })
            return { x: possibleSurroundedMoves[0].x, y: possibleSurroundedMoves[0].y }
        }
        for(let i = 0; i < cornerCells.length; i++) {
            let adjacentCells = state.board.getAdjacentCells(cornerCells[i].x, cornerCells[i].y)
            for(let j = 0; j < adjacentCells.length; j++) {
                if(possibleMoves.includes(adjacentCells[j])) {
                    possibleMoves.splice(possibleMoves.indexOf(adjacentCells[j]), 1)
                }
            }
        }
        /*for(i = 0; i < possibleMoves.length; i++) {
            if((possibleMoves[i].x == state.board.width-1 || possibleMoves[i].x == 0) && (possibleMoves[i].y == state.board.height-1 || possibleMoves[i].y == 0)) {
                return { x: possibleMoves[i].x, y: possibleMoves[i].y }
            } 
            flippedDiscs = state.predictMove(possibleMoves[i])
            for(j = 0; j < flippedDiscs.length; j++) {
                if(state.board.) {

                }
            }
            else if (state.predictMove(move) == sta) {

            }
        }*/

        const randomMove = possibleMoves[ Math.floor(Math.random() * possibleMoves.length) ];
        console.log({ x: randomMove.x, y: randomMove.y })
        return { x: randomMove.x, y: randomMove.y };

        function isAdjacentToEnemysCorner(cell) {
            const adjacentCells = state.board.getAdjacentCells(cell.x, cell.y)
            for(let i = 0; i < adjacentCells.length; i++) {
                if(!state.board.getCell(adjacentCells[i].x, adjacentCells[i].y).isEmpty()) {
                    if(state.board.isCorner(adjacentCells[i].x, adjacentCells[i].y) && state.board.getCell(adjacentCells[i].x, adjacentCells[i].y).disk.color === this.color) {
                        return true
                    }
                }   
            }
            return false
        }
        function isAdjacentToEmptyCorner(cell) {
            const adjacentCells = state.board.getAdjacentCells(cell.x, cell.y)
            for(let i = 0; i < adjacentCells.length; i++) {
                if(state.board.isCorner(adjacentCells[i].x, adjacentCells[i].y) && state.board.getCell(adjacentCells[i].x, adjacentCells[i].y).isEmpty()) {
                    return true
                }
            }
            return false
        }
    }
    clone() {
        return new SuperBot(this.name, this.color);
    }
}
