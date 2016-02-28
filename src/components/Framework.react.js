import React from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin'
import Player from './Player'
import DashBoard from './Dashboard'


export default class Framework extends React.Component {

    state = {
        url: false,
        PlayerOpen: false
    };

    componentWillMount() {
        injectTapEventPlugin()
    }

    setUrl = url => {
        console.log(url)
        this.setState({
            url,
            open: true
        })
    }

    render() {
        return (
            <div>
                <div className="row">
                    <DashBoard setUrl={this.setUrl} />
                    <Player open={this.state.PlayerOpen} url={this.state.url} />
                </div>
            </div>
        )
    }
}