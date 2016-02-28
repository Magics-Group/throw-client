import React from 'react'

import {
    IconButton
}
from 'material-ui'

import {
	PropTypes
}
from 'react-router'

export default class extends React.Component {

	static contextTypes = {
		history: PropTypes.history
	};

    render() {
        return (
            <div className="col-lg-12">

            	<IconButton iconClassName="material-icons" onClick={() => this.context.history.replace('/')} iconStyle={{color: '#767A7B', fontSize: '30px', top: '-2px', right: '2px'}} className="settings" >arrow_back</IconButton>
                <h4>About</h4>
                <p>Throw v0</p>
                <p>creators...</p>
                <p>licese...</p>
            </div>
        )
    }
}