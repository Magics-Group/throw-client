import {
    throttle
}
from 'lodash';
import {
    EventEmitter
}
from 'events';

class PlayerEvents extends EventEmitter {
    constructor() {
        super();

        this.on('wcjsLoaded', wcjs => {
            this._wcjs = wcjs;

            this._wcjs.onPositionChanged = throttle(pos => this.emit('position', pos), 500);
            this._wcjs.onOpening = () => this.emit('opening');
            this._wcjs.onTimeChanged = time => this.emit('time', time);
            this._wcjs.onBuffering = throttle(buf => this.emit('buffering', buf), 500);
            this._wcjs.onLengthChanged = length => this.emit('length', length);
            this._wcjs.onSeekableChanged = Seekable => this.emit('seekable', Seekable);
            this._wcjs.onPlaying = () => this.emit('playing', true);
            this._wcjs.onPaused = () => this.emit('playing', false);
            this._wcjs.onStopped = () => this.emit('playing', false);
            this._wcjs.onEndReached = () => this.emit('ended');
            this._wcjs.onEncounteredError = err => this.emit('error', err);
            this._wcjs.onMediaChanged = () => this.emit('changed');
        });

        this.on('play', url => this._wcjs.play(url));
        this.on('volumeChange', volume => {
            this._wcjs.volume = volume;
            this.emit('volume', volume)
        });
        this.on('close', () => {
            this._wcjs.stop()
            const events = ['opening', 'position', 'time', 'volume', 'buffering', 'length', 'seekable', 'playing', 'ended', 'changed', 'mouseMove', 'closed'];
            events.forEach(event => this.removeAllListeners(event));
            this.emit('closed');
        });
    }
};


export
default PlayerEvents;