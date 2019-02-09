class State {
    constructor(state) {
        this.state = state
    }

    get encode() {
        const convArrays = [
            [2,1,0,5,4,3,8,7,6],
            [6,3,0,7,4,1,8,5,2],
            [0,3,8,1,4,7,2,5,8],
            [8,7,6,5,4,3,2,1,0],
            [6,7,8,3,4,5,0,1,2],
            [2,5,8,1,4,7,0,3,6],
            [8,5,2,7,4,1,6,3,0]
        ];
        let ret = this.state;
        for (let i = 0; i < convArrays.length; i++) {
            const convArray = convArrays[i];
            let tmpVal = '';
            for (let j = 0; j < Utils.GRID_NUM; j++) {
                tmpVal += this.state.charAt[convArray[j]];
            }
            if (parseInt(tmpVal) < parseInt(ret)) {
                ret = tmpVal;
            }
        }
        return ret;
    }

    get nextPlayer() {
        return this.emptyGridCount % 2 == 1 ? Utils.PLAYER1 : Utils.PLAYER2;
    }

    get hasWonGame() {
        for (let i = 0; i < 3; i++) {
            if (this.markAt(i, 0) !== Utils.EMPTY_GRID
                    && this.markAt(i, 0) === this.markAt(i, 1)
                    && this.markAt(i, 1) === this.markAt(i, 2)) {
                return true;
            }

            if (this.markAt(0, i) !== Utils.EMPTY_GRID
                    && this.markAt(0, i) === this.markAt(1, i)
                    && this.markAt(1, i) === this.markAt(2, i)) {
                return true;
            }
        }

        if (this.markAt(0, 0) !== Utils.EMPTY_GRID
                && this.markAt(0, 0) === this.markAt(1, 1)
                && this.markAt(1, 1) === this.markAt(2, 2)) {
            return true;
        }

        if (this.markAt(0, 2) !== Utils.EMPTY_GRID
                && this.markAt(0, 2) === this.markAt(1, 1)
                && this.markAt(1, 1) === this.markAt(2, 0)) {
            return true;
        }

        return false;
    }

    get winner() {
        if (this.hasWonGame) {
            return this.emptyGridCount % 2 === 0 ? Utils.PLAYER1 : Utils.PLAYER2;
        }
        return '';
    }

    get isTieGame() {
        return !this.hasWonGame && this.emptyGridCount == 9;
    }

    get emptyGridCount() {
        let n = 0;
        for (let i = 0; i < Utils.GRID_NUM; i++) {
            if (this.state.charAt(i) == Utils.EMPTY_GRID) {
                n++;
            }
        }
        return n;
    }

    markAt(rowIdx, colIdx) {
        return this.state.charAt(Utils.stateIdx(rowIdx, colIdx));
    }

    nextState(action) {
        const s = Utils.changeCharAt(
            this.state,
            Utils.stateIdx(action.rowIdx, action.colIdx),
            action.player);
        return new State(s);
    }

    get nextActions() {
        let ret =[];
        if (this.hasWonGame) {
            return ret;
        }
        const nextPlayer = this.nextPlayer;
        for (let r = 0; r < Utils.ROW_NUM; r++) {
            for (let c = 0; c < Utils.COL_NUM; c++) {
                if (this.markAt(r, c) === Utils.EMPTY_GRID) {
                    ret.push(new Action(r, c, nextPlayer));
                }
            }
        }
        return ret;
    }

    isValidAction(action) {
        return this.markAt(action.rowIdx, action.colIdx) == Utils.EMPTY_GRID;
    }
}
