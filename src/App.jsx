import { useState } from 'react'



function Square( {value, onSquareClick} ) {
  return <button className="square" onClick={onSquareClick}>{value}</button>
}

function Board({squares, turno, onPlay, currentMove}) {
  const numbers = [1,2,3,4,5,6,7,8,9];
  let matchStatus;

  if (calculateWinner(squares)){
    matchStatus = "Ganador: " + calculateWinner(squares);
  } else {
    matchStatus = "Siguiente Jugador: " + (turno ? "O" : "X");
  }

  if (currentMove === 9 && !calculateWinner(squares)){
    matchStatus = "Empate"
  }


  function handleClick (turno, i){
    if (squares[i] || calculateWinner(squares)){
      return;
    }
    if (!turno) {
      const newSquares = squares.slice();
      newSquares[i] = "X";

      onPlay(newSquares);   
    } else {
      const newSquares = squares.slice();
      newSquares[i] = "O";

      onPlay(newSquares);   
    }
    //setTurno(!turno);
  }

  const buttonSquares = numbers.map((x) => {
    return <li key={x}>
      <Square value={squares[x-1]} onSquareClick={() => handleClick(turno, x-1)}/>
    </li>    
  })

  return <div className='tablero'>
    <div className='status'>
      <p>{matchStatus}</p>
    </div>
    {buttonSquares}
    
    {/* <Square value={squares[0]} onSquareClick={() => handleClick(turno, 0)}/>
    <Square value={squares[1]} onSquareClick={() => handleClick(turno, 1)}/>
    <Square value={squares[2]} onSquareClick={() => handleClick(turno, 2)}/>
    <Square value={squares[3]} onSquareClick={() => handleClick(turno, 3)}/>
    <Square value={squares[4]} onSquareClick={() => handleClick(turno, 4)}/>
    <Square value={squares[5]} onSquareClick={() => handleClick(turno, 5)}/>
    <Square value={squares[6]} onSquareClick={() => handleClick(turno, 6)}/>
    <Square value={squares[7]} onSquareClick={() => handleClick(turno, 7)}/>
    <Square value={squares[8]} onSquareClick={() => handleClick(turno, 8)}/> */}
  </div>;
   
}

export default function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const turno = currentMove % 2 === 1;

  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length-1);
  }

  function jumpTo(expectedSquares){
    setCurrentMove(expectedSquares);
  }

  const moves = history.map((squares, move) =>{
    let description;
    if (move > 0) {
      description = "Ir al movimiento #" + move;
    } else {
      description = "Ir al inicio del juego";
    }
    return <li key={move}>
      <button onClick={()=>jumpTo(move)}> {description} </button>
    </li>
  }
)

  return <div className='game'>
    <div className='game-board'>
      <Board squares={currentSquares} turno={turno} onPlay={handlePlay} currentMove={currentMove}/>
    </div>
    <div className='game-info'>
      <ol>
        {moves}
      </ol>
    </div>
  </div>
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
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}