class UI {
    static clearGrid() {
        let boardGrids = document.querySelectorAll('div.board-grid');
        for (let i = 0; i < boardGrids.length; i++) {
            let grid = boardGrids[i];
            grid.classList.remove('winning-grid');
            while (grid.firstChild) {
                grid.removeChild(grid.firstChild);
            }
        }
    }

    static markGridAsCircle(rowIdx, colIdx) {
        let grid = this._getGrid(rowIdx, colIdx);
        let t = document.getElementById('circle-template');
        grid.appendChild(document.importNode(t.content, true));
    }

    static markGridAsCross(rowIdx, colIdx) {
        let grid = this._getGrid(rowIdx, colIdx);
        let t = document.getElementById('cross-template');
        grid.appendChild(document.importNode(t.content, true));
    }

    static _getGrid(rowIdx, colIdx) {
        return document.querySelectorAll('div.board-grid')[Utils.stateIdx(rowIdx, colIdx)];
    }

    static _fillWinningGrid(rowIdx, colIdx) {
        this._getGrid(rowIdx, colIdx).classList.add('winning-grid');
    }

    static lockPlayerSettings() {
        document.getElementById('player1-select').disabled = true;
        document.getElementById('player2-select').disabled = true;
    }

    static unlockPlayerSettings() {
        document.getElementById('player1-select').disabled = false;
        document.getElementById('player2-select').disabled = false;
    }

    static fillWinningGrids(state) {
        for (let i = 0; i < 3; i++) {
            if (state.markAt(i, 0) !== Utils.EMPTY_GRID
                    && state.markAt(i, 0) === state.markAt(i, 1)
                    && state.markAt(i, 1) === state.markAt(i, 2)) {
                this._fillWinningGrid(i, 0);
                this._fillWinningGrid(i, 1);
                this._fillWinningGrid(i, 2);
            }
            if (state.markAt(0, i) !== Utils.EMPTY_GRID
                    && state.markAt(0, i) === state.markAt(1, i)
                    && state.markAt(1, i) === state.markAt(2, i)) {
                this._fillWinningGrid(0, i);
                this._fillWinningGrid(1, i);
                this._fillWinningGrid(2, i);
            }
        }
        if (state.markAt(0, 0) !== Utils.EMPTY_GRID
                && state.markAt(0, 0) === state.markAt(1, 1)
                && state.markAt(1, 1) === state.markAt(2, 2)) {
            this._fillWinningGrid(0, 0);
            this._fillWinningGrid(1, 1);
            this._fillWinningGrid(2, 2);
        }
        if (state.markAt(2, 0) !== Utils.EMPTY_GRID
                && state.markAt(2, 0) === state.markAt(1, 1)
                && state.markAt(1, 1) === state.markAt(0, 2)) {
            this._fillWinningGrid(2, 0);
            this._fillWinningGrid(1, 1);
            this._fillWinningGrid(0, 2);
        }
    }

    static setMessage(msg) {
        document.getElementById('message-span').textContent = msg;
    }
}

function logNextActions(state) {
    const nextActions = state.nextActions;
    for (let i = 0; i < nextActions.length; i++) {
        const nextAction = nextActions[i];
        console.log(`next hand: ${Utils.kifu(nextAction.rowIdx, nextAction.colIdx)} ${e.getQ(state, nextAction)}`);
    }
}

function doAction(action) {
    if (s.isValidAction(action)) {
        if (s.nextPlayer === Utils.PLAYER1) {
            UI.markGridAsCircle(rowIdx, colIdx);
            UI.setMessage("Player 2's turn!");
        } else {
            UI.markGridAsCross(rowIdx, colIdx);
            UI.setMessage("Player 1's turn!");
        }
        const nextState = s.nextState(action);
        logNextActions(nextState);

        if (nextState.isTieGame) {
            UI.setMessage('Tie game!');
            UI.lockPlayerSettings();
            e.iterateQ(Utils.TIE_VALUE, s, action);
            s = nextState;
        } else if (nextState.hasWonGame) {
            UI.setMessage(`Game end! Winner is Player${nextState.winner}!`);
            UI.unlockPlayerSettings();
            UI.fillWinningGrids(nextState);
            const reward = nextState.winner == Utils.PLAYER1 ? Utils.PLAYER1_WINNING_VALUE : Utils.PLAYER2_WINNING_VALUE;
            e.iterateQ(reward, s, action);
            s = nextState;
        } else {
            e.iterateQ(Utils.DEFAULT_VALUE, s, action);
            s = nextState;
        }
    }
}

let e  = new Evaluator(0.2, 0.2);
let p1 = new Policy();
let p2 = new Policy();
let a  = new Agent(p1, p2);
let s  = null;

let isPlayer1Computer = null;
let isPlayer2Computer = null;

let busyFlag = false;

document.getElementById('new-game-btn').onclick = function() {
    s = new State(Utils.DEFAULT_STATE);
    const p1 = document.getElementById('player1-select').value;
    const p2 = document.getElementById('player2-select').value;

    switch (p1) {
        case '0':
            isPlayer1Computer = false;
            break;
        case '1':
            isPlayer1Computer = true;
            p1 = new RandomPolicy();
            break;
        case '2':
            isPlayer1Computer = true;
            p1 = new EpsilonGreedy(e);
            break;
        case '3':
            isPlayer1Computer = true;
            p1 = new EpsilonGreedy(e, 0.2);
            break;
        default:
            console.log('dame');
    }

    switch (p2) {
        case '0':
            isPlayer2Computer = false;
            break;
        case '1':
            isPlayer2Computer = true;
            p1 = new RandomPolicy();
            break;
        case '2':
            isPlayer2Computer = true;
            p1 = new EpsilonGreedy(e);
            break;
        case '3':
            isPlayer2Computer = true;
            p1 = new EpsilonGreedy(e, 0.2);
            break;
        default:
            console.log('dame');
    }
    a = new Agent(p1, p2);
    console.log(`Player1: ${isPlayer1Computer}, Player2: ${isPlayer2Computer}`);
    UI.clearGrid();
    UI.lockPlayerSettings();
    UI.setMessage("New game started! Player 1's turn. Click on the grid.");
};

let boardGrids = document.querySelectorAll('div.board-grid');
for (let i = 0; i < boardGrids.length; i++) {
    boardGrids[i].onclick = function() {
        if (s == null || busyFlag === true) {
            return;
        }
        busyFlag = true;
        const rowIdx = this.dataset.rowIdx;
        const colIdx = this.dataset.colIdx;
        console.log(`Grid(${rowIdx}, ${colIdx}) clicked`);
        doAction(new Action(rowIdx, colIdx, s.nextPlayer));
        busyFlag = false;
    };
}
