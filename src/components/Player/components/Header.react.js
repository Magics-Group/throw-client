import React from 'react';
import {
    IconButton
}
from 'material-ui';

import PlayerActions from '../actions';

class Header extends React.Component {
    shouldComponentUpdate(nextProps) {
        if (nextProps.uiShown !== this.props.uiShown || nextProps.title !== this.props.title)
            return true;

        return false;
    }

    _handelClose() {
        this.props.close()
    }

    render() {
        const showHeader = this.props.uiShown;
        return (
            <div className={showHeader ? 'header show' : 'header' }>
                <IconButton onClick={this._handelClose.bind(this)} iconClassName="material-icons" iconStyle={{color: 'white', fontSize: '40px'}} tooltipPosition="bottom-right" tooltip="Main Menu" className="player-close" >arrow_back</IconButton>
                <p className="title">{this.props.title}</p>  
                <IconButton iconClassName="material-icons" className="player-playlist" iconStyle={{color: 'white', fontSize: '30px', right: '-2px', top: '-1px'}} tooltipPosition="bottom-left" tooltip="Pairing QR Code">phonelink</IconButton>
            </div>
        );
    }
};


export
default Header;