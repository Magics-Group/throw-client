import alt from '../alt'
import _ from 'lodash'
import appActions from '../actions/appActions'


class appStore {
    constructor() {
        this.bindActions(appActions)
    }
}

export
default alt.createStore(appStore)