const gameboard = (function () {
    const gameboard = Array(9);
    const displayBoard = function () {
        console.log(gameboard);
    }
    const getBoard = function () {
        return gameboard;
    }
    const addMarker = function (index, player) {
        if (checkIndex(index)) {
            gameboard[index] = player.marker;
        }
    }
    const checkIndex = function (index) {
        if (gameboard[index] === 'X' || gameboard[index] === 'O') {
            return false;
        } else {
            return true;
        }
    }
    return { displayBoard, getBoard, addMarker }
})();

const game = (function () {
    const player1 = createPlayer("Player 1 ", "X");
    const player2 = createPlayer("Player 2", "O");
    const players = [player1, player2];
    let currPlayer = players[0];
    let gameOver = false;

    const checkGameOver = function (marker) {
        for (let i = 0; i < gameboard.getBoard().length; i += 3) {
            if ((gameboard.getBoard()[i] == marker && gameboard.getBoard()[i + 1] == marker && gameboard.getBoard()[i + 2] == marker)) {
                gameOver = true;
            }
        }
        for (let i = 0; i < 3; i++) {
            if (gameboard.getBoard()[i] === marker && gameboard.getBoard()[i + 3] === marker && gameboard.getBoard()[i + 6] === marker) {
                gameOver = true;
            }
        }
        if ((gameboard.getBoard()[0] == marker && gameboard.getBoard()[4] == marker && gameboard.getBoard()[8] == marker) || (gameboard.getBoard()[2] == marker && gameboard.getBoard()[4] == marker && gameboard.getBoard()[6] == marker)) {
            gameOver = true;
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
        gameboard.addMarker(index, currPlayer);
        checkGameOver(currPlayer.marker);
        console.log(gameOver);
        if (!gameOver) {
            switchPlayer();
        }
    }
    const setName = function (player , name) {
        players[player].name = name;
    }
    const getActivePlayer = () => currPlayer;
    const getBoard = () => gameboard.getBoard();
    const getActivePlayerName = () => currPlayer.name;
    const getGameOver = () => gameOver;

    return { getActivePlayer, playRound, getBoard, getActivePlayerName, getGameOver, setName};
})();

const displayController = (function () {
    const displayGrid = function () {
        setName();
        let container = document.createElement('div');
        let body = document.body;
        container.classList.add('container');
        for (let i = 0; i < 9; i++) {
            let gridItem = document.createElement('div');
            gridItem.dataset.index = i;
            gridItem.classList.add('grid-item');
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
        body.appendChild(container);
        showCurrentPlayer();
        getInput();
    }

    const getInput = function () {
        let cells = document.querySelectorAll(".grid-item");
        cells.forEach((cell) => {
            cell.addEventListener('click', UpdateScreen);
        });
    }
    const showCurrentPlayer = function () {
        let status = document.querySelector('.status-container');
        if (!status) {
            let status = document.createElement('div');
            status.classList.add('status-container');
            status.textContent = 'current player: ' + game.getActivePlayerName();
            document.body.append(status);
        } else {
            status.textContent = 'current player: ' + game.getActivePlayerName();
        }
    }
    const showGameOver = function () {
        let gameover = document.createElement('div');
        gameover.classList.add('gameover');
        gameover.textContent = game.getActivePlayerName() + ' has won';
        document.body.append(gameover);
    }

    const UpdateScreen = function (cell) {
        game.playRound(cell.target.dataset.index);
        let container = document.querySelector(".container");
        if (!container) {
            let container = document.createElement('div');
            container.classList.add('container');
        }
        let body = document.body
        container.textContent = "";
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
        getInput();
        showCurrentPlayer();
        console.log(game.getGameOver());
        if (game.getGameOver()) {
            showGameOver();
        }
    }

    const setName = function () {
        game.setName(0, 'Johnny');
        game.setName(1, 'Jordan');
    }
    return { displayGrid }

})();

function createPlayer(name, marker) {
    return { name, marker }
}

displayController.displayGrid();