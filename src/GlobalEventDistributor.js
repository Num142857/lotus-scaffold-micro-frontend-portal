export class GlobalEventDistributor {

    constructor() {
        this.stores = [];
    }

    registerStore(store) {
        this.stores.push(store);
    }

    dispatch(event) {
        this.stores.forEach((s) => {
            s.dispatch(event)
            setTimeout(()=>s.dispatch({type:'REFRESH'}))
            
        });
    }
    getState() {
        let state = {};
        this.stores.forEach((s) => {
            let currentState = s.getState();
            console.log(currentState)
            state[currentState.namespace] = currentState
        });
        return state
    }
}