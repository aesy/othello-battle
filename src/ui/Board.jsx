import React from "react";

export class Board extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="board">
                { this.props.state.board.rows.map((row, index) => this.renderRow(row, index)) }
            </div>
        );
    }

    /**
     * @param {Cell[]} row
     * @param {number} index
     */
    renderRow(row, index) {
        return (
            <div className="row" key={ index }>
                { row.map(cell => this.renderCell(cell)) }
            </div>
        );
    }

    /**
     * @param {Cell} cell
     */
    renderCell(cell) {
        const isEmpty = cell.isEmpty();
        const isValid = isEmpty && this.props.state.isValidMove(cell.x, cell.y);

        return (
            <div className="cell" key={ cell.x + ":" + cell.y }>
                { !isEmpty && (
                    <div className={ "disk " + cell.disk.color }/>
                ) }

                { isValid && (
                    <div className="disk phantom"/>
                ) }
            </div>
        );
    }
}
