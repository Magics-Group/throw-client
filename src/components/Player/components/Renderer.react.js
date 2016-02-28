import React from 'react';
import path from 'path';
import wcjsRenderer from '../utils/wcjs-renderer';
import _ from 'lodash';
import {
    RaisedButton
}
from 'material-ui';
import {
    app
}
from 'electron';

import PlayerActions from '../actions';
import PlayerStore from '../store';


const pluginPaths = (process.env.NODE_ENV === 'development') ? path.join(__dirname, '../../../../bin/', 'WebChimera.js.node') : path.join(app.getAppPath(), '../bin/', 'WebChimera.js.node');

try {
    var wcjs = require(pluginPaths);
} catch (e) {
    console.error('WCJS Load Error:', e);
}


export
default class extends React.Component {
    constructor() {
        super();

        this.state = PlayerStore.getState();
        this._initWCJS = this._initWCJS.bind(this);
    }

    componentDidMount() {
        this._initWCJS();
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.wcjs !== this.props.wcjs)
            return true;

        return false;
    }

    _initWCJS() {
        if (!this.state.wcjs) {
            this.props.emitter.emit('wcjsLoaded', wcjsRenderer.init(this.refs['wcjs-render'], [
                "--no-sub-autodetect-file"
            ], {
                fallbackRenderer: false,
                preserveDrawingBuffer: true
            }, wcjs));
        } else {
            this.props.emitter.emit('wcjsLoaded', wcjsRenderer.reinit(this.refs['wcjs-render'], this.state.wcjs, {
                fallbackRenderer: false,
                preserveDrawingBuffer: true
            }));
        }
    }

    render() {
        console.log('player renderer render')
        const renderStyles = {
            container: {
                textAlign: 'center'
            },
            canvas: {
                display: 'inline-block',
                height: '100vh',
                opacity: 1,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)'
            }
        };
        return (
            <div ref="canvas-holder" className="canvas-holder" style={renderStyles.container}>
                <canvas id="playerCanvas" style={renderStyles.canvas}  ref="wcjs-render" />
            </div>
        );
    }
};