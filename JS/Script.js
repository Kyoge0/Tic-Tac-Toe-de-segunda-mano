// game.js

const cells = document.querySelectorAll('.cell');
const timerDisplay = document.getElementById('timer');
const statusDisplay = document.getElementById('game-status');
const leaderboard = document.getElementById('leaderboard');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let playerTime = 0;
let timer;
let bestScores = JSON.parse(localStorage.getItem('bestScores')) || [];

function startGame() {
    cells.forEach(cell => cell.addEventListener('click', handlePlayerMove));
    resetBoard();
    displayScores();
}

function startTimer() {
    if (!timer) {
        timer = setInterval(() => {
            playerTime++;
            timerDisplay.textContent = playerTime;
        }, 1000);
    }
}

function handlePlayerMove(e) {
    const index = e.target.getAttribute('data-index');
    if (board[index] === '' && gameActive) {
        board[index] = currentPlayer;
        e.target.textContent = currentPlayer;
        e.target.classList.add('active');

        startTimer();

        if (checkWinner(currentPlayer)) {
            endGame(currentPlayer);
        } else if (board.includes('')) {
            currentPlayer = 'O';
            setTimeout(computerMove, 500);
        } else {
            endGame(null); // Empate
        }
    }
}

function computerMove() {
    let availableCells = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    board[randomIndex] = 'O';
    cells[randomIndex].textContent = 'O';
    cells[randomIndex].classList.add('active');

    if (checkWinner('O')) {
        endGame('O');
    } else {
        currentPlayer = 'X';
    }
}

function checkWinner(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.some(pattern => pattern.every(idx => board[idx] === player));
}

function endGame(winner) {
    clearInterval(timer);
    gameActive = false;

    if (winner === 'X') {
        let playerName = prompt('¡Ganaste! Ingresa tu nombre:');
        saveScore(playerName, playerTime);
    } else if (winner === 'O') {
        statusDisplay.textContent = '¡La computadora ganó!';
    } else {
        statusDisplay.textContent = '¡Es un empate!';
    }
}

function saveScore(playerName, time) {
    const newScore = { name: playerName, time, date: new Date().toLocaleString() };
    bestScores.push(newScore);
    bestScores.sort((a, b) => a.time - b.time);
    bestScores = bestScores.slice(0, 10);
    localStorage.setItem('bestScores', JSON.stringify(bestScores));
    displayScores();
}

function displayScores() {
    leaderboard.innerHTML = '';
    bestScores.forEach(score => {
        let li = document.createElement('li');
        li.textContent = `${score.name} - ${score.time}s (${score.date})`;
        leaderboard.appendChild(li);
    });
}

function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('active');
    });
    gameActive = true;
    playerTime = 0;
    timerDisplay.textContent = '0';
    statusDisplay.textContent = '';
    timer = null;
}

// Iniciar el juego
startGame();
