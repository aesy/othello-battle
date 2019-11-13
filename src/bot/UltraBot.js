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
                prioArr[i].score = this.evaluateMove([prioArr[i]], state)[0].score
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
                prioArr.push({x: possibleMoves[i].x, y: possibleMoves[i].y, score: this.evaluateMove([possibleMoves[i]], state)[0].score})
            } else if(!givesAwayCornerFirstTurn) {
                arr.push({x: possibleMoves[i].x, y: possibleMoves[i].y, score: this.evaluateMove([possibleMoves[i]], state)[0].score})
            } else {
                sadArr.push({x: possibleMoves[i].x, y: possibleMoves[i].y, score: this.evaluateMove([possibleMoves[i]], state)[0].score})
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
        //console.log(arr)
        let maxScore = null
        for(let i = 0; i < arr.length; i++) {
            if(i === 0) {
                maxScore = arr[i].score
            } else if(arr[i].score < maxScore) {
                maxScore = arr[i].score
            }
        }
        const maxScoreMoves = arr.filter(function(element) {
            return element.score === maxScore
        })
        return maxScoreMoves[Math.floor(Math.random() * maxScoreMoves.length)]
    }
    evaluateMove(possibleMoves, state) {
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
        const bestMoves = []
        for(let i = 0; i < possibleMoves.length; i++) {
            let maxScore = 0
            const flipped = state.predictMove(possibleMoves[i].x, possibleMoves[i].y)
            const enemyState = state.makeMove(possibleMoves[i].x, possibleMoves[i].y)
            const enemyPMs = enemyState.getPossibleMoves()
            for(let j = 0; j < enemyPMs.length; j++) {
                if(i !== 0 && bestMoves[0].score < arr[enemyPMs[j].y][enemyPMs[j].x]) {
                    break;
                } else if(j === 0) {
                    maxScore = arr[enemyPMs[j].y][enemyPMs[j].x]
                } else if(maxScore < arr[enemyPMs[j].y][enemyPMs[j].x]) {
                    maxScore = arr[enemyPMs[j].y][enemyPMs[j].x]
                }
            }
            for(let i = 0; i < flipped.length; i++) {
                maxScore -= this.isStable(flipped[i], enemyState)
                maxScore -= arr[flipped[i].y][flipped[i].x]
            }
            if(i === 0) {
                bestMoves.push({cell: possibleMoves[i], score: maxScore})
            } else if(bestMoves[0].score === maxScore) {
                bestMoves.push({cell: possibleMoves[i], score: maxScore})
            } else if(bestMoves[0].score > maxScore) {
                bestMoves.splice(0, bestMoves.length)
                bestMoves.push({cell: possibleMoves[i], score: maxScore})
            }
        }
        return bestMoves
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
    isStable(cell, enemyState) {
        if((this.isGoodLeft(cell, enemyState) || this.isGoodRight(cell, enemyState)) && (this.isGoodUp(cell, enemyState) || this.isGoodDown(cell, enemyState)) && (this.isGoodLeftUp(cell, enemyState) || this.isGoodRightDown(cell, enemyState)) && (this.isGoodDownLeft(cell, enemyState) || this.isGoodUpRight(cell, enemyState))) {
            return 33
        } else {
            return 0
        }
    }
    isGoodLeft(cell, enemyState) {
       let toLeft = 1
        while(true) {
            const targetCell = enemyState.board.getCell(cell.x-toLeft, cell.y)
            if(targetCell === null) {
                return true
            } else if(targetCell.isEmpty()) {
                return false
            } else if(targetCell.disk.color !== this.color) {
                return false
            } else {
                toLeft += 1
            }
        }
    }
    isGoodRight(cell, enemyState) {
        let toRight = 1
        while(true) {
            const targetCell = enemyState.board.getCell(cell.x+toRight, cell.y)
            if(targetCell === null) {
                return true
            } else if(targetCell.isEmpty()) {
                return false
            } else if(targetCell.disk.color !== this.color) {
                return false
            } else {
                toRight += 1
            }
        }
    }
    isGoodUp(cell, enemyState) {
        let toUp = 1
        while(true) {
            const targetCell = enemyState.board.getCell(cell.x, cell.y-toUp)
            if(targetCell === null) {
                return true
            } else if(targetCell.isEmpty()) {
                return false
            } else if(targetCell.disk.color !== this.color) {
                return false
            } else {
                toUp += 1
            }
        }
    }
    isGoodDown(cell, enemyState) {
        let toDown = 1
        while(true) {
            const targetCell = enemyState.board.getCell(cell.x, cell.y+toDown)
            if(targetCell === null) {
                return true
            } else if(targetCell.isEmpty()) {
                return false
            } else if(targetCell.disk.color !== this.color) {
                return false
            } else {
                toDown += 1
            }
        }
    }
    isGoodLeftUp(cell, enemyState) {
        let toLeftUp = 1
        while(true) {
            const targetCell = enemyState.board.getCell(cell.x-toLeftUp, cell.y-toLeftUp)
            if(targetCell === null) {
                return true
            } else if(targetCell.isEmpty()) {
                return false
            } else if(targetCell.disk.color !== this.color) {
                return false
            } else {
                toLeftUp += 1
            }
        }
    }
    isGoodRightDown(cell, enemyState) {
        let toRightDown = 1
        while(true) {
            const targetCell = enemyState.board.getCell(cell.x+toRightDown, cell.y+toRightDown)
            if(targetCell === null) {
                return true
            } else if(targetCell.isEmpty()) {
                return false
            } else if(targetCell.disk.color !== this.color) {
                return false
            } else {
                toRightDown += 1
            }
        }
    }
    isGoodUpRight(cell, enemyState) {
        let toUpRight = 1
        while(true) {
            const targetCell = enemyState.board.getCell(cell.x+toUpRight, cell.y-toUpRight)
            if(targetCell === null) {
                return true
            } else if(targetCell.isEmpty()) {
                return false
            } else if(targetCell.disk.color !== this.color) {
                return false
            } else {
                toUpRight += 1
            }
        }
    }
    isGoodDownLeft(cell, enemyState) {
        let toDownLeft = 1
        while(true) {
            const targetCell = enemyState.board.getCell(cell.x-toDownLeft, cell.y+toDownLeft)
            if(targetCell === null) {
                return true
            } else if(targetCell.isEmpty()) {
                return false
            } else if(targetCell.disk.color !== this.color) {
                return false
            } else {
                toDownLeft += 1
            }
        }
    }
    clone() {
        return new UltraBot(this.name, this.color);
    }
}