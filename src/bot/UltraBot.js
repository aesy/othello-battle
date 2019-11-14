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
        const firstStepFiltered = this.filterOnPreventsCorner(possibleMoves, state)
        const secondStepFiltered = this.filterOnTakesCorner(firstStepFiltered, state)
        const thirdStepFiltered = this.getMaxScoreMoves(secondStepFiltered, state)
        const selectedMove = thirdStepFiltered[Math.floor(Math.random() * thirdStepFiltered.length)]
        return selectedMove

        /*const prioArr = []
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
        console.log(maxScoreMove)
        return { x: maxScoreMove.x, y: maxScoreMove.y}*/
    }
    /*filterTheBest(arr) {
        console.log(arr)
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
    }*/
    getMaxScoreMoves(possibleMoves, state) {
        const maxScoreMoves = []
        let maxScore = null
        for(let i = 0; i < possibleMoves.length; i++) {
            let skip = false
            let totalMoveScore = null
            let myMoveScore = 0
            const myFlippedDisks = state.predictMove(possibleMoves[i].x, possibleMoves[i].y)
            //myMoveScore += myFlippedDisks.length
            myFlippedDisks.push(state.board.getCell(possibleMoves[i].x, possibleMoves[i].y))
            const enemyState = state.makeMove(possibleMoves[i].x, possibleMoves[i].y)
            myMoveScore += this.isStable(myFlippedDisks, enemyState)
            const enemyPossibleMoves = enemyState.getPossibleMoves()
            for(let j = 0; j < enemyPossibleMoves.length; j++) {
                let enemyMoveScore = 0
                const enemyFlippedDisks = enemyState.predictMove(enemyPossibleMoves[j].x, enemyPossibleMoves[j].y)
                enemyMoveScore += enemyFlippedDisks.length
                enemyMoveScore += enemyPossibleMoves.length
                enemyFlippedDisks.push(enemyState.board.getCell(enemyPossibleMoves[j].x, enemyPossibleMoves[j].y))
                enemyMoveScore += this.isStable(enemyFlippedDisks, enemyState.makeMove(enemyPossibleMoves[j].x, enemyPossibleMoves[j].y))
                if(j === 0) {
                    totalMoveScore = myMoveScore - enemyMoveScore
                } else if(i !== 0 && maxScore > myMoveScore - enemyMoveScore) {
                    skip = true
                    break;
                } else if(totalMoveScore > myMoveScore - enemyMoveScore) {
                    totalMoveScore = myMoveScore - enemyMoveScore
                }
            }
            if(!skip) {
                if(i === 0) {
                    maxScore = totalMoveScore
                    maxScoreMoves.push({x: possibleMoves[i].x, y: possibleMoves[i].y, score: totalMoveScore})
                } else if(maxScore < totalMoveScore) {
                    maxScore = totalMoveScore
                    maxScoreMoves.splice(0, maxScoreMoves.length, {x: possibleMoves[i].x, y: possibleMoves[i].y, score: totalMoveScore})
                } else if(maxScore === totalMoveScore) {
                    maxScoreMoves.push({x: possibleMoves[i].x, y: possibleMoves[i].y, score: totalMoveScore})
                }
            }
        }
        return maxScoreMoves
    }
    filterOnPreventsCorner(possibleMoves, state) {
        const filteredList = []
        for(let i = 0; i < possibleMoves.length; i++) {
            let canTakeCorner = false
            const enemyState = state.makeMove(possibleMoves[i].x, possibleMoves[i].y)
            const enemyPossibleMoves = enemyState.getPossibleMoves()
            for(let j = 0; j < enemyPossibleMoves.length; j++) {
                if(enemyState.board.isCorner(enemyPossibleMoves[j].x, enemyPossibleMoves[j].y)) {
                    canTakeCorner = true
                    break;
                } else if(this.couldForceCorner(enemyState.makeMove(enemyPossibleMoves[j].x, enemyPossibleMoves[j].y), 1)) {
                    canTakeCorner = true
                    break;
                }
            }
            if(!canTakeCorner) {
                filteredList.push({x: possibleMoves[i].x, y: possibleMoves[i].y})
            }
        }
        if(filteredList.length !== 0) {
            return filteredList
        } else {
            return possibleMoves
        }
    }
    filterOnTakesCorner(possibleMoves, state) {
        const filteredList = []
        for(let i = 0; i < possibleMoves.length; i++) {
            if(state.board.isCorner(possibleMoves[i].x, possibleMoves[i].y)) {
                filteredList.push({x: possibleMoves[i].x, y: possibleMoves[i].y})
            } else if(this.couldForceCorner(state.makeMove(possibleMoves[i].x, possibleMoves[i].y), 2)) {
                filteredList.push({x: possibleMoves[i].x, y: possibleMoves[i].y})
            }
            if(filteredList.length !== 0) {
                return filteredList
            } else {
                return possibleMoves
            }
        }
    }
    couldForceCorner(enemyState, counter) {
        if(counter === 0) {
            return false
        } else {
            if(enemyState.getPossibleMoves().length !== 0) {
                let enemyPossibleMoves = enemyState.getPossibleMoves()
                for(let i = 0; i < enemyPossibleMoves.length; i++) {
                    /*if(enemyState.board.isCorner(enemyPossibleMoves[i].x, enemyPossibleMoves[i].y)) {
                        return false
                    } else {*/
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
                    //}
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
    isStable(cells, enemyState) {
        let totalScore = 0
        for(let i = 0; i < cells.length; i++) {
            if(this.isHorisontallyStable(cells[i], enemyState) && this.isVerticallyStable(cells[i], enemyState) && this.isDescendinglyStable(cells[i], enemyState) && this.isAscendinglyStable(cells[i], enemyState)) {
                totalScore += 1
            }
        }
        return totalScore
    }
    isHorisontallyStable(cell, enemyState) {
       let west = 1
        while(true) {
            const targetCell = enemyState.board.getCell(cell.x-west, cell.y)
            if(targetCell === null) {
                return true
            } else if(targetCell.isEmpty()) {
                let east = 1
                while(true) {
                    const targetCell = enemyState.board.getCell(cell.x+east, cell.y)
                    if(targetCell === null) {
                        return true
                    } else if(targetCell.isEmpty()) {
                        return false
                    } else if(targetCell.disk.color !== this.color) {
                        return false
                    } else {
                        east += 1
                    }
                }
            } else if(targetCell.disk.color !== this.color) {
                let east = 1
                while(true) {
                    const targetCell = enemyState.board.getCell(cell.x+east, cell.y)
                    if(targetCell === null) {
                        return true
                    } else if(targetCell.isEmpty()) {
                        return false
                    } else if(targetCell.disk.color !== this.color) {
                        return false
                    } else {
                        east += 1
                    }
                }
            } else {
                west += 1
            }
        }
    }
    isVerticallyStable(cell, enemyState) {
        let north = 1
        while(true) {
            const targetCell = enemyState.board.getCell(cell.x, cell.y-north)
            if(targetCell === null) {
                return true
            } else if(targetCell.isEmpty()) {
                let south = 1
                while(true) {
                    const targetCell = enemyState.board.getCell(cell.x, cell.y+south)
                    if(targetCell === null) {
                        return true
                    } else if(targetCell.isEmpty()) {
                        return false
                    } else if(targetCell.disk.color !== this.color) {
                        return false
                    } else {
                        south += 1
                    }
                }
            } else if(targetCell.disk.color !== this.color) {
                let south = 1
                while(true) {
                    const targetCell = enemyState.board.getCell(cell.x, cell.y+south)
                    if(targetCell === null) {
                        return true
                    } else if(targetCell.isEmpty()) {
                        return false
                    } else if(targetCell.disk.color !== this.color) {
                        return false
                    } else {
                        south += 1
                    }
                }
            } else {
                north += 1
            }
        }
    }
    isDescendinglyStable(cell, enemyState) {
        let northWest = 1
        while(true) {
            const targetCell = enemyState.board.getCell(cell.x-northWest, cell.y-northWest)
            if(targetCell === null) {
                return true
            } else if(targetCell.isEmpty()) {
                let southEast = 1
                while(true) {
                    const targetCell = enemyState.board.getCell(cell.x+southEast, cell.y+southEast)
                    if(targetCell === null) {
                        return true
                    } else if(targetCell.isEmpty()) {
                        return false
                    } else if(targetCell.disk.color !== this.color) {
                        return false
                    } else {
                        southEast += 1
                    }
                }
            } else if(targetCell.disk.color !== this.color) {
                let southEast = 1
                while(true) {
                    const targetCell = enemyState.board.getCell(cell.x+southEast, cell.y+southEast)
                    if(targetCell === null) {
                        return true
                    } else if(targetCell.isEmpty()) {
                        return false
                    } else if(targetCell.disk.color !== this.color) {
                        return false
                    } else {
                        southEast += 1
                    }
                }
            } else {
                northWest += 1
            }
        }
    }
    isAscendinglyStable(cell, enemyState) {
        let northEast = 1
        while(true) {
            const targetCell = enemyState.board.getCell(cell.x+northEast, cell.y-northEast)
            if(targetCell === null) {
                return true
            } else if(targetCell.isEmpty()) {
                let southWest = 1
                while(true) {
                    const targetCell = enemyState.board.getCell(cell.x-southWest, cell.y+southWest)
                    if(targetCell === null) {
                        return true
                    } else if(targetCell.isEmpty()) {
                        return false
                    } else if(targetCell.disk.color !== this.color) {
                        return false
                    } else {
                        southWest += 1
                    }
                }
            } else if(targetCell.disk.color !== this.color) {
                let southWest = 1
                while(true) {
                    const targetCell = enemyState.board.getCell(cell.x-southWest, cell.y+southWest)
                    if(targetCell === null) {
                        return true
                    } else if(targetCell.isEmpty()) {
                        return false
                    } else if(targetCell.disk.color !== this.color) {
                        return false
                    } else {
                        southWest += 1
                    }
                }
            } else {
                northEast += 1
            }
        }
    }
    /*evaluateMove(possibleMoves, state) {
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
    }*/
    clone() {
        return new UltraBot(this.name, this.color);
    }
}