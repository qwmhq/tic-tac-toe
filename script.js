const commentBoard = document.querySelector('.comment-board');
const gameBoardDisplay = document.querySelector('.gameboard');
const restartButton = document.querySelector('.restart-button');

for (let i = 0; i < 9; i++) {
    let gameBoardSquare = document.createElement('div');
    let gameBoardSquareText = document.createElement('div');

    gameBoardSquare.classList.add('gameboard-square');
    gameBoardSquare.setAttribute('data-index', i);
    gameBoardSquare.addEventListener('click', function () {
        gameController.playSquare(this);
    });
    
    gameBoardSquare.appendChild(gameBoardSquareText);
    gameBoardDisplay.appendChild(gameBoardSquare);
}

restartButton.addEventListener('click', () => {
    gameController.restartGame();
});

const gameBoard = (() => {
    let gameBoard = [];
    for (let i = 0; i < 9; i++) {
        gameBoard.push('');
    }
    let getGameBoard = () => gameBoard;

    let updateGameBoard = (mark, index) => {
        if (!gameBoard[index]) {
            gameBoard[index] = mark;
        };
    };

    let isFull = () => {
        return gameBoard.every( (index) => index !== '' );
    };

    let resetGameBoard = () => {
        gameBoard = [];
        for (let i = 0; i < 9; i++) {
            gameBoard.push('');
        }
    };

    return{getGameBoard, updateGameBoard, isFull, resetGameBoard};
})();

const displayController = ( () => {
    let displayGameBoard = () => {
        let currentGameBoard = gameBoard.getGameBoard();
        for (let i = 0; i < 9; i++) {
            let gameBoardSquare = document.querySelector(`div[data-index="${i}"] div`);
            gameBoardSquare.textContent = currentGameBoard[i];
        }
    };

    let displayComment = (comment) => {
        commentBoard.textContent = comment;
    };

    return {displayGameBoard, displayComment};
})();

const playerFactory = (name, marker) => {
    let getName = () => name;
    let getMarker = () => marker;
    let occupiedIndexes = [];
    
    let getOccupiedIndexes = () => occupiedIndexes;
    
    let updateOccupiedIndexes = (index) => {
        occupiedIndexes.push(index);
    };

    let hasWon = () => {
        let hasWon = false;
        let winningOptions = [
            ['0', '1', '2'], ['3', '4', '5'], ['6', '7', '8'],
            ['0', '3', '6'], ['1', '4', '7'], ['2', '5', '8'],
            ['0', '4', '8'], ['2', '4', '6']
        ];

        winningOptions.forEach( (option) => {
            if (option.every( (index) => occupiedIndexes.includes(index))) {
                hasWon = true;
            } 
        } );

        return hasWon;
    };

    let resetPlayer = () => {
        occupiedIndexes = [];
    };

    return {getName, getMarker, getOccupiedIndexes, updateOccupiedIndexes, hasWon, resetPlayer};
}

const gameController = ( () => {
    let playerOne = playerFactory('Player X', 'X');
    let playerTwo = playerFactory('Player O', 'O');
    let currentPlayer = playerOne;

    displayController.displayComment(`${currentPlayer.getName()}'s turn`);

    let getCurrentPlayer = () => currentPlayer;
    
    let switchCurrentPlayer = () => {
        if (currentPlayer == playerOne) {
            currentPlayer = playerTwo
        } else currentPlayer = playerOne;
    };

    let playSquare = (square) => {
        let isTheGameOver = isGameOver();
        
        if (isTheGameOver) return;

        let index = square.getAttribute('data-index');
        gameBoard.updateGameBoard(getCurrentPlayer().getMarker(), index);
        currentPlayer.updateOccupiedIndexes(index);
        switchCurrentPlayer();
        
        displayController.displayGameBoard();
        
        isTheGameOver = isGameOver();

        if (!isTheGameOver) {
            displayController.displayComment(`${currentPlayer.getName()}'s turn`);
        } else if (isTheGameOver === 1) {
            displayController.displayComment(`${playerOne.getName()} has won!`);
        } else if (isTheGameOver === 2) {
            displayController.displayComment(`${playerTwo.getName()} has won!`);
        } else if (isTheGameOver === 3) {
            displayController.displayComment(`It's a tie!`);
        }
    };

    let isGameOver = () => {
        if (playerOne.hasWon()) {
            return 1;
        } else if (playerTwo.hasWon()) {
            return 2;
        } else if (gameBoard.isFull()) {
            return 3;
        } else {
            return 0;
        }
    };

    let restartGame = () => {
        playerOne.resetPlayer();
        playerTwo.resetPlayer();
        
        currentPlayer = playerOne;
        displayController.displayComment(`${currentPlayer.getName()}'s turn`);

        gameBoard.resetGameBoard();
        displayController.displayGameBoard();

    };
    return {playSquare, restartGame};
})();