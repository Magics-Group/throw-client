import alt from '../../alt';
import playerActions from './actions';

class playerStore {
    constructor() {
        this.bindActions(playerActions);

        this.wcjs = false;
    }

    onNewWCJS(wcjs) {
        this.wcjs = wcjs;
    }
}

export
default alt.createStore(playerStore);