import alt from '../alt'
import appActions from '../actions/appActions'


class appStore {
	constructor() {
		this.bindActions(appActions)


		this.streamURL = false
		this.account = null
	}

	onStream(streamURL) {
		this.streamURL = streamURL
	}
}

export default alt.createStore(appStore)