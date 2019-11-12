import { Player } from "../game/Player";
import { State } from "../game/State";
import { Direction } from "../game/Direction";

export class UltraBot extends Player {
    constructor(name, color) {
        super(name, color);
    }

    /**
     * @param {State} state 
     */
    async getNextMove(state) {
        const possibleMoves = state.getPossibleMoves()
        const prioArr = []
        const arr = []
        const sadArr = []
        for(let i = 0; i < possibleMoves.length; i++) {
            if(state.board.isCorner(possibleMoves[i].x, possibleMoves[i].y)) {
                //console.log('isCorner')
                return { x: possibleMoves[i].x, y: possibleMoves[i].y }
            }
        }
        for(let i = 0; i < possibleMoves.length; i++) {
            if(this.couldForceCorner(state.makeMove(possibleMoves[i].x, possibleMoves[i].y), 2)) {
                //console.log(possibleMoves[i].x, possibleMoves[i].y, ' could')
                prioArr.push({x: possibleMoves[i].x, y: possibleMoves[i].y})
            }
        }
        if(prioArr.length !== 0) {
            for(let i = 0; i < prioArr.length; i++) {
                prioArr[i].score = this.evaluateMove(prioArr[i], state)
            }
            //console.log(prioArr)
            const maxScoreMove = this.filterTheBest(prioArr)
            //console.log(maxScoreMove)
            return { x: maxScoreMove.x, y: maxScoreMove.y }
        }
        //console.log('couldnt')
        for(let i = 0; i < possibleMoves.length; i++) {
            let givesAwayCornerFirstTurn = false
            let givesAwayCornerLaterTurns = false
            const enemyState = state.makeMove(possibleMoves[i].x, possibleMoves[i].y)
            const enemyPossibleMoves = enemyState.getPossibleMoves()
            for(let j = 0; j < enemyPossibleMoves.length; j++) {
                if(enemyState.board.isCorner(enemyPossibleMoves[j].x, enemyPossibleMoves[j].y)) {
                    givesAwayCornerFirstTurn = true
                    break;
                } else if(this.couldForceCorner(enemyState.makeMove(enemyPossibleMoves[j].x, enemyPossibleMoves[j].y), 1)) {
                    givesAwayCornerLaterTurns = true
                }
            }
            if(!givesAwayCornerFirstTurn && !givesAwayCornerLaterTurns) {
                prioArr.push({x: possibleMoves[i].x, y: possibleMoves[i].y, score: this.evaluateMove(possibleMoves[i], state)})
            } else if(!givesAwayCornerFirstTurn) {
                arr.push({x: possibleMoves[i].x, y: possibleMoves[i].y, score: this.evaluateMove(possibleMoves[i], state)})
            } else {
                sadArr.push({x: possibleMoves[i].x, y: possibleMoves[i].y, score: this.evaluateMove(possibleMoves[i], state)})
            }
        }
        //console.log(prioArr)
        //console.log(arr)
        let maxScoreMove = null
        if(prioArr.length !== 0) {
            maxScoreMove = this.filterTheBest(prioArr)
        } else if(arr.length !== 0) {
            maxScoreMove = this.filterTheBest(arr)
        } else {
            maxScoreMove = this.filterTheBest(sadArr)
        }
        //console.log(maxScoreMove)
        return { x: maxScoreMove.x, y: maxScoreMove.y}
    }
    filterTheBest(arr) {
        let maxScore = null
        for(let i = 0; i < arr.length; i++) {
            if(i === 0) {
                maxScore = arr[i].score
            } else if(arr[i].score > maxScore) {
                maxScore = arr[i].score
            }
        }
        const maxScoreMoves = arr.filter(function(element) {
            return element.score === maxScore
        })
        return maxScoreMoves[Math.floor(Math.random() * maxScoreMoves.length)]
    }
    evaluateMove(cell, state) {
        const arr = [
            [120, -20, 20, 5, 5, 20, -20, 120],
            [-20, -40, -5, -5, -5, -5, -40, -20],
            [20, -5, 15, 3, 3, 15, -5, 20],
            [5, -5, 3, 3, 3, 3, -5, 5],
            [5, -5, 3, 3, 3, 3, -5, 5],
            [20, -5, 15, 3, 3, 15, -5, 20],
            [-20, -40, -5, -5, -5, -5, -40, -20],
            [120, -20, 20, 5, 5, 20, -20, 120]
        ]
        let score = 150
        let enemyState = state.makeMove(cell.x, cell.y)
        let enemyPossibleMoves = enemyState.getPossibleMoves()
        for(let i = 0; i < enemyPossibleMoves.length; i++) {
            let myState = enemyState.makeMove(enemyPossibleMoves[i].x, enemyPossibleMoves[i].y)
            let possibleMoves = myState.getPossibleMoves()
            for(let j = 0; j < possibleMoves.length; j++) {
                if(i === 0 && score > arr[possibleMoves[j].y][possibleMoves[j].x]) {
                    score = arr[possibleMoves[j].y][possibleMoves[j].x]
                } else if(i !== 0 && score > arr[possibleMoves[j].y][possibleMoves[j].x]) {
                    break;
                }
            }
        }
        return score
        /*let score = 0
        if(counter === 0) {
            return 0
        } else {
            score += state.predictMove(cell.x, cell.y).length
            let enemyState = state.makeMove(cell.x, cell.y)
            let enemyPossibleMoves = enemyState.getPossibleMoves()
            score -= enemyPossibleMoves.length
            for(let i = 0; i < enemyPossibleMoves.length; i++) {
                if(enemyState.board.isCorner(enemyPossibleMoves[i].x, enemyPossibleMoves[i].y)) {
                    score -= 10000
                }
                score -= enemyState.predictMove(enemyPossibleMoves[i].x, enemyPossibleMoves[i].y).length
                let myState = enemyState.makeMove(enemyPossibleMoves[i].x, enemyPossibleMoves[i].y)
                let possibleMoves = myState.getPossibleMoves()
                for(let j = 0; j < possibleMoves.length; j++) {
                    score += this.evaluateMove(possibleMoves[j], myState, counter - 1)
                }
            }
            return score
        }*/
    }
    couldForceCorner(enemyState, counter) {
        if(counter === 0) {
            return false
        } else {
            if(enemyState.getPossibleMoves().length !== 0) {
                let enemyPossibleMoves = enemyState.getPossibleMoves()
                for(let i = 0; i < enemyPossibleMoves.length; i++) {
                    if(enemyState.board.isCorner(enemyPossibleMoves[i].x, enemyPossibleMoves[i].y)) {
                        return false
                    } else {
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
        return new UltraBot(this.name, this.color);
    }
}