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

    openPlayer = ({url, title = ''}) => this.setState({
        url,
        title,
        PlayerOpen: true
    });

    render() {
        return (
            <div>
                <div className="row">
                    <DashBoard open={!this.state.PlayerOpen} openPlayer={this.openPlayer} />
                    <If test={this.state.PlayerOpen}>
                        <Player close={() => this.setState({url: null, PlayerOpen: false})} url={this.state.url} title={this.state.title} />
                    </If>
                </div>
            </div>
        )
    }
}