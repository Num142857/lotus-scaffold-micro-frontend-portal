export class GlobalEventDistributor {

    constructor() {
        this.stores = [];
    }

    registerStore(store) {
        this.stores.push(store);
    }

    dispatch(event) {
        this.stores.forEach((s) => {
            console.log(event)
            s.dispatch(event)
            s.dispatch({type:'REFRESH'})
        });
    }
    getState(event) {
        let state = {};
        this.stores.forEach((s) => {
            let currentState = s.getState(event);
            console.log(currentState)
            state[currentState.namespace] = currentState
        });
        return state
    }
}