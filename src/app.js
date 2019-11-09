import { HumanPlayer } from "./bot/HumanPlayer";
import { RandomBot } from "./bot/RandomBot";
import { Othello } from "./game/Othello";

const players = [
    new HumanPlayer("A", "black"),
    new RandomBot("B", "white")
];

async function main() {
    const game = new Othello(players);

    try {
        await game.play();
    } catch (error) {
        alert("An error occurred, check the console...");

        throw error;
    }
}

window.onload = main;
