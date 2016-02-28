import React from 'react';
import {
    PropTypes
}
from 'react-router';
import {
    IconButton
}
from 'material-ui';

import PlayerActions from '../actions';

class Header extends React.Component {

    static contextTypes = {
        history: PropTypes.history
    };

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
            </div>
        );
    }
};


export
default Header;