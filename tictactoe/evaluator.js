class Evaluator {
    constructor(gamma, alpha) {
        this.policy = new BestHandPolicy(this);
        this.gamma = gamma;
        this.alpha = alpha;
        this.values ={};
    }

    getQ(state, action) {
        const key = this.constructor.encode(state, action);
        if (!(key in this.values)) {
            this.values[key] = Utils.DEFAULT_VALUE;
        }
        return this.values[key];
    }

    setQ(state, action, value) {
        const key = this.constructor.encode(state, action);
        this.values[key] = value;
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

        this.setQ(state, action, updatedQ);
        return updatedQ;
    }

    static encode(state, action) {
        const nextState = state.nextState(action);
        return nextState.encode;
    }
}
