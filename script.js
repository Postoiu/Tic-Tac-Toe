(function createGameBoard() {
    const board = [
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['X', 'O', 'X']
    ];

    const boardContainer = document.querySelector('.board-container');

    for(let row of board) {
        row.forEach((el, i) => {
            const div = document.createElement('div');
            div.textContent = el;
            div.classList.add('cell');
            div.dataset.row = board.indexOf(row);
            div.dataset.col = i;
            boardContainer.appendChild(div);
        });
    }
})();