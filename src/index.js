import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props){
  const className = 'square' + (props.highlight ? ' highlight' : '');
  return(
    <button className={className} onClick={props.onClick}>
        {props.value}
    </button>
  )
}

class Board extends React.Component{

  renderSquare(i){
    const winLine = this.props.winLine;
    return( 
      <Square 
          key = {i}
          value = {this.props.squares[i]} 
          onClick = {() => this.props.onClick(i)}
          highlight = {winLine && winLine.includes(i)}
      />
    );
  }

  render() {
    let boardSquares = [];
    for(let row = 0; row < 5; row++){
      let boardRow = [];
      for(let col = 0; col < 5; col++){
        boardRow.push(<span key={(row * 5) + col}>{this.renderSquare((row * 5) + col)}</span>);
      }
      boardSquares.push(<div className="board-row" key={row}>{boardRow}</div>);
    }
 
    return (
      <div>
        {boardSquares}
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      history:[
        {
          squares: Array(25).fill(null),
        }
      ],
      xIsNext: true,
      stepNumber: 0,
      isAscending: true
    };
  }

  render() {
    const history = this.state.history;
    const stepNumber = this.state.stepNumber;
    const current = history[stepNumber];
    const winInfo = calculateWinner(current.squares);
    const winner = winInfo.winner;

    let moves = history.map((step,  move) => {
      const latestMoveSquare = step.latestMoveSquare;
      const col = latestMoveSquare % 5 + 1;
      const row = Math.floor(latestMoveSquare / 5) + 1;

      const desc = move ?
        "Go to move #" + move + ", location: (" + row + ", " + col + ")":
        "Go to start";
      return (
        <li key= {move}>
          <button
            className={move === stepNumber ? 'move-list-item-selected' : ''}
            onClick={() => this.jumpTo(move)}>{desc}
          </button>
        </li>
      );  
    });

    const isAscending = this.state.isAscending;
    if (!isAscending) {
      moves.reverse();
    } 

    let status;

    if(winner){
      status = 'Winner: ' + winner;
    }
    else{
      if(!current.squares.includes(null)){
        status = 'Drawing ';
      }
      else{
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }

    return (      
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
            winLine={winInfo.line}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.handleSortToggle()}>
            {isAscending ? 'descending' : 'ascending' }  
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();  
    
    if(calculateWinner(squares).winner || squares[i]){
        return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares,
          // Store the index of the latest moved square
          latestMoveSquare: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleSortToggle() {
    this.setState({
      isAscending: !this.state.isAscending
    });
  }

}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

// ========================================

function calculateWinner(squares){
  const lines = [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24],
      [0, 5, 10, 15, 20],
      [1, 6, 11, 16, 21],
      [2, 7, 12, 17, 22],
      [3, 8, 13, 18, 23],
      [4, 9, 14, 19, 24],
      [0, 6, 12, 18, 24],
      [4, 8, 12, 16, 20],
  ];
  for (let i = 0; i < lines.length; i++){
      const [a, b, c, d, e] = lines[i];
      if( squares[a]&& squares[a] === squares[b] && squares[a] === squares[c] 
        && squares[a] === squares[d] && squares[a] === squares[e])
      {
          return{
            winner: squares[a],
            line: lines[i],
          };
      }
  }
  return {
    winner: null,
  };
}