import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props){
    return(
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component{

    renderSquare(i){
        return( 
            <Square 
                value = {this.props.squares[i]} 
                onClick = {() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
          <div>
            <div className="board-row">
              {this.renderSquare(0)}
              {this.renderSquare(1)}
              {this.renderSquare(2)}
            </div>
            <div className="board-row">
              {this.renderSquare(3)}
              {this.renderSquare(4)}
              {this.renderSquare(5)}
            </div>
            <div className="board-row">
              {this.renderSquare(6)}
              {this.renderSquare(7)}
              {this.renderSquare(8)}
            </div>
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
          squares: Array(9).fill(null),
        }
      ],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step,move) => {
      const desc = move ?
        "Go to move #" + move :
        "Go to start";
      return (
        <li key= {move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );  
    });

    let status;
    if(winner){
      status = 'Winner: ' + winner;
    }
    else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (      
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();  
    
    if(calculateWinner(squares) || squares[i]){
        return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
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
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares){
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
    for (let i = 0; i < lines.length; i++){
        const [a, b, c] = lines[i];
        if( squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return squares[a];
        }
    }
    return null;
}

//===========================================================================
function isHorizontalWinner(squares, i){
  if(squares[i+1] && squares[i+2] && squares[i]===squares[i+1] && squares[i]===squares[i+2]){
    let temp = [i, i+1, i+2];
    return temp;
  }
  return null;
}

function isVerticalWinner(squares, i){
  if(squares[i+5] && squares[i+5*2] && squares[i]===squares[i+5] && squares[i]===squares[i+2*5]){
    return [i, i+5, i+5*2];
  }
  return null;
}

function isDiagonalWinner(squares, i){
  // top right
  if(squares[i-4] && squares[i-4*2] && squares[i]===squares[i-4] && squares[i]===squares[i-4*2]){
    return [i, i-4, i-4*2];
  }
  // bot right
  if(squares[i+6] && squares[i+6*2] && squares[i]===squares[i+6] && squares[i]===squares[i+6*2]){
    return [i, i+6, i+6*2];
  }
  // top left
  if(squares[i-6] && squares[i-6*2] && squares[i]===squares[i-6] && squares[i]===squares[i-6*2]){
    return [i, i-6, i-6*2];
  }
  // bot left
  if(squares[i+4] && squares[i+4*2] && squares[i]===squares[i+4] && squares[i]===squares[i+4*2]){
    return [i, i+4, i+4*2];
  }
  return null;
}




//==============================
function isHorizontalWinner(squares, i){
  if(squares[i+1] && squares[i+2] && squares[i]===squares[i+1] && squares[i]===squares[i+2]){
    return i;
  }
  return null;
}

function isVerticalWinner(squares, i){
  if(squares[i+5] && squares[i+5*2] && squares[i]===squares[i+5] && squares[i]===squares[i+2*5]){
    return i;
  }
  return null;
}

function isDiagonalWinner(squares, i){
  // top right
  if(squares[i-4] && squares[i-4*2] && squares[i]===squares[i-4] && squares[i]===squares[i-4*2]){
    return i;
  }
  // bot right
  if(squares[i+6] && squares[i+6*2] && squares[i]===squares[i+6] && squares[i]===squares[i+6*2]){
    return i;
  }
  // top left
  if(squares[i-6] && squares[i-6*2] && squares[i]===squares[i-6] && squares[i]===squares[i-6*2]){
    return i;
  }
  // bot left
  if(squares[i+4] && squares[i+4*2] && squares[i]===squares[i+4] && squares[i]===squares[i+4*2]){
    return i;
  }
  return null;
}

function calculateWinner(squares){
  // let paths = [];

  for (let i = 0; i < squares.length; i++){
    if(squares[i]){
      // paths.push(isHorizontalWinner(squares,i));
      // paths.push(isVerticalWinner(squares,i));
      // paths.push(isDiagonalWinner(squares,i));
      // return [paths,squares[i]];
      if(isHorizontalWinner(squares,i)){ return isHorizontalWinner(squares,i); }
      if(isVerticalWinner(squares,i)){ return isVerticalWinner(squares,i); }
      if(isDiagonalWinner(squares,i)){ return isDiagonalWinner(squares,i); } 
    }
  }
  return null;
}

// function highlightPath(squares, status, moves){

//   let i = calculateWinner(squares);
//   let arr = []
//   if(squares[i+1] && squares[i+2] && squares[i]===squares[i+1] && squares[i]===squares[i+2]){
//     arr.push(i).push(i+1).push(i+2);
//   }

//   return (      
//     <div className="game">
//       <div className="game-board">
//         <Board 
//           squares = {current.squares}
//           onClick = {(i) => this.handleClick(i)}
//         />
//       </div>
//       <div className="game-info">
//         <div>{status}</div>
//         <ol>{moves}</ol>
//       </div>
//     </div>
//   );

// }