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
}


export
default alt.createActions(PlayerActions);