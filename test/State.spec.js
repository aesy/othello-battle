import expect from "expect";
import { Board } from "../src/game/Board";
import { Disk } from "../src/game/Disk";
import { Player } from "../src/game/Player";
import { State } from "../src/game/State";

describe("State#board", () => {
    it("should return a copy of the board", () => {
        const board = new Board(2, 3)
            .putDisk(1, 1, new Disk("green"));
        const state = new State(new Player("a", "b"), new Player("c", "d"), board);

        expect(state.board.width).toBe(2);
        expect(state.board.height).toBe(3);
        expect(state.board.getCell(1, 1).disk.color).toBe("green");
    });
});

describe("State#getCurrentPlayer", () => {
    it("should return a copy of the current player", () => {
        const currentPlayer = new Player("currentPlayer", "bl");
        const opponentPlayer = new Player("opponentPlayer", "wh");
        const state = new State(currentPlayer, opponentPlayer, new Board(0, 0));

        expect(state.getCurrentPlayer().name).toBe("currentPlayer");
        expect(state.getCurrentPlayer().color).toBe("bl");
    });
});

describe("State#getOpponentPlayer", () => {
    it("should return a copy of the opponent player", () => {
        const currentPlayer = new Player("currentPlayer", "bl");
        const opponentPlayer = new Player("opponentPlayer", "wh");
        const state = new State(currentPlayer, opponentPlayer, new Board(0, 0));

        expect(state.getOpponentPlayer().name).toBe("opponentPlayer");
        expect(state.getOpponentPlayer().color).toBe("wh");
    });
});

describe("State#rotatePlayers", () => {
    it("should swap players", () => {
        const currentPlayer = new Player("currentPlayer", "bl");
        const opponentPlayer = new Player("opponentPlayer", "wh");
        const state = new State(currentPlayer, opponentPlayer, new Board(0, 0))
            .rotatePlayers();

        expect(state.getCurrentPlayer().name).toBe("opponentPlayer");
    });
});

describe("State#getPossibleMoves", () => {
    it("should return all valid moves for the current player", () => {
        const board = Board.fromArray([
            [ null, null, null, null ],
            [ null, "bl", "wh", null ],
            [ null, "wh", "bl", null ],
            [ null, null, null, null ]
        ]);
        const state = new State(new Player("a", "wh"), new Player("b", "bl"), board);

        expect(state.isValidMove(1, 0)).toBeTruthy();
    });
});

describe("State#isValidMove", () => {
    it("should return true if the given coordinates are a valid move for the current player", () => {
         const board = Board.fromArray([
            [ "wh", null, "bl" ],
            [ "wh", "bl", "bl" ],
            [ "bl", "wh", "wh" ]
        ]);
        const state = new State(new Player("a", "wh"), new Player("b", "bl"), board);

        expect(state.isValidMove(1, 0)).toBeTruthy();
    });

    it("should return false if the given coordinates are invalid move for the current player", () => {
         const board = Board.fromArray([
            [ "wh", null, null ],
            [ "wh", null, null ],
            [ "bl", null, null ]
        ]);
        const state = new State(new Player("a", "wh"), new Player("b", "bl"), board);

        expect(state.isValidMove(2, 1)).toBeFalsy();
    });

    it("should return false if the given coordinates are out of bounds", () => {
        const state = new State(new Player("a", "wh"), new Player("b", "bl"), new Board(2, 2));

        expect(state.isValidMove(-1, 0)).toBeFalsy();
        expect(state.isValidMove(0, -1)).toBeFalsy();
        expect(state.isValidMove(1, 2)).toBeFalsy();
        expect(state.isValidMove(2, 1)).toBeFalsy();
    });
});

describe("State#predictMove", () => {
    it("should return an array of cells whose disk would get flipped if current player made a move at the given coordinates", () => {
        const board1 = Board.fromArray([
            [ null, null, null, null ],
            [ null, "bl", "wh", null ],
            [ null, "wh", "bl", null ],
            [ null, null, null, null ]
        ]);
        const state1 = new State(new Player("a", "wh"), new Player("b", "bl"), board1);
        const cells1 = state1.predictMove(2, 3);

        expect(cells1.length).toBe(1);
        expect(cells1[0].x).toBe(2);
        expect(cells1[0].y).toBe(2);

        const board2 = Board.fromArray([
            [ null, "wh", null, "wh" ],
            [ null, "bl", "bl", null ],
            [ null, null, "bl", "wh" ],
            [ null, null, null, null ]
        ]);
        const state2 = new State(new Player("a", "wh"), new Player("b", "bl"), board2);
        const cells2 = state2.predictMove(1, 2);

        expect(cells2.length).toBe(3);

        const board3 = Board.fromArray([
            [ null, "bl", "wh", null ],
            [ null, "bl", "bl", null ],
            [ null, "bl", null, null ],
            [ null, null, null, null ]
        ]);
        const state3 = new State(new Player("a", "wh"), new Player("b", "bl"), board3);
        const cells3 = state3.predictMove(2, 2);

        expect(cells3.length).toBe(1);
        expect(cells3[0].x).toBe(2);
        expect(cells3[0].y).toBe(1);
    });

    it("should throw if the given coordinates are invalid", () => {
         const board = Board.fromArray([
            [ null, null, null, null ],
            [ null, "bl", "wh", null ],
            [ null, "wh", "bl", null ],
            [ null, null, null, null ]
        ]);
        const state = new State(new Player("a", "wh"), new Player("b", "bl"), board);

        expect(() => {
            state.predictMove(3, 0);
        }).toThrow();
    });
});

describe("State#makeMove", () => {
    it("should apply the moves that was predicted", () => {
        const board = Board.fromArray([
            [ null, "wh", null, "wh" ],
            [ null, "bl", "bl", null ],
            [ null, null, "bl", "wh" ],
            [ null, null, null, null ]
        ]);
        const state = new State(new Player("a", "wh"), new Player("b", "bl"), board);
        const predicted = state.predictMove(1, 2);
        const newState = state.makeMove(1, 2);

        for (const cell of predicted) {
            expect(newState.board.getCell(cell.x, cell.y).disk.color).toBe("wh");
        }
    });

    it("should put a disk on the given coordinate", () => {
        const board = Board.fromArray([
            [ null, "bl", "wh" ],
            [ null, null, null ],
            [ null, null, null ]
        ]);
        const state = new State(new Player("a", "wh"), new Player("b", "bl"), board);
        const newState = state.makeMove(0, 0);

        expect(newState.board.getCell(0, 0).disk.color).toBe("wh");
    });

    it("should rotate the players", () => {
        const board = Board.fromArray([
            [ null, "wh", null ],
            [ null, "bl", null ],
            [ null, null, null ]
        ]);
        const state = new State(new Player("a", "wh"), new Player("b", "bl"), board)
            .makeMove(1, 2);

        expect(state.getCurrentPlayer().color).toBe("bl");
    });

    it("should throw if the given coordinates are invalid", () => {
        const board = Board.fromArray([
            [ null, null, null, null ],
            [ null, "bl", "wh", null ],
            [ null, "wh", "bl", null ],
            [ null, null, null, null ]
        ]);
        const state = new State(new Player("a", "wh"), new Player("b", "bl"), board);

        expect(() => {
            state.makeMove(0, 0);
        }).toThrow();
    });
});

describe("State#isGameOver", () => {
    it("should return true if board is full", () => {
        const board = Board.fromArray([
            [ "wh", "bl", "bl" ],
            [ "wh", "bl", "bl" ],
            [ "bl", "wh", "wh" ]
        ]);
        const state = new State(new Player("a", "wh"), new Player("b", "bl"), board);

        expect(state.isGameOver()).toBeTruthy();
    });

    it("should return true if board is empty", () => {
        const board = Board.fromArray([
            [ null, null, null ],
            [ null, null, null ],
            [ null, null, null ]
        ]);
        const state = new State(new Player("a", "wh"), new Player("b", "bl"), board);

        expect(state.isGameOver()).toBeTruthy();
    });

    it("should return true if both players can't move", () => {
        const board = Board.fromArray([
            [ "bl", "bl", "bl" ],
            [ null, null, null ],
            [ null, "wh", "wh" ]
        ]);
        const state = new State(new Player("a", "wh"), new Player("b", "bl"), board);

        expect(state.isGameOver()).toBeTruthy();
    });
});
