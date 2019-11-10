import { Player } from "../game/Player";
import { State } from "../game/State";

export class EmilBot extends Player {
    constructor(name, color) {
        super(name, color);

        
    }
    
    /**
     * @param {State} state 
     */
    
    evaluateScore(cell, state) {
        let cellScore = 0;
        let nextCellScore = 0;
        const disksFlipped = state.predictMove(cell.x, cell.y);
        const nextState = state.makeMove(cell.x, cell.y);
        const yourNextTurn = nextState.rotatePlayers();
        const possibleMoves = yourNextTurn.getPossibleMoves();

        // Give score based on disks flipped
        cellScore += disksFlipped.length + 1;            

        // Add score if disks flipped are on an edge 
        disksFlipped.forEach((cell) => {
            if (nextState.board.isEdge(cell.x, cell.y)) {
                cellScore += 4;
            }
        });

        // Give score based on if cell is located in a corner
        if (state.board.isCorner(cell.x, cell.y)) {
            cellScore += 15;
        }

        // Give score based on if it makes opponent skip a turn
        const opponentState = state.makeMove(cell.x, cell.y);
        if (opponentState.getPossibleMoves().length == 0) {
            cellScore += 10;
        }

        // Give score based on disks flipped on next connected moves
        possibleMoves.forEach((nextCell) => {
            if (nextCell.x == cell.x || nextCell.y == cell.y ||  nextCell.x - cell.x == nextCell.y - cell.y) {
                var score = yourNextTurn.predictMove(nextCell.x, nextCell.y).length + 1;
                if (score > nextCellScore) {
                    nextCellScore = score;
                }
            }
        });


        // Reduce score if move enables next turn to get corner
        nextState.getPossibleMoves().forEach((nextCell) => {
            if (nextState.board.isCorner(nextCell.x, nextCell.y)) {
                cellScore -= 8;
            }
        });

        // Give score if move gives you more possibilites than the opponent
        if (nextState.getPossibleMoves().length < yourNextTurn.getPossibleMoves().length) {
            cellScore += 3;
        };

        return cellScore + nextCellScore
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