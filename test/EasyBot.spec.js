import expect from "expect";
import { EasyBot } from "../src/bot/EasyBot";
import { Board } from "../src/game/Board";

const bot = new EasyBot("A", "black");
const board = Board.fromArray([
    [ null, null, null, null, null ],
    [ null, null, null, null, null ],
    [ null, null, null, null, null ],
    [ null, null, null, null, null ],
    [ null, null, null, null, null ]
]);

describe("EasyBot#isAdjacentToEdge", () => {
    it("should return true if coords are adjacent to corner cell", () => {
        expect(bot.isAdjacentToEdge(board, 1, 1)).toBeTruthy();
        expect(bot.isAdjacentToEdge(board, 1, 2)).toBeTruthy();
        expect(bot.isAdjacentToEdge(board, 3, 3)).toBeTruthy();
    });

    it("should return false if coords are not adjacent to corner cell", () => {
        expect(bot.isAdjacentToEdge(board, 0, 0)).toBeFalsy();
        expect(bot.isAdjacentToEdge(board, 1, 0)).toBeFalsy();
        expect(bot.isAdjacentToEdge(board, 2, 2)).toBeFalsy();
    });
});

describe("EasyBot#isAdjacentToCorner", () => {
    it("should return true if coords are adjacent to edge cell", () => {
        expect(bot.isAdjacentToCorner(board, 1, 0)).toBeTruthy();
        expect(bot.isAdjacentToCorner(board, 1, 1)).toBeTruthy();
        expect(bot.isAdjacentToCorner(board, 3, 3)).toBeTruthy();
    });

    it("should return false if coords are not adjacent to edge cell", () => {
        expect(bot.isAdjacentToCorner(board, 0, 0)).toBeFalsy();
        expect(bot.isAdjacentToCorner(board, 2, 2)).toBeFalsy();
    });
});
