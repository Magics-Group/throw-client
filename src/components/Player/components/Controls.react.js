﻿import React from 'react'
import mousetrap from 'mousetrap'

import moment from 'moment'
import _ from 'lodash'
import {
    remote
}
from 'electron'
import {
    IconButton, Slider
}
from 'material-ui'
import PlayerActions from '../actions'


export
default class extends React.Component {

    state = {
        totalTime: 0,
        time: 0,
        position: 0,

        volume: 100,
        muted: false,

        playing: false,
        buffering: false,
        fullscreen: false,

        scrobbling: false,
        scrobblePercent: 0,
        scrobbleTime: 0,

        rippleEffects: false
    };

    mounted = false;
    _cacheState = {};

    _throttledStateUpdater = _.throttle(() => {
        if (!this.mounted)
            return;
        this.setState(this._cacheState);
        this._cacheState = {};
    }, 1000);

    componentDidMount() {
        this.mounted = true
        this.props.emitter.on('playing', playing => this.setState({
            playing
        }))

        this.props.emitter.on('volume', volume => this.setState({
            muted: false,
            volume
        }))

        this.props.emitter.on('mouseMove', () => {
            if (this.props.uiShown) return

            this.setState(this._cacheState)
        })

        this.props.emitter.on('time', time => {
            this._cacheState.time = time
            if (!this.props.uiShown) return

            this._throttledStateUpdater()
        })

        this.props.emitter.on('position', position => {
            this._cacheState.position = position
            if (!this.props.uiShown)
                return
            this._throttledStateUpdater()
        })

        this.props.emitter.on('length', length => {
            this._cacheState.totalTime = length
            if (!this.props.uiShown) return

            this._throttledStateUpdater()
        })

        Mousetrap.bind('esc', () => {if(this.state.fullscreen)this._handleToggleFullscreen()}, 'keyup')
    }
    
    componentWillUnmount() {
        this.mounted = false
    }

    _getHumanTime(times) {
        const humanize = (ms = 0) => {
            let time = moment.duration(ms)
            let hours = (time.hours() !== 0)
            let seconds = ('0' + time.seconds()).slice(-2);
            return hours ? (time.hours() + ':' + ('0' + time.minutes()).slice(-2) + ':' + seconds) : (time.minutes() + ':' + seconds)
        }
        if (Array.isArray(times)) {
            let returnTimes = []
            _.forEach(times, ms => returnTimes.push(humanize(ms)))
            return returnTimes
        }
        return humanize(times)
    }

    _handelMute() {
        this.props.wcjs.toggleMute()
        this.setState({
            muted: !this.state.muted
        })
    }

    _handleToggleFullscreen() {
        remote.getCurrentWindow().setFullScreen(!this.state.fullscreen)
        this.setState({
            fullscreen: !this.state.fullscreen
        })
    }

    _handleScrobblerHover(event) {
        const scrobblePercent = event.pageX / document.body.clientWidth
        const scrobbleTime = this.state.totalTime * scrobblePercent

        if (this.state.scrobbling)
            this.setState({
                scrobbleTime,
                scrobblePercent: scrobblePercent * 100
            })
    }

    _handleScrobble(){
        this.setState({scrobbling: false})
        this.props.emitter.emit('scrobble', this.state.scrobbleTime)
    }


    render() {
        const [CurrentTime, TotalTime, ScrobbleTime] = this._getHumanTime([this.state.time, this.state.totalTime, this.state.scrobbleTime])

        return (
            <div className={'control-bar ' + (this.props.uiShown ? 'show' : null)}>
                <div 
                    onMouseDown={() => this.setState({scrobbling: true})} 
                    onMouseUp={() => this._handleScrobble()}
                    onMouseMove={this._handleScrobblerHover.bind(this)}
                    className="scrobbler-padding" />

                <div ref="scrobbler-height" className="scrobbler">
                    <div className="buffer"/>
                    <div ref="scrobbler-time" style={{width: this.state.scrobbling ? this.state.scrobblePercent+'%' : this.state.position * 100 + '%'}} className="time"/>
                    <div ref="scrobbler-tooltip" style={{left: this.state.scrobblePercent+'%', display: this.state.scrobbling ? 'inline-block' : 'none'}} className="tooltip">{ScrobbleTime}</div>
                    <div ref="scrobbler-shownTime" className="shownTime">
                        <span ref="scrobbler-currentTime" className="currentTime">{CurrentTime}</span> / <span ref="scrobbler-totalTime">{TotalTime}</span>
                    </div>
                    <div ref="scrobbler-handle" className="handle"/>
                </div>

    			<IconButton onClick={() => this.props.emitter.emit('togglePause')} iconClassName="material-icons" className={this.state.rippleEffects ? 'play-toggle' : 'play-toggle no-ripples'}>{this.state.playing ? 'pause' : 'play_arrow'}</IconButton>
                <IconButton iconClassName="material-icons" onClick={() => this.props.emitter.emit('skipBackward')} className="prev-button">{'skip_previous'}</IconButton>
                <IconButton iconClassName="material-icons" onClick={() => this.props.emitter.emit('skipForward')} className="next-button">{'skip_next'}</IconButton>

                <IconButton onClick={() => this.props.emitter.emit('toggleMute') && this.setState({muted: !this.state.muted})} iconClassName="material-icons" iconStyle={{color: '#e7e7e7'}} className="volume-button">{this.state.muted ? 'volume_off' : this.state.volume <= 0 ? 'volume_mute' : this.state.volume <= 120 ? 'volume_down' : 'volume_up' }</IconButton>
                <Slider name="volume-slider" ref="volume-slider" defaultValue={this.state.volume} step={1} min={0} max={200} onChange={(e, volume) => this.props.emitter.emit('volumeChange', volume)} value={this.state.muted ? 0 : this.state.volume} />
                <IconButton onClick={this._handleToggleFullscreen.bind(this)} iconClassName="material-icons" iconStyle={{color: '#e7e7e7', fontSize: '30px', top: '-5px', left: '-1px'}} className="fullscreen-toggle">{this.state.fullscreen ? 'fullscreen_exit' : 'fullscreen'}</IconButton>
            </div>
        );
    }
};