import expect from "expect";
import { Board } from "../src/game/Board";
import { Disk } from "../src/game/Disk";
import { Direction } from "../src/game/Direction";

describe("Board#width", () => {
    it("should have correct size", () => {
        const board = new Board(4, 2);

        expect(board.width).toBe(4);
    });
});

describe("Board#height", () => {
    it("should have correct size", () => {
        const board = new Board(2, 6);

        expect(board.height).toBe(6);
    });
});

describe("Board#rows", () => {
    it("should have correct size", () => {
        const board = new Board(2, 6);

        expect(board.rows.length).toBe(6);

        for (const row of board.rows) {
            expect(row.length).toBe(2);
        }
    });
});

describe("Board#columns", () => {
    it("should have correct size", () => {
        const board = new Board(4, 3);

        expect(board.columns.length).toBe(4);

        for (const column of board.columns) {
            expect(column.length).toBe(3);
        }
    });
});

describe("Board#cells", () => {
    it("should have correct size", () => {
        const board = new Board(3, 5);

        expect(board.cells.length).toBe(3 * 5);
    });
});

describe("Board#isWithinBoard", () => {
    it("should return false if coordinates are negative", () => {
        const board = new Board(2, 2);

        expect(board.isWithinBoard(-1, 0)).toBeFalsy();
        expect(board.isWithinBoard(0, -1)).toBeFalsy();
    });

    it("should return false if coordinates are outisde board bounds", () => {
        const board = new Board(2, 2);

        expect(board.isWithinBoard(2, 1)).toBeFalsy();
        expect(board.isWithinBoard(1, 2)).toBeFalsy();
    });
});

describe("Board#isCorner", () => {
    it("should return true if coordinates are in corner", () => {
        const board = new Board(3, 3);

        expect(board.isCorner(0, 0)).toBeTruthy();
        expect(board.isCorner(0, 2)).toBeTruthy();
        expect(board.isCorner(2, 0)).toBeTruthy();
        expect(board.isCorner(2, 2)).toBeTruthy();
    });

    it("should return false if coordinates are not in corner", () => {
        const board = new Board(3, 3);

        expect(board.isCorner(1, 0)).toBeFalsy();
        expect(board.isCorner(1, 1)).toBeFalsy();
        expect(board.isCorner(2, 1)).toBeFalsy();
    });
});

describe("Board#isEdge", () => {
    it("should return true if coordinates are on edge", () => {
        const board = new Board(3, 3);

        expect(board.isEdge(0, 0)).toBeTruthy();
        expect(board.isEdge(1, 0)).toBeTruthy();
        expect(board.isEdge(2, 0)).toBeTruthy();
        expect(board.isEdge(2, 2)).toBeTruthy();
    });

    it("should return false if coordinates are not on edge", () => {
        const board = new Board(3, 3);

        expect(board.isEdge(1, 1)).toBeFalsy();
    });
});

describe("Board#getCornerCells", () => {
    it("should return four cells if board is of positive size", () => {
        const board = new Board(3, 3);

        expect(board.getCornerCells().length).toBe(4);
    });

    it("should return zero cells if board width or height is zero", () => {
        const board = new Board(0, 0);

        expect(board.getCornerCells().length).toBe(0);
    });
});

describe("Board#getEdgeCells", () => {
    it("should return all edge cells", () => {
        const board = new Board(3, 3);

        expect(board.getEdgeCells().length).toBe(3 * 3 - 1);
    });

    it("should return zero if width or height is zero", () => {
        const board = new Board(0, 0);

        expect(board.getEdgeCells().length).toBe(0);
    });
});

describe("Board#getEmptyCells", () => {
    it("should return all empty cells", () => {
        const board = new Board(3, 3)
            .putDisk(2, 2, new Disk("black"));

        expect(board.getEmptyCells().length).toBe(3 * 3 - 1);
    });
});

describe("Board#getFilledCells", () => {
    it("should return all filled cells of the given color", () => {
        const board = new Board(3, 3)
            .putDisk(1, 1, new Disk("black"))
            .putDisk(2, 2, new Disk("black"))
            .putDisk(0, 1, new Disk("white"));

        expect(board.getFilledCells("black").length).toBe(2);
        expect(board.getFilledCells("white").length).toBe(1);
    });

    it("should return all filled cells if color is not provided", () => {
        const board = new Board(3, 3)
            .putDisk(1, 1, new Disk("black"))
            .putDisk(0, 1, new Disk("white"));

        expect(board.getFilledCells().length).toBe(2);
    });
});

describe("Board#getAdjacentCell", () => {
    it("should return an adjacent cell of the given coordinates in the given direction", () => {
        const board = new Board(3, 3);
        const cell = board.getAdjacentCell(0, 0, Direction.EAST);

        expect(cell.x).toBe(1);
        expect(cell.y).toBe(0);
    });

    it("should return null if out of bounds", () => {
        const board = new Board(3, 3);
        const cell = board.getAdjacentCell(2, 2, Direction.SOUTH);

        expect(cell).toBeNull();
    });
});

describe("Board#getAdjacentCells", () => {
    it("should return all cells adjacent to the given coordinates", () => {
        const board = new Board(3, 3);
        const cells1 = board.getAdjacentCells(0 ,0);

        expect(cells1.length).toBe(3);

        const cells2 = board.getAdjacentCells(1 ,1);

        expect(cells2.length).toBe(3 * 3 - 1);
    });
});

describe("Board#putDisk", () => {
    it("should place a disk at a specific position", () => {
        const board = new Board(2, 2)
            .putDisk(0, 0, new Disk("white"));
        const cell = board.getCell(0, 0);

        expect(cell).toBeTruthy();
        expect(cell.disk).toBeTruthy();
        expect(cell.disk.color).toBe("white");
    });

    it("should replace any existing disk", () => {
        const board = new Board(2, 2)
            .putDisk(0, 0, new Disk("white"))
            .putDisk(0, 0, new Disk("black"));
        const cell = board.getCell(0, 0);

        expect(cell.disk.color).toBe("black");
    });

    it("should throw an error if coordinates are outside the board", () => {
        const board = new Board(2, 2);

        expect(() => {
            board.putDisk(-1, 0, new Disk("white"));
        }).toThrow();

        expect(() => {
            board.putDisk(1, 2, new Disk("white"));
        }).toThrow();
    });
});

describe("Board#clearCell", () => {
    it("should clear a cell, making it empty", () => {
        const board = new Board(1, 1)
            .putDisk(0, 0, new Disk("white"))
            .clearCell(0, 0);

        expect(board.getCell(0, 0).isEmpty()).toBeTruthy();
    });

    it("should not throw an error if cell is already empty", () => {
        new Board(1, 1)
            .clearCell(0, 0);
    });

    it("should throw an error if coordinates are outside the board", () => {
        const board = new Board(2, 2);

        expect(() => {
            board.clearCell(-1, 0);
        }).toThrow();

        expect(() => {
            board.clearCell(1, 2);
        }).toThrow();
    });
});

describe("Board#clone", () => {
    it("should return a new board object", () => {
        const board = new Board(1, 1);

        expect(board === board.clone()).toBeFalsy();
    });

    it("should return an identical board", () => {
        const board = Board.fromArray([
            [ null, "white", null ],
            [ null, "black", null ]
        ]);
        const clone = board.clone();

        for (const cell of board.cells) {
            if (cell.isEmpty()) {
                expect(clone.getCell(cell.x, cell.y).isEmpty()).toBeTruthy();
            } else {
                expect(clone.getCell(cell.x, cell.y).disk.color)
                    .toBe(board.getCell(cell.x, cell.y).disk.color);
            }
        }
    });
});

describe("Board.fromArray", () => {
    it("should return a board of correct size", () => {
        const board1 = Board.fromArray([]);

        expect(board1.width).toBe(0);
        expect(board1.height).toBe(0);

        const board2 = Board.fromArray([
            [ null, null, null ],
            [ null, null, null ],
            [ null, null, null ],
            [ null, null, null ]
        ]);

        expect(board2.width).toBe(3);
        expect(board2.height).toBe(4);
    });

    it("should return a board with disks", () => {
        const board = Board.fromArray([
            [ "white", "black", null ]
        ]);

        expect(board.getCell(0, 0).disk).toBeTruthy();
        expect(board.getCell(1, 0).disk).toBeTruthy();
        expect(board.getCell(2, 0).disk).toBeFalsy();
        expect(board.getCell(0, 0).disk.color).toBe("white");
        expect(board.getCell(1, 0).disk.color).toBe("black");
    });
});
