import alt from '../../alt';
import playerActions from './actions';

class playerStore {
    constructor() {
        this.bindActions(playerActions);

        this.files = [];
        this.playlistIndex = 0;
        this.wcjs = false;
    }

    onSetFiles(files) {
        this.files = files;
    }

    onNewWCJS(wcjs) {
        this.wcjs = wcjs;
    }
}

export
default alt.createStore(playerStore);