var board;
var player;
var opponent;
var cells;
var playerScore = 0;
var aiScore = 0;
var drawScore = 0;
var playerName;

function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    player = 'X';
    opponent = 'O';
    if (!playerName) {
        playerName = prompt("الرجاء إدخال اسمك:", "اللاعب");
        document.getElementById('player-name').innerText = playerName;
        showChallengeAlert();
    }
    var boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    for (var i = 0; i < 9; i++) {
        var cell = document.createElement('div');
        cell.addEventListener('click', makeMove(i), false);
        boardElement.appendChild(cell);
    }
}

function showChallengeAlert() {
    var challengeAlert = document.createElement('div');
    challengeAlert.id = 'challenge-alert';
    challengeAlert.innerHTML = `
        <div class="alert-content">
            <img src="ropot.png" alt="Image Description" width="250" height="250">
            <h2 style="color: #3D94B7;">هـل أنـت جـاهـز تـتـحـدى الـذكـاء الإصـطنـاعـي ؟</h2>
            <button onclick="closeChallengeAlert()">جاهز!</button>
        </div>
    `;
    document.body.appendChild(challengeAlert);
    setTimeout(function () {
        challengeAlert.style.opacity = '1';
        challengeAlert.querySelector('.alert-content').style.transform = 'scale(1)';
    }, 100);
}

function closeChallengeAlert() {
    var challengeAlert = document.getElementById('challenge-alert');
    challengeAlert.style.opacity = '0';
    challengeAlert.querySelector('.alert-content').style.transform = 'scale(0)';
    setTimeout(function () {
        document.body.removeChild(challengeAlert);
    }, 500);
}

function endGame() {
    var endGameAlert = document.createElement('div');
    endGameAlert.id = 'end-game-alert';
    endGameAlert.innerHTML = `
        <div class="alert-content">
            <img src="end.png" alt="Image Description" width="250" height="250">
            <h2 style="color: #3D94B7;">;) حظ أوفر، ترى الذكاء الاصطناعي أذكى </h2>
            <button onclick="closeEndGameAlert()">إغلاق</button>
        </div>
    `;
    document.body.appendChild(endGameAlert);
    setTimeout(function() {
        endGameAlert.style.opacity = '1';
        endGameAlert.querySelector('.alert-content').style.transform = 'scale(1)';
    }, 100);
}

function closeEndGameAlert() {
    var endGameAlert = document.getElementById('end-game-alert');
    endGameAlert.style.opacity = '0';
    endGameAlert.querySelector('.alert-content').style.transform = 'scale(0)';
    setTimeout(function() {
        document.body.removeChild(endGameAlert);
    }, 500);
}


function makeMove(index) {
    return function () {
        if (board[index] === '') {
            board[index] = player;
            document.getElementById('board').children[index].innerText = player;
            var score = isGameOver();
            if (score !== null) {
                setTimeout(function () {
                    if (score === -10) {
                        alert('اللاعب فاز!');
                        playerScore++;
                    } else if (score === 0) {
                        alert('تعادل!');
                        drawScore++;
                    }
                    document.getElementById('player-score').innerText = playerScore;
                    document.getElementById('ai-score').innerText = aiScore;
                    document.getElementById('draw-score').innerText = drawScore;
                    resetBoard();
                }, 500);
            } else {
                makeAIMove();
            }
        }
    };
}

function makeAIMove() {
    var index = minimax(board, 0, true).index;
    board[index] = opponent;
    document.getElementById('board').children[index].innerText = opponent;
    var score = isGameOver();
    if (score !== null) {
        setTimeout(function () {
            if (score === 10) {
                alert('الذكاء الاصطناعي فاز!');
                aiScore++;
            } else if (score === 0) {
                alert('تعادل!');
                drawScore++;
            }
            document.getElementById('player-score').innerText = playerScore;
            document.getElementById('ai-score').innerText = aiScore;
            document.getElementById('draw-score').innerText = drawScore;
            resetBoard();
        }, 500);
    }
}


function isGameOver() {
    var winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (var i = 0; i < winningCombinations.length; i++) {
        if (board[winningCombinations[i][0]] === player && board[winningCombinations[i][1]] === player && board[winningCombinations[i][2]] === player) {
            return -10;
        } else if (board[winningCombinations[i][0]] === opponent && board[winningCombinations[i][1]] === opponent && board[winningCombinations[i][2]] === opponent) {
            return 10;
        }
    }

    if (!board.includes('')) {
        return 0;
    }

    return null;
}


function minimax(newBoard, depth, isMaximizingPlayer) {
    var score = isGameOver();

    if (score === 10) {
        return { score: score - depth };
    }

    if (score === -10) {
        return { score: score + depth };
    }

    if (score === 0) {
        return { score: score };
    }

    if (isMaximizingPlayer) {
        var bestScore = -Infinity;
        var move;

        for (var i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = opponent;
                var result = minimax(newBoard, depth + 1, false);
                newBoard[i] = '';
                if (result.score > bestScore) {
                    bestScore = result.score;
                    move = i;
                }
            }
        }

        return { score: bestScore, index: move };
    } else {
        var bestScore = Infinity;
        var move;

        for (var i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = player;
                var result = minimax(newBoard, depth + 1, true);
                newBoard[i] = '';
                if (result.score < bestScore) {
                    bestScore = result.score;
                    move = i;
                }
            }
        }

        return { score: bestScore, index: move };
    }
}

resetBoard();
