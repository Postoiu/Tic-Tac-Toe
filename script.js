/**
 * TODO:
 * Try to refactor actual code according to DRY principles
 */

let game;

const Gameboard = (function() {
    let boardState = ['', '', '', '', '', '', '', '', ''];

    const winCases = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]

    const getBoardState = () => boardState;

    const setBoardState = (value, index) => {
        if(boardState[index] !== '') {
            return;
        } else {
            boardState[index] = value;
        }
    }

    const resetBoardState = () => {
        boardState = ['', '', '', '', '', '', '', '', ''];
    }

    const getWinner = () => {
        const player1MarkIndex = [];
        const player2MarkIndex = [];
        let winner;

        boardState.forEach((el, i) => {
            if(el === 'X') {
                player1MarkIndex.push(i);
            }

            if(el === 'O') {
                player2MarkIndex.push(i);
            }
        });

        for(let cases of winCases) {
            if(cases.every(el => player1MarkIndex.includes(el))) {
                winner = {
                    mark: 'X',
                    winCases: cases
                };
                break;
            }

            if(cases.every(el => player2MarkIndex.includes(el))) {
                winner = {
                    mark: 'O',
                    winCases: cases
                };
                break;
            }
        }

        return winner;
    }

    return {getBoardState, setBoardState, resetBoardState, getWinner};
})();

const boardUI = (function() {
    const boardContainer = document.querySelector('.board-container');
    const board = document.createElement('div');
    board.classList.add('board');

    Gameboard.getBoardState().forEach((el, i) => {
        const divElement = document.createElement('div');
        divElement.textContent = el;
        divElement.classList.add('cell');
        divElement.dataset.cell = i;
        board.appendChild(divElement);
    })

    boardContainer.appendChild(board);

    const update = (element) => {
        const boardState = Gameboard.getBoardState();
        element.textContent = boardState[element.dataset.cell];
    }

    const clearBoard = () => {
        Gameboard.getBoardState().forEach((el, i) => {
            const cell = document.querySelector(`div[data-cell='${i}']`);
            update(cell);

            cell.classList.remove('clicked');
            cell.parentElement.classList.remove('clicked');
        })
    }

    const addOverlay = (element) => {
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        element.appendChild(overlay);
    }

    return { update, clearBoard, addOverlay };
})();

class Player {
    constructor(name, mark, turn = false) {
        this.name = name;
        this.mark = mark;
        this.turn = turn;
        this.score = 0;
    }

    incrementScore() {
        this.score++;
    }

    resetScore() {
        this.score = 0;
    }
}

class Game {
    constructor(player1Name, player2Name) {
        this.player1 = new Player(player1Name, 'X', true);
        this.player2 = new Player(player2Name, 'O');
        this.board = boardUI;
    }

    changePlayer() {
        this.player1.turn = !this.player1.turn;
        this.player2.turn = !this.player2.turn;
    }

    checkForWinner() {
        if(this.player1.score >= 5) {
            return this.player1.name;
        }

        if(this.player2.score >= 5) {
            return this.player2.name;
        }
    }
}

document.querySelector('.board-container').addEventListener('click', (e) => {
    if(e.target.className !== 'cell') {
        return;
    }

    if(game.player1.turn) {
        Gameboard.setBoardState(game.player1.mark, e.target.dataset.cell);
    }

    if(game.player2.turn) {
        Gameboard.setBoardState(game.player2.mark, e.target.dataset.cell);
    }

    game.board.update(e.target);
    game.board.addOverlay(e.target);
    game.changePlayer();
    e.target.classList.add('clicked');
    const winner = Gameboard.getWinner();

    if(winner) {
        
        e.target.parentElement.classList.add('clicked');
        
        if(winner.mark === game.player1.mark) {
            game.player1.incrementScore();
            document.querySelector('.player-1-score').textContent = game.player1.score;
        }
        
        if(winner.mark === game.player2.mark) {
            game.player2.incrementScore();
            document.querySelector('.player-2-score').textContent = game.player2.score;
        }

        const gameWinner = game.checkForWinner();

        if(gameWinner) {
            document.querySelector('.win-banner').textContent = `'${gameWinner}' wins the game!`;
            document.querySelector('.win-banner').style.display = 'block';
            document.querySelector('.win-banner').classList.add('row-span');

            const cellsArray = Array.from(document.querySelectorAll('.cell'));

            cellsArray.forEach(cell => {
                if(cell.textContent === '') {
                    game.board.addOverlay(cell);
                }
            });

            winner.winCases.forEach(index => {
                const cell = document.querySelector(`div[data-cell='${index}']`);
                cell.removeChild(cell.lastChild);
            });

            return;
        }

        document.querySelector('.win-banner').textContent = `'${winner.mark}' wins this round!`;
        document.querySelector('.win-banner').style.display = 'block';
        document.querySelector('.next-round').style.display = 'block';

        const cellsArray = Array.from(document.querySelectorAll('.cell'));

        cellsArray.forEach(cell => {
            if(cell.textContent === '') {
                game.board.addOverlay(cell);
            }
        })

        winner.winCases.forEach(index => {
            const cell = document.querySelector(`div[data-cell='${index}']`);
            cell.removeChild(cell.lastChild);
        });
    }

    if(!Gameboard.getBoardState().includes('') && !winner) {
        document.querySelector('.win-banner').textContent = 'It\'s a draw';
        document.querySelector('.win-banner').style.display = 'block';
        document.querySelector('.next-round').style.display = 'block';
    }
});

document.querySelector('.next-round').addEventListener('click', () => {
    document.querySelector('.win-banner').style.display = 'none';
    document.querySelector('.next-round').style.display = 'none';

    Gameboard.resetBoardState();
    boardUI.clearBoard();
})

document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const [player1, player2] = Array.from(e.target.querySelectorAll('input'));

    document.querySelector('.player-1').textContent = player1.value || 'Player 1';
    document.querySelector('.player-2').textContent = player2.value || 'Player 2';
    player1.value = '';
    player2.value = '';

    document.querySelector('.play-btn').style.display = 'none';
    document.querySelector('.control-btns').style.display = 'flex';

    game = new Game(player1.value || 'Player 1', player2.value || 'Player 2');
});

document.querySelector('.control-btns').addEventListener('click', (e) => {
    e.preventDefault();

    if(e.target.className === 'end-game') {
        document.querySelector('.play-btn').style.display = 'block';
        document.querySelector('.control-btns').style.display = 'none';

        document.querySelector('.player-1').textContent = 'Player 1'
        document.querySelector('.player-2').textContent = 'Player 2';

        e.target.previousElementSibling.click();

        game = undefined;
        delete game;
    }

    if(e.target.className === 'reset-btn') {
        Gameboard.resetBoardState();
        boardUI.clearBoard();

        document.querySelector('.player-1-score').textContent = 0;
        document.querySelector('.player-2-score').textContent = 0;

        game.player1.resetScore();
        game.player1.turn = true;
        game.player2.resetScore();
        game.player2.turn = false;

        document.querySelector('.win-banner').style.display = 'none';
        document.querySelector('.next-round').style.display = 'none';
    }
})