import React from "react";
import { Board } from "./Board";
import { ScoreBoard } from "./ScoreBoard";

export class OthelloUI extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const game = this.props.game;
        const state = game.getCurrentState();

        return (
            <div>
                <h1 id="title">Othello Battle</h1>
                <ScoreBoard state={ state }/>
                <Board state={ state }/>
                <div>
                    <input style={ { width: "80%" } }
                           type="range" min="0" max={ game._states.length - 1 }
                           value={ game.getCurrentTurn() }
                           onChange={ event => game.setTurn(parseInt(event.target.value, 10)) }/>
                </div>
            </div>
        );
    }
}
