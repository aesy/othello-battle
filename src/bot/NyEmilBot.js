import { Player } from "../game/Player";
import { State } from "../game/State";

export class NyEmilBot extends Player {
    constructor(name, color) {
        super(name, color);  
    }
    
    /**
     * @param {State} state 
     */

    evaluateScores(state, moves) {
        let arr = [];
        
        for (let move of moves) {
            const opponentState = state.makeMove(move.x, move.y);
            const opponentMoves = opponentState.getPossibleMoves();

            let score = {
                flipDifference: 0,
                mobilityDifference: 0
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
    }
   
    async getNextMove(state) {
        const moves = state.getPossibleMoves();
        const movesWithScore = this.evaluateScores(state, moves);

        if (moves.length > 0) {
            const bestMove = movesWithScore.reduce(function(prev, current) {
                if (prev.mobilityDifference == current.mobilityDifference) {
                    return (prev.flipDifference > current.flipDifference) ? prev : current
                }
                return (prev.mobilityDifference > current.mobilitDifference) ? prev : current
            })
            console.log(movesWithScore, bestMove)
            return { x: bestMove.x, y: bestMove.y };
        }
        return;
    }

    clone() {
        return new NyEmilBot(this.name, this.color);
    }
}