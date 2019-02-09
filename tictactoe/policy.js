class Policy {
    constructor() {
    }

    getAction(state) {
        return state.nextActions[0];
    }
}

class RandomPolicy extends Policy {
    constructor() {
        super();
    }

    getAction(state) {
        return this.getRandomAction(state);
    }

    getRandomAction(state) {
        const actions = state.nextActions;
        return actions[Math.floor(Math.random() * actions.length)];
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
        return state.nextPlayer === Utils.PLAYER1 ?
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
        let action = null;
        if (Math.random() > this.epsilon) {
            action = this.getBestAction(state);
            console.log(`[ε-greedy] best hand: ${Utils.kifu(action.rowIdx, action.colIdx)}`);
        } else {
            action = this.getRandomAction(state);
            console.log(`[ε-greedy] random hand: ${Utils.kifu(action.rowIdx, action.colIdx)}`);
        }
        return action;
    }

    getRandomAction(state) {
        const actions = state.nextActions;
        return actions[Math.floor(Math.random() * actions.length)];
    }
}
