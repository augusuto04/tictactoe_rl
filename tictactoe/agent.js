class Agent {
    constructor(evaluator, player1Policy, player2Policy) {
        this.evaluator = evaluator;
        this.player1Policy = player1Policy;
        this.player2Policy = player2Policy;
    }
    getAction(state) {
        if (state.nextPlayer === Utils.PLAYER1) {
            return this.player1Policy(state);
        } else {
            return this.player2Policy(state);
        }
    }
    tellReward(reward, state, action) {
        this.iterateQ(reward, state, action);
    }
}