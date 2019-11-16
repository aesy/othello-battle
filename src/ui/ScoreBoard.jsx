import React from "react";

export class ScoreBoard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const player1 = this.props.state.getCurrentPlayer();
        const player2 = this.props.state.getOpponentPlayer();
        const players = [ player1, player2 ].sort(this.sortByColor);

        return (
            <div id="scoreboard">
                { players.map(player => this.renderEntry(player)) }
            </div>
        );
    }

    /**
     * @param {Player} player
     */
    renderEntry(player) {
        const isActive = this.props.state.getCurrentPlayer().color === player.color;
        const score = this.props.state.board.getFilledCells(player.color).length;
        const gameOver = this.props.state.isGameOver();
        const isWinner = gameOver && score > this.props.state.board.getFilledCells().length / 2;

        return (
            <div className="entry" key={ player.name }>
                <span className={ "name " + (isActive && "active") }>
                    { player.name }
                </span>

                <span className={ "disk " + player.color }/>

                <span className="score">
                    { score }

                    { isWinner && (
                        <span className="crown">♚</span>
                    ) }
                </span>
            </div>
        );
    }

    /**
     * @param {Player} player1
     * @param {Player} player2
     * @returns {number}
     */
    sortByColor(player1, player2) {
        return player1.color < player2.color ? -1 : 1;
    }
}
