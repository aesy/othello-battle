import { Player } from "../game/Player";
import { State } from "../game/State";
import { Direction } from "../game/Direction";

export class MegaBot extends Player {
    constructor(name, color) {
        super(name, color);
    }

    /**
     * @param {State} state 
     */
    async getNextMove(state) {
        const possibleMoves = state.getPossibleMoves()
        for(let i = 0; i < possibleMoves.length; i++) {
            if(state.board.isCorner(possibleMoves[i].x, possibleMoves[i].y)) {
                //console.log('isCorner')
                return { x: possibleMoves[i].x, y: possibleMoves[i].y }
            }
        }
        for(let i = 0; i < possibleMoves.length; i++) {
            if(state.board.getEmptyCells().length > 5) {
                if(this.couldForceCorner(state.makeMove(possibleMoves[i].x, possibleMoves[i].y), 2)) {
                    //console.log(possibleMoves[i].x, possibleMoves[i].y, ' could')
                    return { x: possibleMoves[i].x, y: possibleMoves[i].y }
                }
            } else if (state.board.getEmptyCells().length > 2) {
                if(this.couldForceCorner(state.makeMove(possibleMoves[i].x, possibleMoves[i].y), 1)) {
                    //console.log(possibleMoves[i].x, possibleMoves[i].y, ' could')
                    return { x: possibleMoves[i].x, y: possibleMoves[i].y }
                }
            } else {
                break;
            }
        }
        //console.log('couldnt')
        for(let i = 0; i < possibleMoves.length; i++) {
            if(state.makeMove(possibleMoves[i].x, possibleMoves[i].y).getPossibleMoves().length === 0) {
                //console.log('hindersEnemyMoves')
                return { x: possibleMoves[i].x, y: possibleMoves[i].y }
            }
        }
        for(let i = 0; i < possibleMoves.length; i++) {
            if(this.isAdjacentToSelfsCorner(possibleMoves[i], state)) {
                if(!this.selfHindering(possibleMoves[i], state)) {
                    //console.log('isAdjacentToSelfsCorner')
                    return { x: possibleMoves[i].x, y: possibleMoves[i].y }
                }   
            }
        }
        return this.getOptimalMove(possibleMoves, state)
    }
    couldForceCorner(enemyState, counter) {
        if(counter === 0) {
            return false
        } else {
            if(enemyState.getPossibleMoves().length !== 0) {
                let enemyPossibleMoves = enemyState.getPossibleMoves()
                for(let i = 0; i < enemyPossibleMoves.length; i++) {
                    let myState = enemyState.makeMove(enemyPossibleMoves[i].x, enemyPossibleMoves[i].y)
                    if(myState.getPossibleMoves().length !== 0) {
                        let myPossibleMoves = myState.getPossibleMoves()
                        let givesAwayCorner = false
                        for(let j = 0; j < myPossibleMoves.length; j++) {
                            if(myState.board.isCorner(myPossibleMoves[j].x, myPossibleMoves[j].y) && myState.board.getCell(myPossibleMoves[j].x, myPossibleMoves[j].y).isEmpty()) {
                                givesAwayCorner = true
                                break;
                            }
                        }
                        if(!givesAwayCorner) {
                            for(let j = 0; j < myPossibleMoves.length; j++) {
                                if(this.couldForceCorner(myState.makeMove(myPossibleMoves[j].x, myPossibleMoves[j].y), counter - 1)) {
                                    givesAwayCorner = true
                                    break;
                                }
                            }
                        }
                        if(!givesAwayCorner) {
                            return false
                        }
                    } else {
                        if(!this.couldForceCorner(myState.rotatePlayers(), counter - 1)) {
                            return false
                        }
                    } 
                }
            } else {
                let myState = enemyState.rotatePlayers()
                if(myState.getPossibleMoves().length !== 0) {
                    let myPossibleMoves = myState.getPossibleMoves()
                    let givesAwayCorner = false
                    for(let j = 0; j < myPossibleMoves.length; j++) {
                        if(myState.board.isCorner(myPossibleMoves[j].x, myPossibleMoves[j].y) && myState.board.getCell(myPossibleMoves[j].x, myPossibleMoves[j].y).isEmpty()) {
                            givesAwayCorner = true
                            break;
                        }
                    }
                    if(!givesAwayCorner) {
                        for(let j = 0; j < myPossibleMoves.length; j++) {
                            if(this.couldForceCorner(myState.makeMove(myPossibleMoves[j].x, myPossibleMoves[j].y), counter - 1)) {
                                givesAwayCorner = true
                                break;
                            }
                        }
                    }
                    if(!givesAwayCorner) {
                        return false
                    }
                } else {
                    return false
                } 
            }
            return true
        }
    }
    selfHindering(cell, state) {
        const secondState = state.makeMove(cell.x, cell.y)
        const secondStatePMs = secondState.getPossibleMoves()
        for(let i = 0; i < secondStatePMs.length; i++) {
            if(secondState.makeMove(secondStatePMs[i].x, secondStatePMs[i].y).getPossibleMoves().length === 0) {
                return true
            }
        }
        return false
    }
    getOptimalMove(possibleMoves, state) {
        const arr = []
        let maxScore = null
        let maxScoreHindered = null
        let maxScoreCornerAdjacent = null
        for(let i = 0; i < possibleMoves.length; i++) {
            let selfScore = state.predictMove(possibleMoves[i].x, possibleMoves[i].y).length
            let secondState = state.makeMove(possibleMoves[i].x, possibleMoves[i].y)
            let secondStatePMs = secondState.getPossibleMoves()
            let enemyScore = 0
            for(let j = 0; j < secondStatePMs.length; j++) {
                if(secondState.predictMove(secondStatePMs[j].x, secondStatePMs[j].y).length > enemyScore) {
                    enemyScore = secondState.predictMove(secondStatePMs[j].x, secondStatePMs[j].y).length
                }
            }
            let score = selfScore - enemyScore
            if(!this.isAdjacentToEmptyCorner(possibleMoves[i], state) && !this.isAdjacentToEnemysCorner(possibleMoves[i], state)) {
                if(!this.selfHindering(possibleMoves[i], state)) {
                    arr.push({cell: possibleMoves[i], score: score, hindered: 0, cornerAdjacent: 0})
                    if(maxScore == null) {
                        maxScore = score
                    } else if(score > maxScore) {
                        maxScore = score
                    }
                } else {
                    arr.push({cell: possibleMoves[i], score: score, hindered: 1, cornerAdjacent: 0})
                    if(maxScoreHindered == null) {
                        maxScoreHindered = score
                    } else if(score > maxScoreHindered) {
                        maxScoreHindered = score
                    }
                }
            } else {
                arr.push({cell: possibleMoves[i], score: score, hindered: 1, cornerAdjacent: 1})
                if(maxScoreCornerAdjacent == null) {
                    maxScoreCornerAdjacent = score
                } else if(score > maxScoreCornerAdjacent) {
                    maxScoreCornerAdjacent = score
                }
            }
        }
        const maxScoreMoves = arr.filter(function(element) {
            return element.score === maxScore && element.hindered == 0
        })
        const maxScoreHinderedMoves = arr.filter(function(element) {
            return element.score === maxScoreHindered && element.cornerAdjacent == 0
        })
        const maxScoreCornerAdjacentMoves = arr.filter(function(element) {
            return element.score === maxScoreCornerAdjacent && element.cornerAdjacent == 1
        })
        if(maxScoreMoves.length > 0) {
            return maxScoreMoves[Math.floor(Math.random() * maxScoreMoves.length)].cell
        } else if(maxScoreHinderedMoves.length > 0) { 
            return maxScoreHinderedMoves[Math.floor(Math.random() * maxScoreHinderedMoves.length)].cell
        } else if(maxScoreCornerAdjacentMoves.length > 0) {
            return maxScoreCornerAdjacentMoves[Math.floor(Math.random() * maxScoreCornerAdjacentMoves.length)].cell
        } else {
            return(possibleMoves[Math.floor(Math.random() * possibleMoves.length)])
        }
    }
    isAdjacentToSelfsCorner(cell, state) {
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
    isAdjacentToEnemysCorner(cell, state) {
        const adjacentCells = state.board.getAdjacentCells(cell.x, cell.y)
        for(let i = 0; i < adjacentCells.length; i++) {
            if(!state.board.getCell(adjacentCells[i].x, adjacentCells[i].y).isEmpty()) {
                if(state.board.isCorner(adjacentCells[i].x, adjacentCells[i].y) && state.board.getCell(adjacentCells[i].x, adjacentCells[i].y).disk.color !== this.color) {
                    return true
                }
            }   
        }
        return false
    }
    isAdjacentToEmptyCorner(cell, state) {
        const adjacentCells = state.board.getAdjacentCells(cell.x, cell.y)
        for(let i = 0; i < adjacentCells.length; i++) {
            if(state.board.isCorner(adjacentCells[i].x, adjacentCells[i].y) && state.board.getCell(adjacentCells[i].x, adjacentCells[i].y).isEmpty()) {
                return true
            }
        }
        return false
    }
    clone() {
        return new MegaBot(this.name, this.color);
    }
}