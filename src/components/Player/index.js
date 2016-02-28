import React from 'react'

import Header from './components/Header.react'
import Controls from './components/Controls.react'
import Render from './components/Renderer.react'

import PlayerEvents from './extensions/playerEvents'

import PlayerStore from './store'
import PlayerActions from './actions'

const PlayerEmitter = new PlayerEvents()

class Player extends React.Component {

    state = {
        files: PlayerStore.getState().files,
        playlistIndex: PlayerStore.getState().playlistIndex,
        wcjs: false,
        uiShown: true
    };

    emitter = PlayerEmitter;


    componentWillMount() {
        PlayerStore.listen(this._update);
        this.emitter.on('wcjsLoaded', wcjs => {
            this.setState({
                wcjs
            });
            this.emitter.emit('play', this.state.files[this.state.playlistIndex] ? this.state.files[this.state.playlistIndex].url : "http://archive.org/download/CartoonClassics/Krazy_Kat_-_Keeping_Up_With_Krazy.mp4");
        });
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

    _update = () => {
        this.setState(PlayerStore.getState());
    }

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
        console.log('top level render')
        return (
            <div className="wcjs-player">
                <Header uiShown={this.state.uiShown} title={this.state.files[this.state.playlistIndex] ? this.state.files[this.state.playlistIndex].title : null} />
                <Render emitter={this.emitter} />
                <Controls emitter={this.emitter} uiShown={this.state.uiShown} wcjs={this.state.wcjs} />
            </div>
        );
    }
};


export
default Player;