import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  if (props.winning) {
    return (
      <button 
      className="square winning"
      onClick= {props.onClick}> 
        {props.value}
      </button>
    );
  } else {
    return (
        <button 
        className="square"
        onClick= {props.onClick}> 
          {props.value}
        </button>
    );
  }
}
// onClick in renderSquare is only a passed property to a react component, not an action of the HTML object
// onClick in Square() is an action of the HTML object
  
  class Board extends React.Component {

    renderSquare(i, winning) {
      return <Square value={this.props.squares[i]} onClick={ () => this.props.onClick(i) } key={i} winning={winning}/>;
    }

    renderRow(i) {
      const winningMoves = this.props.winningMoves;
      const squareIndices = [i*3, i*3+1, i*3+2];
      const squaresInARow = squareIndices.map((squareIndex) => {
        const winning = winningMoves.includes(squareIndex);
        return this.renderSquare(squareIndex, winning);
      })
      return (
        <div className="board-row" key={i}>
          {squaresInARow}
        </div>
      )
    }
  
    render() {
      const rowIndices = [0,1,2];
      const rows = rowIndices.map((rowIndex) => {
        return this.renderRow(rowIndex);
      })
      return (
        <div>
          {rows}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          history: 
          [{
            squares: Array(9).fill(null),
            movePosition: {x: null, y: null}
          }],
          xIsNext: true,
          stepNumber: 0,
          toggled: false,
          winningMoves: [null, null, null]
      };
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length-1];
      const squares = current.squares.slice();
      const {winner} = calculateWinner(squares);
      if (winner) {
        return
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      const {a, b, c} = calculateWinner(squares);
      this.setState({
        history: history.concat([{
          squares, movePosition: {x: i - Math.round(i/3) * 3 + 4, y: Math.round(i/3)}
        }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
        winningMoves: [a,b,c]
      });
    }

    jumpTo(index) {
      this.setState({
        stepNumber: index,
        xIsNext: (index % 2 === 0)
      })
    }

    toggle() {
      this.setState({
        toggled: !this.state.toggled
      })
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const {winner} = calculateWinner(current.squares);

      let moves
      let movesHistory
      if (this.state.toggled) {
        movesHistory = history.reverse();
      } else {
        movesHistory = history.slice();
      }
      moves = movesHistory.map((situation, index) => {
        if (this.state.toggled) {
          index = history.length - 1 - index
        }
        let {x, y} = situation.movePosition
        let buttonText = index ? `Go to move # ${index} (${x}, ${y})` : "Go to game start";
        if (index === history.length - 1) {
          return (
            <li key={index}>
              <button onClick={() => this.jumpTo(index)} disabled>{buttonText}</button>
            </li>
          )
        } else {
          return (
            <li key={index}>
              <button onClick={() => this.jumpTo(index)}>{buttonText}</button>
            </li>
          )
        }
      })

      let status;
      if (winner) {
        status = `Winner: ${winner}`;
      } else if (!current.squares.includes(null)) {
        status = 'Tied!';
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} onClick={(i) => {this.handleClick(i)}} winningMoves={this.state.winningMoves}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <div><button onClick={() => {this.toggle()}}>Toggle Moves</button></div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {winner: squares[a], a, b, c};
      }
    }
    return {winner: null, a: null, b: null, c: null};
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  