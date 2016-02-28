import alt from '../../alt';
import {
    defer
}
from 'lodash';


class PlayerActions {

    constructor() {
        this.generateActions(
            'setFiles',
            'newWCJS',
            'close'
        );
    }

    open(opts) {
        this.dispatch();
        const [files, history] = opts;
        this.actions.setFiles(files);
        history.replace('player');
    }
}


export
default alt.createActions(PlayerActions);