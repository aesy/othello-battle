import { Player } from "../game/Player";
import { State } from "../game/State";

export class EmilBot extends Player {
    constructor(name, color) {
        super(name, color);

        
    }
    
    /**
     * @param {State} state 
     */

    countFlipBacks(cells, state) {
        let maxFlipBack = 0;
        let temp = 0;
        
        state.getPossibleMoves().forEach((nextCell) => {
            temp = 0;
            state.predictMove(nextCell.x, nextCell.y).forEach((cell) => {
                Object.values(cells).forEach((disk) => {
                    if (disk.x == cell.x && disk.y == cell.y) {
                        temp ++
                        maxFlipBack = temp;
                    }
                })
            });
        });
        return maxFlipBack
    }
    
    evaluateScore(cell, state) {
        let cellScore = 0;
        const disksFlipped = state.predictMove(cell.x, cell.y);
        const nextState = state.makeMove(cell.x, cell.y);
        
        // Give score based on disks flipped
        cellScore += disksFlipped.length - this.countFlipBacks(disksFlipped, nextState)/2;  
        
        // Add score if disks flipped are on an edge 
        disksFlipped.forEach((cell) => {
            if (nextState.board.isEdge(cell.x, cell.y)) {
                cellScore += 2;
            }
        });
        
        // Add score based on if cell is located in a corner
        if (state.board.isCorner(cell.x, cell.y)) {
            cellScore += 8;
        }
        
        // Add score based on if it makes opponent skip a turn
        const opponentState = state.makeMove(cell.x, cell.y);
        if (opponentState.getPossibleMoves().length == 0) {
            cellScore += 8;
        }
        
        // Reduce score if move allows opponent to get corner
        nextState.getPossibleMoves().forEach((cell) => {
            if (nextState.board.isCorner(cell.x, cell.y)) {
                cellScore -= 8;
            }
        });

        // Reduce score if cell is on edge with no adjacent disks on the edge
        if (state.board.isEdge(cell.x, cell.y)) {
            state.board.getAdjacentCells(cell.x, cell.y).forEach((cell) => {
                if (state.board.isEdge(cell.x, cell.y) && cell.isEmpty()) {
                    cellScore -= 1;
                }
            });
        }

        // Reduce score if cell is adjacent to corner
        state.board.getAdjacentCells(cell.x, cell.y).forEach((cell) => {
            if (state.board.isCorner(cell.x, cell.y)) {
                cellScore -= 10;
            }
        });

        // // Add score if adjacent cell is adjacent to corner...
        // state.board.getAdjacentCells(cell.x, cell.y).forEach((cell) => {
        //     state.board.getAdjacentCells(cell.x, cell.y).forEach((cell) => {
        //         state.board.getAdjacentCells(cell.x, cell.y).forEach((cell) => {
        //             if (state.board.isCorner(cell.x, cell.y)) {
        //                 cellScore += 8;
        //             }
        //         })
        //     })
        // });

        return cellScore
    }
    
    async getNextMove(state) {
        const possibleMoves = state.getPossibleMoves();
        let possibleMovesWithScore = [];
        
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