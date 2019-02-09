class Evaluator {
    constructor(gamma, alpha) {
        this.policy = new BestHandPolicy(this);
        this.gamma = gamma;
        this.alpha = alpha;
        this.values ={};
    }

    getQ(state, action) {
        const nextState = state.nextState(action);
        if (!(nextState.encode in this.values)) {
            this.values[nextState.encode] = Utils.DEFAULT_VALUE;
        }
        return this.values[nextState.encode];
    }

    iterateQ(reward, state, action) {
        const nextState = state.nextState(action);
        const q = this.getQ(state, action);
        let updatedQ = null;

        if (nextState.nextActions.length > 0) {
            const a = this.policy.getAction(nextState);
            updatedQ = q + this.alpha * (reward + this.gamma * this.getQ(nextState, a) - q);
        } else {
            updatedQ = q + this.alpha *(reward - q);
        }

        this.values[nextState.encode] = updatedQ;
        return updatedQ;
    }
}
