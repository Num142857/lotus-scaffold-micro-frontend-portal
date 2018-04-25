export class GlobalEventDistributor {

    constructor() {
        this.stores = [];
    }

    registerStore(store) {
        this.stores.push(store);
    }

    dispatch(event) {
        this.stores.forEach((s) => s.dispatch(event));
    }
    getState(event) {
        let state = [];
        this.stores.forEach((s) => {
            state.push(s.getState(event)) 
        });
        return state
    }
}