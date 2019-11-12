import { Player } from "../game/Player";
import { State } from "../game/State";

export class NyEmilBot extends Player {
    constructor(name, color) {
        super(name, color);  
    }
    
    /**
     * @param {State} state 
     */

    determineBestMove(state, moves) {
        const bestMove = moves.reduce(function(prev, current) {
            if (prev.cellScore == current.cellScore) {
                if (prev.mobilityDifference == current.mobilityDifference) {
                    console.log("flip")
                    return (prev.flipDifference > current.flipDifference) ? prev : current
                }
                console.log("mobility")
                return (prev.mobilityDifference > current.mobilityDifference) ? prev : current
            }
            console.log("cellscore")
            return (prev.cellScore > current.cellScore) ? prev : current
        })
        console.log(bestMove)
        return { x: bestMove.x, y: bestMove.y };
    };

    evaluateMoveScores(state, moves) {
        let arr = [];
        
        for (let move of moves) {
            const opponentState = state.makeMove(move.x, move.y);
            const opponentMoves = opponentState.getPossibleMoves();

            let score = {
                flipDifference: 0,
                mobilityDifference: 0,
                cellScore: this.evaluateCellScore(state, move)
            }

            for (const opponentMove of opponentMoves) {
                const stateAfter = opponentState.makeMove(opponentMove.x, opponentMove.y);
                const movesAfter = stateAfter.getPossibleMoves();
                if (state.predictMove(move.x, move.y).length - opponentState.predictMove(opponentMove.x, opponentMove.y).length > score.flipDifference) {
                    score.flipDifference = state.predictMove(move.x, move.y).length - opponentState.predictMove(opponentMove.x, opponentMove.y).length;
                }
                if (movesAfter.length - opponentMoves.length > score.mobilityDifference) {
                    score.mobilityDifference = movesAfter.length - opponentMoves.length;
                }
            }
            move = {...move, ...score} 
            arr.push(move);
        }
        return arr
    };

    evaluateCellScore(state, move) {
        let cellScore = 0;

        if (state.board.isCorner(move.x, move.y)) {
            cellScore += 100;
        }
        state.board.getAdjacentCells(move.x, move.y).forEach((cell) => {
            if (state.board.isCorner(cell.x, cell.y)) {
                cellScore -= 100;
            }
        });

        return cellScore
    }
   
    async getNextMove(state) {
        const moves = state.getPossibleMoves();
        
        if (moves.length > 0) {
            const movesWithScore = this.evaluateMoveScores(state, moves);
            const bestMove = this.determineBestMove(state, movesWithScore);
            return { x: bestMove.x, y: bestMove.y };
        }
        return
    };

    clone() {
        return new NyEmilBot(this.name, this.color);
    }
}