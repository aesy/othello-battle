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
                console.log('isCorner')
                return { x: possibleMoves[i].x, y: possibleMoves[i].y }
            }
        }
        const arr = []
        for(let i = 0; i < possibleMoves.length; i++) {
            if(this.couldForceCorner(state.makeMove(possibleMoves[i].x, possibleMoves[i].y), 2)) {
                console.log(possibleMoves[i].x, possibleMoves[i].y, ' could')
                arr.push({x: possibleMoves[i].x, y: possibleMoves[i].y})
            }
        }
        if(arr.length !== 0) {
            for(let i = 0; i < arr.length; i++) {
                arr[i].score = this.evaluateMove(arr[i], state, 1)
            }
            console.log(arr)
            const theBest = this.filterTheBest(arr)
            console.log(theBest)
            return { x: theBest.x, y: theBest.y }
        }
        console.log('couldnt')
        /*for(let i = 0; i < possibleMoves.length; i++) {
            if(state.makeMove(possibleMoves[i].x, possibleMoves[i].y).getPossibleMoves().length === 0) {
                console.log('hindersEnemyMoves')
                return { x: possibleMoves[i].x, y: possibleMoves[i].y }
            }
        }*/
        /*for(let i = 0; i < possibleMoves.length; i++) {
            if(this.isAdjacentToSelfsCorner(possibleMoves[i], state)) {
                if(!this.selfHindering(possibleMoves[i], state)) {
                    //console.log('isAdjacentToSelfsCorner')
                    return { x: possibleMoves[i].x, y: possibleMoves[i].y }
                }   
            }
        }*/
        for(let i = 0; i < possibleMoves.length; i++) {
            arr.push({x: possibleMoves[i].x, y: possibleMoves[i].y, score: this.evaluateMove(possibleMoves[i], state, 1)})
        }
        console.log(arr)
        const maxScoreMove = this.filterTheBest(arr)
        console.log(maxScoreMove)
        return { x: maxScoreMove.x, y: maxScoreMove.y}
        state.is
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
    /*preventsEnemyCorner(enemyState) {
        if(enemyState.getPossibleMoves().length !== 0) {
            let enemyPossibleMoves = enemyState.getPossibleMoves()
            for(let i = 0; i < enemyPossibleMoves.length; i++) {
                if(enemyState.board.isCorner(enemyPossibleMoves[i].x, enemyPossibleMoves[i].y)) {
                    return false
                }
            }
        }
        return true
    }*/
    evaluateMove(cell, state, counter) {
        let score = 0
        if(counter === 0) {
            return 0
        } else {
            //let selfScore = state.predictMove(cell.x, cell.y).length
            score += state.predictMove(cell.x, cell.y).length
            //console.log(score)
            let enemyState = state.makeMove(cell.x, cell.y)
            let enemyPossibleMoves = enemyState.getPossibleMoves()
            //let enemyScore = enemyPossibleMoves.length
            score -= enemyPossibleMoves.length
            //console.log(score)
            for(let i = 0; i < enemyPossibleMoves.length; i++) {
                if(enemyState.board.isCorner(enemyPossibleMoves[i].x, enemyPossibleMoves[i].y)) {
                    score -= 10000
                    //console.log(score)
                }
                score -= enemyState.predictMove(enemyPossibleMoves[i].x, enemyPossibleMoves[i].y).length
                //console.log(score)
                let myState = enemyState.makeMove(enemyPossibleMoves[i].x, enemyPossibleMoves[i].y)
                let possibleMoves = myState.getPossibleMoves()
                //console.log(score)
                for(let j = 0; j < possibleMoves.length; j++) {
                    score += this.evaluateMove(possibleMoves[j], myState, counter - 1)
                    //console.log(score)
                }
            }
            return score
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
        if((this.isGoodLeft || this.isGoodRight) && (this.isGoodUp || this.isGoodDown) && (this.isGoodLeftUp || this.isGoodRightDown) && (this.isGoodDownLeft || this.isGoodUpRight)) {
            return 1
        } else {
            return 0
        }
    }
    isGoodLeft(cell, enemyState) {
       let toLeft = 1
        while(true) {
            const targetCell = enemyState.board.getCell(cell.x-toLeft, cell.y)
            if(!enemyState.board.isWithinBoard(targetCell.x, targetCell.y)) {
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
            if(!enemyState.board.isWithinBoard(targetCell.x, targetCell.y)) {
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
            if(!enemyState.board.isWithinBoard(targetCell.x, targetCell.y)) {
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
            if(!enemyState.board.isWithinBoard(targetCell.x, targetCell.y)) {
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
            if(!enemyState.board.isWithinBoard(targetCell.x, targetCell.y)) {
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
            if(!enemyState.board.isWithinBoard(targetCell.x, targetCell.y)) {
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
            if(!enemyState.board.isWithinBoard(targetCell.x, targetCell.y)) {
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
            if(!enemyState.board.isWithinBoard(targetCell.x, targetCell.y)) {
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
        return new MegaBot(this.name, this.color);
    }
}