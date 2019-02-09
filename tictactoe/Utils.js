class Utils {
    static get PLAYER1() {
        return '1';
    }

    static get PLAYER2() {
        return '2';
    }

    static get EMPTY_GRID() {
        return '0';
    }

    static get DEFAULT_STATE() {
        return '000000000';
    }

    static get TIE_GAME() {
        return '0'
    }

    static get DEFAULT_VALUE() {
        return 0;
    }

    static get PLAYER1_WINNING_VALUE() {
        return 10000;
    }

    static get PLAYER2_WINNING_VALUE() {
        return -10000;
    }

    static get TIE_VALUE() {
        return 0;
    }

    static get ROW_NUM() {
        return 3;
    }

    static get COL_NUM() {
        return 3;
    }

    static get GRID_NUM() {
        return 9;
    }

    static stateIdx(rowIdx, colIdx) {
        return parseInt(rowIdx) * 3 + parseInt(colIdx);
    }

    static changeCharAt(str, idx, char) {
        return str.substr(0, idx) + char + str.substr(idx + 1);
    }

    static kifu(rowIdx, colIdx) {
        const row = ['1', '2', '3'];
        const col = ['a', 'b', 'c'];
        return col[parseInt(colIdx)] + row[parseInt(rowIdx)];
    }
}