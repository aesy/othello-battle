import { Player } from "../game/Player";
import { State } from "../game/State";

export class EmilBot extends Player {
    constructor(name, color) {
        super(name, color);

        
    }
    
    /**
     * @param {State} state 
     */
    
    countAdjacentDisks(cell, state) {
        const adjecentCells = state.board.getAdjacentCells(cell);
        let counter = 0;

        adjecentCells.forEach((cell) => {
            if (!cell.isEmpty()) {
                counter ++;
            }
        });

        return counter
    }
    
    evaluateScore(cell, state) {
        let cellScore = 0;
        // Give scored based on if its located in a corner or not
        if (state.board.isCorner(cell.x, cell.y)) {
            cellScore += 10;
        }
        // Give score based on disks flipped
        cellScore = cellScore + state.predictMove(cell.x, cell.y).length + 1;            

        // Give score based on disks flipped on next connected moves
        const nextState = state.makeMove(cell.x, cell.y);
        const possibleMoves = nextState.getPossibleMoves();

        let idk;
        let nextCellScore = 0;

        possibleMoves.forEach((nextCell) => {
            if (nextCell.x == cell.x || nextCell.y == cell.x ||  nextCell.x - cell.x == nextCell.y - cell.y) {
                var score = nextState.predictMove(nextCell.x, nextCell.y).length + 1;
                if (score > nextCellScore) {
                    nextCellScore = score;
                    idk = nextCell;
                }
            }
        });

        // Reduce score if it is adjacent to empty corner
        state.board.getAdjacentCells(cell.x, cell.y).forEach((e) => {
            if (state.board.isCorner(e.x, e.y)) {
                console.log("nononono");
                if (e.isEmpty()) {
                    cellScore -= 3;
                }
            }
        })

        // Remove score based on amount of disks adjacent to disk on current and next move
        // cell.score = cell.score + this.countAdjacentDisks(cell, state);
        // nextCellScore = nextCellScore + this.countAdjacentDisks(idk, nextState);

        return cellScore + nextCellScore
    }
    
    async getNextMove(state) {
        const possibleMoves = state.getPossibleMoves();
        var possibleMovesWithScore = [];
        
        possibleMoves.forEach((cell) => {
            cell.score = this.evaluateScore(cell, state);
            possibleMovesWithScore.push(cell);
        });

        const nextMove = possibleMovesWithScore.reduce(function(prev, current) {
            return (prev.score > current.score) ? prev : current
        })
        
        return { x: nextMove.x, y: nextMove.y }; 
    }


    clone() {
        return new EmilBot(this.name, this.color);
    }
}