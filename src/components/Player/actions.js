import alt from '../../alt';
import {
    defer
}
from 'lodash';


class PlayerActions {

    constructor() {
        this.generateActions(
            'newWCJS'
        );
    }
}


export
default alt.createActions(PlayerActions);