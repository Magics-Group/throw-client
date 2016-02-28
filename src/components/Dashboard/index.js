import React from 'react'
import _ from 'lodash'
import {
    RaisedButton, Paper, IconButton, Dialog, TextField
}
from 'material-ui'

import torrentEngine from '../../utils/torrent'


export default class Dashboard extends React.Component {

    state = {
        torrentAddOpen: false
    };

    addTorrent() {
        const torrent = this.refs['torrent-text'].getValue()

        if (!torrent || !torrent.length > 0) return

        this.setState({
            torrentAddOpen: false
        })
        this.streamTorrent(torrent)
    }


    streamTorrent = (torrent = false) => {
        if (!torrent) return console.error('No torrent defined something has gone horribly wrong!')

        console.log(torrent)
        torrentEngine.init(torrent)
            .then(torrent => _.defer(() => this.props.setUrl(`http://localhost:${torrent['stream-port']}`)))
    };

    render() {

        if (!this.props.open) return null

        return (
            <div className="wrapper">
               <center>
                    <div ref="dropper">
                        <div>
                            <div className="mainButtonHolder">
                                 <div className="inButtonHolder">
                                    <IconButton iconClassName="material-icons" iconStyle={{color: '#767A7B', fontSize: '30px', top: '-2px', right: '2px'}} className="settings" >settings</IconButton>
                                    <IconButton iconClassName="material-icons" onClick={() => this.context.history.replace('/about')} iconStyle={{color: '#767A7B', fontSize: '30px', top: '-2px', right: '2px'}} className="settings" >info</IconButton>
                                    <IconButton iconClassName="material-icons" iconStyle={{color: '#767A7B', fontSize: '30px', top: '-2px', right: '2px'}} className="torrent-dash" >view_compact</IconButton>
                                </div>
                            </div>
                            <br/>
                            <b className="fl_dd droid-bold">Drag &amp; Drop a File</b>
                            <br/>
                            <span className="fl_sl">or select an option below</span>
                            <br/>
                            <br/>
                            <div className="mainButHold">
                                <RaisedButton style={{float: 'left', width: '130px', height: '108px'}} onClick={() => this.setState({torrentAddOpen: true})} label="Add Torrent">
                                    <img src="images/icons/torrent-icon.png" style={{marginTop: '13px'}}/>
                                    <br/>
                                    <span className="fl_sl lbl" style={{marginTop: '11px'}}>
                                    Add Torrent
                                    </span>
                                </RaisedButton>
                                <RaisedButton style={{width: '130px', height: '108px'}} onClick={this.addFile} label="Add Video">
                                    <img src="images/icons/video-icon.png" style={{marginTop: '18px'}}/>
                                    <br/>
                                    <span className="fl_sl lbl" style={{marginTop: '15px'}}>
                                    Add Video
                                    </span>
                                </RaisedButton>
                                <RaisedButton style={{float: 'right', width: '130px', height: '108px'}} label="Use a URL">
                                    <img src="images/icons/link-icon.png" style={{marginTop: '17px'}}/>
                                    <br/>
                                    <span className="fl_sl lbl" style={{marginTop: '10px'}}>
                                    Use a URL
                                    </span>
                                </RaisedButton>
                            </div>

        					<Dialog
          						title="Dialog With Actions"
          						modal={false}
          						open={this.state.torrentAddOpen}
          						onRequestClose={() => this.setState({torrentAddOpen: false})}
        					>
        					    <TextField ref="torrent-text" style={{'marginBottom': '15px' }} fullWidth={true} onEnterKeyDown={() => this.addTorrent()} hintText="Magnet/Torrent URI or Video URL" />
                				<RaisedButton secondary={true} onClick={() => this.addTorrent()} style={{float: 'right', }} label="Stream" />
                				<RaisedButton onClick={() => this.setState({torrentAddOpen: false})} style={{float: 'right', 'marginRight': '10px' }} label="Cancel" />
                			</Dialog>
                        </div>
                    </div>
               </center>
            </div>
        )
    }
}