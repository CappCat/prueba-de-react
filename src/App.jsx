import { useState } from 'react'
import useSound from 'use-sound';

import winAudio from './assets/winaudio.mp3'

let winningCells;

function Square( {value, onSquareClick, styleClass} ) {
  return <button className={styleClass} onClick={onSquareClick}>{value}</button>
}

function Board({squares, turno, onPlay, currentMove}) {
  const numbers = [1,2,3,4,5,6,7,8,9];
  const [playSound] = useSound(winAudio);

  let matchStatus;

  if (calculateWinner(squares)){
    matchStatus = "Ganador: " + calculateWinner(squares);
    playSound();
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
    let styleButton = "square";
    if (winningCells) {
      styleButton = winningCells.includes(x-1) ? "winning-square" : "square";
    } 
    
    return <li key={x}>
      <Square value={squares[x-1]} onSquareClick={() => handleClick(turno, x-1)} styleClass={ styleButton }/>
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
  const [reversedButtons, setReversedButtons] = useState(false);
  const turno = currentMove % 2 === 1;

  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length-1);
  }

  function jumpTo(expectedSquares){
    setCurrentMove(expectedSquares);
    winningCells = null;
  }

  function reverseHistory(){
    setReversedButtons(!reversedButtons);
  }

  const moves = history.map((squares, move) =>{
    const newMove = reversedButtons ? (((move-history.length)+1)*(-1)) : move;
    let description;
    if (newMove===currentMove){
      description = "Estás en el movimiento #" + newMove;
    } else if (newMove > 0) {
      description = "Ir al movimiento #" + newMove;
    } else {
      description = "Ir al inicio del juego";
    }
    return newMove===currentMove ? (<li>
      <p> {description} </p>
    </li>) :  (<li key={newMove}>
      <button onClick={()=>jumpTo(newMove)}> {description} </button>
    </li>)
  }
)

  return <div className='game'>
    <div className='game-board'>
      <Board squares={currentSquares} turno={turno} onPlay={handlePlay} currentMove={currentMove}/>
    </div>
    <div className='game-info'>
      <ul>
        {moves}
      </ul>
      <button onClick={reverseHistory}>Voltear</button>
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
      winningCells = [a,b,c];
      return squares[a];
    }
  }
  return null;
}

