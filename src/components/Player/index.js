import React from 'react'

import Header from './components/Header.react'
import Controls from './components/Controls.react'
import Render from './components/Renderer.react'

import PlayerEvents from './extensions/playerEvents'

import PlayerStore from './store'
import PlayerActions from './actions'

export
default class Player extends React.Component {

	state = {
		wcjs: false,
		uiShown: true
	};

	emitter = new PlayerEvents();

	componentWillMount() {
		PlayerStore.listen(this._update);
	}

	componentDidMount() {
		document.addEventListener('mousemove', this._onMouseMove);
		this.hoverTimeout = setTimeout(() => this.setState({
			uiShown: false
		}), 3000);
	}

	componentWillUnmount() {
		PlayerStore.unlisten(this._update);
		document.removeEventListener('mousemove', this._onMouseMove);
		this.emitter.emit('close');
		this.hoverTimeout && clearTimeout(this.hoverTimeout);
	}


	_update = () => this.setState(PlayerStore.getState());

	_onMouseMove = () => {
		this.hoverTimeout && clearTimeout(this.hoverTimeout);
		if (this.state.uiShown)
			return this.hoverTimeout = setTimeout(() => this.setState({
				uiShown: false
			}), 3000);
		this.emitter.emit('mouseMove');
		const UIShown = this.setState({
			uiShown: true
		});
		this.hoverTimeout = setTimeout(UIShown, 3000);
	}

	render() {
		return (
			<div className="wcjs-player">
                <Header close={this.props.close} uiShown={this.state.uiShown} title={this.props.url} />
                <Render url={this.props.url} emitter={this.emitter} />
                <Controls emitter={this.emitter} uiShown={this.state.uiShown} wcjs={this.state.wcjs} />
            </div>
		);
	}
}