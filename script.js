class Gameboard {
    static #board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    static #winCases = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]

    static getBoard() {
        return this.#board;
    }

    static setBoard(value, row, col) {
        if (this.#board[row][col] === '') {
            this.#board[row][col] = value;
        } else {
            throw new Error('This cell is already taken');
        }
    }

    static checkForWin() {
        for(let win of this.#winCases) {
            
        }
    }
}

console.log(Gameboard.getBoard());
Gameboard.setBoard('X', 0, 2);
console.log(Gameboard.getBoard());


(function createGrid() {
    const boardArray = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'];

    const boardContainer = document.querySelector('.board-container');
    const board = document.createElement('div');
    board.classList.add('board');

    boardArray.forEach((el, i) => {
        const div = document.createElement('div');
        div.textContent = el;
        div.classList.add('cell');
        div.dataset.cell = i;
        board.appendChild(div);
    })

    boardContainer.appendChild(board);
})();