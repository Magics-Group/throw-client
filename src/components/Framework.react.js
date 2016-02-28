import React from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin'

export default class Framework extends React.Component {

    componentWillMount() {
        injectTapEventPlugin()
    }

    render() {
        return (
            <div>
                <div className="row">
                    {React.cloneElement(this.props.children, {query: this.props.query})}
                </div>
            </div>
        )
    }
}