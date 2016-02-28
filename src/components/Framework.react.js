import React from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin'
import Player from './Player'
import DashBoard from './Dashboard'

class If extends React.Component {
    render() {
        return this.props.test ? this.props.children : null
    }
}

export default class Framework extends React.Component {

    state = {
        url: false,
        PlayerOpen: false
    };

    componentWillMount() {
        injectTapEventPlugin()
    }

    setUrl = url => this.setState({
        url,
        PlayerOpen: true
    });

    render() {
        return (
            <div>
                <div className="row">
                    <DashBoard open={!this.state.PlayerOpen} setUrl={this.setUrl} />
                    <If test={this.state.PlayerOpen}>
                        <Player close={() => this.setState({url: null, PlayerOpen: false})} url={this.state.url} />
                    </If>
                </div>
            </div>
        )
    }
}