class Agent {
    constructor(evaluator, player1Policy, player2Policy) {
        this.evaluator = evaluator;
        this.player1Policy = player1Policy;
        this.player2Policy = player2Policy;
    }
    getAction(state) {
        let action = null;
        if (state.nextPlayer === Utils.PLAYER1) {
            action = this.player1Policy.getAction(state);
        } else {
            action = this.player2Policy.getAction(state);
        }
        console.log(`computer's hand is ${Utils.kifu(action.rowIdx, action.colIdx)}`);
        return action;
    }
    tellReward(reward, state, action) {
        this.evaluator.iterateQ(reward, state, action);
    }
}