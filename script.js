const gameboard = (function () {
    let board = Array(9);
    const displayBoard = function () {
        console.log(board);
    }
    const getBoard = function () {
        return board;
    }
    const addMarker = function (index, player) {
        board[index] = player.marker;

    }
    const checkAvailable = function (index) {
        if (board[index] === 'X' || board[index] === 'O') {
            return false;
        } else {
            return true;
        }
    }
    const restart = () => board = Array(9);
    return { displayBoard, getBoard, addMarker, checkAvailable, restart }
})();

const game = (function () {
    const player1 = createPlayer("Player 1 ", "X");
    const player2 = createPlayer("Player 2", "O");
    const players = [player1, player2];
    let currPlayer = players[0];
    let gameOver = false;
    let tie = false;
    let winningBoard =
        [[0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]];

    const checkPlayerWon = function (marker) {
        let board = Array(3).fill(marker);
        for (let i = 0; i < winningBoard.length; i++) {
            let results = winningBoard[i].map(j => gameboard.getBoard()[j]);
            if (results.toString() == board.toString()) {
                gameOver = true;
            }
        }
    }

    const checkTie = function () {
        if (!gameboard.getBoard().includes() && !gameOver) {
            tie = true;
        }
    }

    const switchPlayer = function () {
        if (currPlayer == players[0]) {
            currPlayer = players[1];
        } else {
            currPlayer = players[0];
        }
    }

    const playRound = function (index) {
        if (gameboard.checkAvailable(index) && !gameOver) {
            gameboard.addMarker(index, currPlayer);
            checkPlayerWon(currPlayer.marker);
            checkTie();
            if (!gameOver) {
                switchPlayer();
            }
        }
    }

    const restart = function () {
        currPlayer = players[0];
        gameOver = false;
        tie = false;
        gameboard.restart();
    }
    const setName = (player, name) => players[player].name = name;
    const getActivePlayer = () => currPlayer;
    const getBoard = () => gameboard.getBoard();
    const getActivePlayerName = () => currPlayer.name;
    const getGameOver = () => gameOver;
    const getTie = () => tie;



    return { getActivePlayer, playRound, getBoard, getActivePlayerName, getGameOver, setName, getTie, restart};
})();

const displayController = (function () {
    const setUpGame = function () {
        setName();
        let mainContainer = document.createElement('div');
        mainContainer.classList.add("main-container")
        mainContainer = addTitle(mainContainer);
        mainContainer.append(showCurrentPlayer());
        let container = document.createElement('div');
        container.classList.add('container');
        container = createBoard(container);
        mainContainer.appendChild(container);
        document.body.append(mainContainer);
        getInput();
        addRestart();

    }

    const getInput = function () {
        let cells = document.querySelectorAll(".grid-item");
        cells.forEach((cell) => {
            cell.addEventListener('click', UpdateScreen);
        });
    }

    const showCurrentPlayer = function () {
        let status = document.querySelector('.status');
        if (!status) {
            let status = document.createElement('div');
            status.classList.add('status');
            status.textContent = game.getActivePlayerName() + "'s Turn";
            return status;
        } else {
            status.textContent = game.getActivePlayerName() + "'s Turn";
            return status;

        }
    }
    const showPlayerWon = function () {
        let status = document.querySelector('.status');
        status.textContent = game.getActivePlayerName() + ' has won!';
    }

    const showTie = function () {
        let status = document.querySelector('.status');
        status.textContent = "It's a tie";
    }

    const UpdateScreen = function (cell) {
        if(!game.getGameOver()) {
            game.playRound(cell.target.dataset.index);
            let container = document.querySelector(".container");
            if (!container) {
                let container = document.createElement('div');
                container.classList.add('container');
            }
            let body = document.body
            container.textContent = "";
            container = createBoard(container);
            getInput();
            showCurrentPlayer();

            if (game.getGameOver() && !game.getTie()) {
                showPlayerWon();
                addRestart();
            } else if (game.getTie()) {
                showTie();
                addRestart();
            }
        }

    }

    const createBoard = function (container) {
        for (let i = 0; i < game.getBoard().length; i++) {
            let gridItem = document.createElement('div');
            gridItem.dataset.index = i;
            gridItem.classList.add('grid-item');
            gridItem.textContent = game.getBoard()[i];
            if (i < 3) {
                gridItem.classList.add('remove-top-border');
            }
            if (i > 5) {
                gridItem.classList.add('remove-bottom-border');
            }
            if (i % 3 == 0) {
                gridItem.classList.add('remove-left-border');

            } if (i == 2 || i == 5 || i == 8) {
                gridItem.classList.add('remove-right-border');
            }
            container.appendChild(gridItem);
        }
        return container;
    }

    const addTitle = function (container) {
        const title = document.createElement('div');
        title.textContent = "TICTACTOE";
        title.classList.add('title');
        container.append(title);
        return container;
    }

    const setName = function () {
        game.setName(0, 'Player 1');
        game.setName(1, 'Player 2');
    }

    const restartHandler = function () {
        let restart = document.querySelector(".restart-btn");
        restart.addEventListener("click", () => {
            game.restart();
            document.body.textContent ="";
            setUpGame();
        });
    }

    const addRestart = function () {
        let restart = document.querySelector(".restart-btn");
        if (!restart) {
            let div = document.createElement('div')
            let restart = document.createElement('button');
            restart.classList.add('restart-btn');
            div.classList.add('button-container')
            restart.textContent = 'restart';
            div.append(restart);
            let mainContainer = document.querySelector('.main-container');
            mainContainer.append(div);
            restartHandler();
        }

    }

    return { setUpGame }

})();

function createPlayer(name, marker) {
    return { name, marker }
}

displayController.setUpGame();
