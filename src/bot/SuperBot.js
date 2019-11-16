import { Player } from "../game/Player";
import { State } from "../game/State";
import { Direction } from "../game/Direction";

export class SuperBot extends Player {
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
        for(let i = 0; i < possibleMoves.length; i++) {
            if(!this.selfHindering(possibleMoves[i], state)) {
                if(state.board.getEmptyCells().length > 5) {
                    console.log('length: higher than 5')
                    if(this.couldForceCorner(state.makeMove(possibleMoves[i].x, possibleMoves[i].y), 2)) {
                        console.log(possibleMoves[i].x, possibleMoves[i].y, ' could')
                        return { x: possibleMoves[i].x, y: possibleMoves[i].y }
                    } else {
                        console.log('couldnt')
                    }
                } else if (state.board.getEmptyCells().length > 2) {
                    console.log('length: higher than 2')
                    if(this.couldForceCorner(state.makeMove(possibleMoves[i].x, possibleMoves[i].y), 1)) {
                        console.log(possibleMoves[i].x, possibleMoves[i].y, ' could')
                        return { x: possibleMoves[i].x, y: possibleMoves[i].y }
                    } else {
                        console.log('couldnt')
                    }
                } else {
                    break;
                }
            }
        }
        for(let i = 0; i < possibleMoves.length; i++) {
            if(state.makeMove(possibleMoves[i].x, possibleMoves[i].y).getPossibleMoves().length === 0) {
                console.log('hindersEnemyMoves')
                return { x: possibleMoves[i].x, y: possibleMoves[i].y }
            }
        }
        for(let i = 0; i < possibleMoves.length; i++) {
            if(state.board.isEdge(possibleMoves[i].x, possibleMoves[i].y)) {
                if(this.isGoodEdge(possibleMoves[i], state)) {
                    console.log('isGoodEdge')
                    return { x: possibleMoves[i].x, y: possibleMoves[i].y }
                }
            }
        }
        for(let i = 0; i < possibleMoves.length; i++) {
            if(this.isAdjacentToSelfsCorner(possibleMoves[i], state)) {
                if(!this.selfHindering(possibleMoves[i], state)) {
                    console.log('isAdjacentToSelfsCorner')
                    return { x: possibleMoves[i].x, y: possibleMoves[i].y }
                }   
            }
        }
        for(let i = 0; i < possibleMoves.length; i++) {
            if(this.isCeiledbyEnemyDisks(possibleMoves[i], state)) {
                if(!this.selfHindering(possibleMoves[i], state)) {
                    console.log('isCeiledbyEnemyDisks')
                    return { x: possibleMoves[i].x, y: possibleMoves[i].y }
                } 
            }
        }
        return this.getOptimalMove(possibleMoves, state)

        
        /*for(i = 0; i < possibleMoves.length; i++) {
            if(state.board.isEdge(possibleMoves[i].x, possibleMoves[i].y) && possibleMoves[i].x == 0) {
                let error = false
                while(!error) {

                }
            }
        }
        for(let i = 0; i < possibleMoves.length; i++) {
            if(state.board.isEdge(possibleMoves[i].x, possibleMoves[i].y))
        }
        for(let i = 0; i < possibleMoves.length; i++) {
            if(state.board.isCorner(possibleMoves[i].x, possibleMoves[i].y)) {
                return { x: possibleMoves[i].x, y: possibleMoves[i].y }
            }
        }
        const possibleSurroundedMoves = []
        for(let i = 0; i < possibleMoves.length; i++) {
            let adjacentCells = state.board.getAdjacentCells(possibleMoves[i].x, possibleMoves[i].y)
            let error = false
            for(let j = 0; j < adjacentCells.length; j++) {
                if(adjacentCells[j].isEmpty()) {
                    error = true
                    break;
                }
            }
            if(error === false) {
                if(state.board.isEdge(possibleMoves[i].x, possibleMoves[i].y)) {
                    console.log({ x: possibleMoves[i].x, y: possibleMoves[i].y })
                    return { x: possibleMoves[i].x, y: possibleMoves[i].y }
                } else {
                    possibleSurroundedMoves.push(possibleMoves[i])
                }
            }
        }
        if(possibleSurroundedMoves.length !== 0) {
            console.log({ x: possibleSurroundedMoves[i].x, y: possibleSurroundedMoves[i].y })
            return { x: possibleSurroundedMoves[0].x, y: possibleSurroundedMoves[0].y }
        }
        for(let i = 0; i < cornerCells.length; i++) {
            let adjacentCells = state.board.getAdjacentCells(cornerCells[i].x, cornerCells[i].y)
            for(let j = 0; j < adjacentCells.length; j++) {
                if(possibleMoves.includes(adjacentCells[j])) {
                    possibleMoves.splice(possibleMoves.indexOf(adjacentCells[j]), 1)
                }
            }
        }
        for(i = 0; i < possibleMoves.length; i++) {
            if((possibleMoves[i].x == state.board.width-1 || possibleMoves[i].x == 0) && (possibleMoves[i].y == state.board.height-1 || possibleMoves[i].y == 0)) {
                return { x: possibleMoves[i].x, y: possibleMoves[i].y }
            } 
            flippedDiscs = state.predictMove(possibleMoves[i])
            for(j = 0; j < flippedDiscs.length; j++) {
                if(state.board.) {

                }
            }
            else if (state.predictMove(move) == sta) {

            }
        }

        const randomMove = possibleMoves[ Math.floor(Math.random() * possibleMoves.length) ]
        console.log({ x: randomMove.x, y: randomMove.y })
        return { x: randomMove.x, y: randomMove.y }*/
        
        
        
    }
    couldForceCorner(enemyState, counter) {
        console.log(counter)
        if(counter === 0) {
            console.log('count 0')
            return false
        } else {
            if(enemyState.getPossibleMoves().length !== 0) {
                //let counter = counter
                console.log(counter, 'lol')
                let enemyPossibleMoves = enemyState.getPossibleMoves()
                for(let i = 0; i < enemyPossibleMoves.length; i++) {
                    let myState = enemyState.makeMove(enemyPossibleMoves[i].x, enemyPossibleMoves[i].y)
                    console.log(counter, 'say')
                    if(myState.getPossibleMoves().length !== 0) {
                        let myPossibleMoves = myState.getPossibleMoves()
                        let givesAwayCorner = false
                        for(let j = 0; j < myPossibleMoves.length; j++) {
                            console.log(counter, 'wut')
                            if(myState.board.isCorner(myPossibleMoves[j].x, myPossibleMoves[j].y) && myState.board.getCell(myPossibleMoves[j].x, myPossibleMoves[j].y).isEmpty()) {
                                console.log(counter, 'isEmptyCornerInForced')
                                givesAwayCorner = true
                                break;
                            }
                        }
                        if(!givesAwayCorner) {
                            for(let j = 0; j < myPossibleMoves.length; j++) {
                                if(this.couldForceCorner(myState.makeMove(myPossibleMoves[j].x, myPossibleMoves[j].y), counter - 1)) {
                                    console.log(counter, 'couldCornerInForced')
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
                            console.log(counter, 'couldCornerInForced')
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
                            console.log(counter, 'isEmptyCornerInForced')
                            givesAwayCorner = true
                            break;
                        }
                    }
                    if(!givesAwayCorner) {
                        for(let j = 0; j < myPossibleMoves.length; j++) {
                            if(this.couldForceCorner(myState.makeMove(myPossibleMoves[j].x, myPossibleMoves[j].y), counter - 1)) {
                                console.log(count, 'couldCornerInForced')
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
    isGoodEdge(cell, state) {
        if(cell.y == 0 || cell.y == state.board.height - 1) {
            if(this.isGoodToWest(cell, state) || this.isGoodToEast(cell, state)) {
                return true
            } else {
                return false
            } 
        } else if(cell.x == 0 || cell.x == state.board.width - 1) {
            if(this.isGoodToNorth(cell, state) || this.isGoodToSouth(cell, state)) {
                return true
            } else {
                return false
            }
        }
    }
    isGoodToNorth(cell, state) {
        let steps = 1
        while(true) {
            if(state.board.getCell(cell.x, cell.y-steps).isEmpty()) {
                return false
            } else if(!state.predictMove(cell.x, cell.y).includes(state.board.getCell(cell.x, cell.y-steps)) && state.board.getCell(cell.x, cell.y-steps).disk.color !== this.color) {
                return false
            } else if(state.board.isCorner(cell.x, cell.y-steps)) {
                return true
            } else {
                steps += 1
            }
        }
    }
    isGoodToSouth(cell, state) {
        let steps = 1
        while(true) {
            if(state.board.getCell(cell.x, cell.y+steps).isEmpty()) {
                return false
            } else if(!state.predictMove(cell.x, cell.y).includes(state.board.getCell(cell.x, cell.y+steps)) && state.board.getCell(cell.x, cell.y+steps).disk.color !== this.color) {
                return false
            } else if(state.board.isCorner(cell.x, cell.y+steps)) {
                return true
            } else {
                steps += 1
            }
        }
    }
    isGoodToWest(cell, state) {
        let steps = 1
        while(true) {
            if(state.board.getCell(cell.x-steps, cell.y).isEmpty()) {
                return false
            } else if(!state.predictMove(cell.x, cell.y).includes(state.board.getCell(cell.x-steps, cell.y)) && state.board.getCell(cell.x-steps, cell.y).disk.color !== this.color) {
                return false
            } else if(state.board.isCorner(cell.x-steps, cell.y)) {
                return true
            } else {
                steps += 1
            }
        }
    }
    isGoodToEast(cell, state) {
        let steps = 1
        while(true) {
            if(state.board.getCell(cell.x+steps, cell.y).isEmpty()) {
                return false
            } else if(!state.predictMove(cell.x, cell.y).includes(state.board.getCell(cell.x+steps, cell.y)) && state.board.getCell(cell.x+steps, cell.y).disk.color !== this.color) {
                return false
            } else if(state.board.isCorner(cell.x+steps, cell.y)) {
                return true
            } else {
                steps += 1
            }
        }
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
            console.log('maxScoreMoves' + maxScoreMoves.length)
            return maxScoreMoves[Math.floor(Math.random() * maxScoreMoves.length)].cell
        } else if(maxScoreHinderedMoves.length > 0) { 
            console.log('maxScoreHinderedMoves' + maxScoreHinderedMoves.length)
            return maxScoreHinderedMoves[Math.floor(Math.random() * maxScoreHinderedMoves.length)].cell
        } else if(maxScoreCornerAdjacentMoves.length > 0) {
            console.log('maxScoreCornerAdjacentMoves' + maxScoreCornerAdjacentMoves.length)
            return maxScoreCornerAdjacentMoves[Math.floor(Math.random() * maxScoreCornerAdjacentMoves.length)].cell
        } else {
            console.log('bajs')
            return(possibleMoves[Math.floor(Math.random() * possibleMoves.length)])
        }
    }
    isCeiledbyEnemyDisks(cell, state) {
        if(this.ceiledOnN(cell, state) && this.ceiledOnNE(cell, state) && this.ceiledOnE(cell, state) && this.ceiledOnSE(cell, state) && this.ceiledOnS(cell, state) && this.ceiledOnSW(cell, state) && this.ceiledOnW(cell, state) && this.ceiledOnNW(cell, state)) {
            return true
        } else {
            return false
        }
    }
    ceiledOnN(cell, state) {
        let steps = 1
        while(true) {
            if(state.board.getCell(cell.x, cell.y-steps) == null) {
                return true
            } else if(state.board.getCell(cell.x, cell.y-steps).isEmpty()) {
                return false
            } else if(state.board.getCell(cell.x, cell.y-steps).disk.color !== this.color) {
                return true
            } else {
                steps += 1
            }
        }
    }
    ceiledOnNE(cell, state) {
        let steps = 1
        while(true) {
            if(state.board.getCell(cell.x+steps, cell.y-steps) == null) {
                return true
            } else if(state.board.getCell(cell.x+steps, cell.y-steps).isEmpty()) {
                return false
            } else if(state.board.getCell(cell.x+steps, cell.y-steps).disk.color !== this.color) {
                return true
            } else {
                steps += 1
            }
        }
    }
    ceiledOnE(cell, state) {
        let steps = 1
        while(true) {
            if(state.board.getCell(cell.x+steps, cell.y) == null) {
                return true
            } else if(state.board.getCell(cell.x+steps, cell.y).isEmpty()) {
                return false
            } else if(state.board.getCell(cell.x+steps, cell.y).disk.color !== this.color) {
                return true
            } else {
                steps += 1
            }
        }
    }
    ceiledOnSE(cell, state) {
        let steps = 1
        while(true) {
            if(state.board.getCell(cell.x+steps, cell.y+steps) == null) {
                return true
            } else if(state.board.getCell(cell.x+steps, cell.y+steps).isEmpty()) {
                return false
            } else if(state.board.getCell(cell.x+steps, cell.y+steps).disk.color !== this.color) {
                return true
            } else {
                steps += 1
            }
        }
    }
    ceiledOnS(cell, state) {
        let steps = 1
        while(true) {
            if(state.board.getCell(cell.x, cell.y+steps) == null) {
                return true
            } else if(state.board.getCell(cell.x, cell.y+steps).isEmpty()) {
                return false
            } else if(state.board.getCell(cell.x, cell.y+steps).disk.color !== this.color) {
                return true
            } else {
                steps += 1
            }
        }
    }
    ceiledOnSW(cell, state) {
        let steps = 1
        while(true) {
            if(state.board.getCell(cell.x-steps, cell.y+steps) == null) {
                return true
            } else if(state.board.getCell(cell.x-steps, cell.y+steps).isEmpty()) {
                return false
            } else if(state.board.getCell(cell.x-steps, cell.y+steps).disk.color !== this.color) {
                return true
            } else {
                steps += 1
            }
        }
    }
    ceiledOnW(cell, state) {
        let steps = 1
        while(true) {
            if(state.board.getCell(cell.x-steps, cell.y) == null) {
                return true
            } else if(state.board.getCell(cell.x-steps, cell.y).isEmpty()) {
                return false
            } else if(state.board.getCell(cell.x-steps, cell.y).disk.color !== this.color) {
                return true
            } else {
                steps += 1
            }
        }
    }
    ceiledOnNW(cell, state) {
        let steps = 1
        while(true) {
            if(state.board.getCell(cell.x-steps, cell.y-steps) == null) {
                return true
            } else if(state.board.getCell(cell.x-steps, cell.y-steps).isEmpty()) {
                return false
            } else if(state.board.getCell(cell.x-steps, cell.y-steps).disk.color !== this.color) {
                return true
            } else {
                steps += 1
            }
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
        return new SuperBot(this.name, this.color);
    }
}
