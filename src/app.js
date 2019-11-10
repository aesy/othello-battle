import { HumanPlayer } from "./bot/HumanPlayer";
import { RandomBot } from "./bot/RandomBot";
import { OthelloGame } from "./game/OthelloGame";

const players = [
    new HumanPlayer("A", "black"),
    new RandomBot("B", "white")
];

async function main() {
    const game = new OthelloGame(players);

    try {
        await game.play();
    } catch (error) {
        alert("An error occurred, check the console...");

        throw error;
    }
}

window.onload = main;
