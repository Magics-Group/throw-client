import React from 'react';
import {
    IconButton, Dialog, RaisedButton
}
from 'material-ui';

import PlayerActions from '../actions';

class Header extends React.Component {

    state = {
        qrCode: null,
        pairingOpen: false
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.uiShown !== this.props.uiShown || nextProps.title !== this.props.title || nextState.pairingOpen !== this.state.pairingOpen)
            return true
        return false
    }

    _handelClose() {
        this.props.close()
    }

    componentDidMount() {
        this.props.emitter.on('qrCode', qrCode => this.setState({
            qrCode
        }))
    }


    render() {
        const showHeader = this.props.uiShown;
        return (
            <div className={showHeader ? 'header show' : 'header' }>
                <IconButton onClick={this._handelClose.bind(this)} iconClassName="material-icons" iconStyle={{color: 'white', fontSize: '40px'}} tooltipPosition="bottom-right" tooltip="Main Menu" className="player-close" >arrow_back</IconButton>
                <p className="title">{this.props.title}</p>  
                <IconButton iconClassName="material-icons" onClick={() => this.setState({pairingOpen: true})} className="player-playlist" iconStyle={{color: 'white', fontSize: '30px', right: '-2px', top: '-1px'}} tooltipPosition="bottom-left" tooltip="Pairing QR Code">phonelink</IconButton>
                
                <Dialog
                    title='Quick Pairing QR Code'
                    modal={true}
                    open={this.state.pairingOpen}
                    onRequestClose={() => this.setState({pairingOpen: false})}
                    >
                    {this.state.qrCode}

                    <RaisedButton onClick={() => this.setState({pairingOpen: false})} style={{float: 'right', 'marginRight': '10px', 'position': 'absolute', 'bottom': 0 }} label="Close" />  
                </Dialog>
            </div>
        );
    }
};


export
default Header;