import {
    throttle
}
from 'lodash';
import {
    EventEmitter
}
from 'events';
import dns from 'dns'
import os from 'os'
import Promise from 'bluebird'
import {
    remote
}
from 'electron'
import React from 'react'
import ReactQR from 'react-qr'
import socketIO from 'socket.io'
import getPort from 'get-port'


const getInternalIP = () => {
    return new Promise((resolve, reject) => dns.lookup(os.hostname(), (err, add, fam) => {
        if (err) return reject(err)
        resolve(add)
    }))
}


export default class PlayerEvents extends EventEmitter {
    constructor() {
        super()

        this.on('wcjsLoaded', wcjs => {
            this._wcjs = wcjs

            this._wcjs.onPositionChanged = throttle(pos => this.emit('position', pos), 500)
            this._wcjs.onOpening = () => this.emit('opening')
            this._wcjs.onTimeChanged = time => this.emit('time', time)
            this._wcjs.onBuffering = throttle(buf => this.emit('buffering', buf), 500)
            this._wcjs.onLengthChanged = length => this.emit('length', length)
            this._wcjs.onSeekableChanged = Seekable => this.emit('seekable', Seekable)

            this._wcjs.onFrameRendered = (width, height) => {
                const win = remote.getCurrentWindow()
                win.setSize(width, height + 30)
                win.center()
            }

            this._wcjs.onPlaying = () => this.emit('playing', true)
            this._wcjs.onPaused = () => this.emit('playing', false)
            this._wcjs.onStopped = () => this.emit('playing', false)
            this._wcjs.onEndReached = () => this.emit('ended')
            this._wcjs.onEncounteredError = err => this.emit('error', err)
            this._wcjs.onMediaChanged = () => this.emit('changed')
        })


        this.on('scrobble', time => this._wcjs.time = time)
        this.on('togglePause', () => this._wcjs.togglePause())
        this.on('skipForward', () => this._wcjs.time += 30000)
        this.on('skipBackward', () => this._wcjs.time -= 30000)

        this.on('play', url => this._wcjs.play(url));
        this.on('volumeChange', volume => {
            this._wcjs.volume = volume
            this.emit('volume', volume)
        })
        this.on('close', () => {
            this._wcjs.stop()
            const events = ['opening', 'position', 'qrCode', 'time', 'volume', 'buffering', 'length', 'seekable', 'playing', 'togglePause', 'ended', 'changed', 'mouseMove', 'closed']
            events.forEach(event => this.removeAllListeners(event))
            const win = remote.getCurrentWindow()
            win.setKiosk(false)
            win.setSize(575, 350)
            win.center()
            this.emit('closed')
        })


        this.PIN = Math.floor(Math.random() * 5) + 1

        Promise.all([getInternalIP(), getPort()])
            .spread((ip, port) => {
                this.ioServer = socketIO()

                this.ioServer.on('connection', socket => {
                    console.log(socket)
                    let authed = false



                    socket.on('playing', status => this.emit('togglePause'))


                    this.on('auth', pin => authed = (this.PIN === pin))
                    this.on('position', position => socket.emit('position', position))
                    this.on('time', time => socket.emit('time', time))
                    this.on('length', length => socket.emit('length', length))
                    this.on('playing', playing => socket.emit('playing', playing))
                    this.on('ended', () => socket.emit('ended'))
                    this.on('closed', () => {
                        socket.emit('ended')
                        socket.disconnect()
                    })
                })

                this.ioServer.listen(1337)
                this.emit('qrCode', <ReactQR text={JSON.stringify({pin: this.PIN,ip,port})} />)
            })
    }
}