class Policy {
    constructor() {
    }

    getAction(state) {
        return state.nextActions[0];
    }
}

class RandomPolicy extends Policy {
    constructor() {
    }

    getAction(state) {
        return this.getRandomAction(state.nextActions);
    }

    getRandomAction(actions) {
        return actions[Math.floor(Math.random() * nextActions.length)];
    }
}

class BestHandPolicy extends Policy {

    constructor(evaluator) {
        super();
        this.evaluator = evaluator;
    }

    getAction(state) {
        return this.getBestAction(state);
    }

    getBestAction(state) {
        return state.nextPlayer == Utils.PLAYER1 ?
            this.getActionWithMaxValue(state) : this.getActionWithMinValue(state);
    }

    getActionWithMaxValue(state) {
        const actions = state.nextActions;
        let ret;
        let maxQ = Utils.PLAYER2_WINNING_VALUE;
        for (let i = 0; i < actions.length; i++) {
            const tmpQ = this.evaluator.getQ(state, actions[i]);
            if (i === 0 || tmpQ > maxQ) {
                ret = actions[i];
                maxQ = tmpQ;
            }
        }
        return ret;
    }

    getActionWithMinValue(state) {
        const actions = state.nextActions;
        let ret;
        let minQ = Utils.PLAYER1_WINNING_VALUE;
        for (let i = 0; i < actions.length; i++) {
            const tmpQ = this.evaluator.getQ(state, actions[i]);
            if (i === 0 || tmpQ < minQ) {
                ret = actions[i];
                minQ = tmpQ;
            }
        }
        return ret;
    }
}

class EpsilonGreedy extends BestHandPolicy {

    constructor(evaluator, epsilon) {
        super(evaluator);
        this.epsilon = epsilon;
    }

    getAction(state) {
        if (Math.random() > this.epsilon) {
            return this.getBestAction(state);
        } else {
            return this.getRandomAction(state);
        }
    }

    getRandomAction(actions) {
        return actions[Math.floor(Math.random() * nextActions.length)];
    }
}
