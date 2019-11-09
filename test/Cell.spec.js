import expect from "expect";
import { Cell } from "../src/game/Cell";
import { Disk } from "../src/game/Disk";

describe("Cell#isEmpty", () => {
    it("should return true if disk is falsy", () => {
        const cell = new Cell(0, 0, null);

        expect(cell.isEmpty()).toBeTruthy();
    });

    it("should return false if disk is truty", () => {
        const cell = new Cell(0, 0, new Disk("white"));

        expect(cell.isEmpty()).toBeFalsy();
    });
});
