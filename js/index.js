//Uses the minimax algorithm 
//Reference material from https://medium.freecodecamp.org/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37

function toggleDarkLight() {
  var body = document.getElementById("body");
  var currentClass = body.className;
  body.className = currentClass == "light-mode" ? "dark-mode" : "light-mode";
}

var origBoard;
var huPlayer = 'X';
var aiPlayer = 'O';
var level = 'easy';
var xScore = 0;
var oScore = 0;
var draws = 0;
var isTurnX = true;
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
  ];

const squares = document.querySelectorAll('.square');
startGame();

function startGame() {
  document.querySelector(".message").style.display = "none";
  document.getElementById('playermode').removeAttribute('disabled');
  document.getElementById('level').removeAttribute('disabled');
  origBoard = Array.from(Array(9).keys())
  for (var i = 0; i < squares.length; i++) {
      squares[i].innerText = '';
      squares[i].style.removeProperty('background-color');
      squares[i].style.color = '#0099FF';
      squares[i].addEventListener('click', turnClick, false);
  }
}

function turnClick(square) {
  huPlayer = document.getElementById('playermode').checked ? 'O' : 'X';
  aiPlayer = huPlayer === 'O'? 'X' : 'O';
  level = document.getElementById('level').checked ? 'hard' : 'easy';
  document.getElementById('playermode').setAttribute('disabled', 'disabled');
  document.getElementById('level').setAttribute('disabled', 'disabled');
  
  if (typeof origBoard[square.target.id] == 'number') { 
    turn(square.target.id, huPlayer);  
    if (!checkTie() && !checkWin(origBoard, huPlayer)) 
      turn(bestSpot(), aiPlayer);  
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player); 
  if (gameWon) gameOver(gameWon);           
} 

function checkWin(board, player){
  let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, [])
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {  
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {index: index, player: player};
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor = gameWon.player == huPlayer ? "#66FF00" : "#0099FF";
    document.getElementById(index).style.color = 'white';
  }
  for (var i = 0; i < squares.length; i++) {
    squares[i].removeEventListener('click', turnClick, false);
  }
  declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose!")  
    if(	gameWon.player === huPlayer) {
		xScore++;
		$(".xscore-value").text(xScore);
    isTurnX = false;
	}
  else if( gameWon.player === aiPlayer) {
		oScore++;
		$(".oscore-value").text(oScore);
    isTurnX = false;
	}  
}

function declareWinner(who) {
  document.querySelector(".message").style.display = "block";
  document.querySelector(".message .text").innerText = who;
}

function emptySquares(board){
  return board.filter(spot => typeof spot == 'number');
}

function checkTie() {
  if (emptySquares(origBoard).length == 0 && !checkWin(origBoard, huPlayer)){
    for (var i = 0; i < squares.length; i++) {
      squares[i].style.backgroundColor = "#FFCC00";
      squares[i].style.color = "white";
      squares[i].removeEventListener('click', turnClick, false);
    }
    declareWinner("Tie!")
    draws++;
	  $(".tie-value").text(draws);
    return true;
  }
  return false;
}

function resetScore() {
	xScore = 0;
	$(".xscore-value").text(xScore);
	oScore = 0;
	$(".oscore-value").text(oScore);
	draws = 0;
	$(".tie-value").text(draws);
}

function bestSpot() {
 
  return level === 'easy'? emptySquares(origBoard)[0] : minimax(origBoard, aiPlayer).index;
}


function minimax(newBoard, player){
  var availSpots = emptySquares(newBoard);
  
  if (checkWin(newBoard, huPlayer)){
     return {score:-10};
  }
	else if (checkWin(newBoard, aiPlayer)){
    return {score:10};
	}
  else if (availSpots.length === 0){
  	return {score:0};
  }

  var moves = [];
  for (var i = 0; i < availSpots.length; i++){
    var move = {};
  	move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;
    if (player == aiPlayer){
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    }
    else{
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }
    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }
  var bestMove;
  if(player === aiPlayer){
    var bestScore = -10000;
    for(var i = 0; i < moves.length; i++){
      if(moves[i].score > bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }else{
    var bestScore = 10000;
    for(var i = 0; i < moves.length; i++){
      if(moves[i].score < bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}  

 $("#btnReset").on("click",function(){
    resetAll();
  });

function resetBoard() {
  $(".square").html("");
  isTurnX = true;
  turn = player;
}

function resetAll() {
  $(".oscore-value").html(0);
  $(".tie-value").html(0);
  $(".xscore-value ").html(0);
  xScore = 0;
  oScore = 0;
  draws = 0;
  resetBoard();
}

$(document).ready(function() {
  $(".square").on("click", move);
  $(".reset").on("click", resetAll);
});