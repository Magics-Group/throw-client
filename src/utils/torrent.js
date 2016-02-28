import peerflix from 'peerflix'
import Promise from 'bluebird'
import path from 'path'
import {
    app
}
from 'remote'
import readTorrent from 'read-torrent'
import getPort from 'get-port'
import _ from 'lodash'

const temp = path.join(app.getPath('temp'), 'throw-desktop')

module.exports = {
    streams: {},

    init(torrent) {
        return Promise.all([this.read(torrent), getPort()])
            .spread((torrentInfo, port) => {
                let engine = peerflix(torrentInfo, {
                    tracker: true,
                    port,
                    tmp: temp,
                    buffer: (1.5 * 1024 * 1024).toString(),
                    connections: 200
                });
                this.streams[engine.infoHash] = engine;
                engine['stream-port'] = port;
                return engine
            })
    },
    destroy(infoHash) {
        if (this.streams[infoHash]) {
            if (this.streams[infoHash].server._handle)
                this.streams[infoHash].server.close();
            this.streams[infoHash].destroy();
        }
    },
    read(torrent) {
        return new Promise((resolve, reject) => readTorrent(torrent, (err, parsedTorrent) => (err || !parsedTorrent) ? reject(err) : resolve(parsedTorrent)))
    }
};