import React from "react";
import { Board } from "./Board";
import { ScoreBoard } from "./ScoreBoard";

export class OthelloUI extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1 id="title">Othello Battle</h1>
                <ScoreBoard state={ this.props.state }/>
                <Board state={ this.props.state }/>
            </div>
        );
    }
}
