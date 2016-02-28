import React from 'react'
import _ from 'lodash'
import {
    RaisedButton, Paper, IconButton, Dialog, TextField
}
from 'material-ui'

import {dialog} from 'remote'

import Dropzone from 'react-dropzone'

import torrentEngine from '../../utils/torrent'


class If extends React.Component {
    render() {
        return this.props.test ? this.props.children : null
    }
}

export default class Dashboard extends React.Component {

    state = {
        urlAddOpen: false,
        torrentAddOpen: false,
        loadingModal: false
    };

    addTorrent() {
        const torrent = this.refs['torrent-text'].getValue()

        if (!torrent || !torrent.length > 0) return


        this.streamTorrent(torrent)
    }

    streamURL = (url = this.refs['url-text'].getValue()) => {
        if (!url || !url.length > 0) return


        this.setState({
            loadingModal: false,
            urlAddOpen: false
        })
    	console.log(url)
        this.props.setUrl(url)
    };


    onDrop = files => {

    	if(!files || files.length === 0 || !files[0] || !files[0].type.includes('video/')) return

    	this.props.setUrl(`file:///${files[0].path}`)



    };



    streamTorrent = (torrent = false) => {
        if (!torrent) return console.error('No torrent defined something has gone horribly wrong!')

        console.log(torrent)
        torrentEngine.init(torrent)
            .then(engine => {
                this.setState({
                    loadingModal: true
                })
                engine.on('ready', () => {
                    this.setState({
                        loadingModal: false,
                        torrentAddOpen: false
                    })
                    this.props.setUrl(`http://localhost:${engine['stream-port']}`)
                })
            })
    };

    render() {

        if (!this.props.open) return null



        return (
            <Dropzone onDrop={this.onDrop} multiple={false} disableClick={true} className="wrapper">
               <center>
                    <div ref="dropper">
                        <div>

  
                            <span className="fl_sl">select an option from below</span>
                            <br/>
                            <br/>
                                    <br/>
                                            <br/>
                                                    <br/>
                            <div className="mainButHold">
                                <RaisedButton style={{float: 'left', width: '130px'}} onClick={() => this.setState({torrentAddOpen: true})} label="Add Torrent" />
                                <RaisedButton style={{width: '130px'}} onClick={() =>
                                	dialog.showOpenDialog({
                                		title: 'Select a Video',
                                		properties: ['openFile', 'createDirectory'],
                                		filters: [{
                                			name: 'Videos',
                                			extensions: ["mkv", "avi", "mp4", "mpg", "mpeg", "webm", "flv", "ogg", "ogv", "mov", "wmv", "3gp", "3g2"]
                                			}]	
                                	}, filename => {
                                		this.props.setUrl(`file:///${filename}`)
                               		})
                                }label="Add Video" />

                                <RaisedButton style={{float: 'right', width: '130px'}} onClick={() => this.setState({urlAddOpen: true})} label="Use a URL" />
                            </div>

        					<Dialog
          						title={this.state.loadingModal ? 'Loading...' : 'Stream Torrent'}
          						modal={true}
          						open={this.state.torrentAddOpen}
          						onRequestClose={() => this.setState({torrentAddOpen: false})}
        					>
                                <If test={!this.state.loadingModal}>
                                    <div>
        					        <TextField ref="torrent-text" style={{'marginBottom': '15px' }} fullWidth={true} onEnterKeyDown={() => this.addTorrent()} hintText="Magnet/Torrent URI" />
                				    <RaisedButton secondary={true} onClick={() => this.addTorrent()} style={{float: 'right', }} label="Stream" />
                                    <RaisedButton onClick={() => this.setState({torrentAddOpen: false})} style={{float: 'right', 'marginRight': '10px' }} label="Cancel" />
                                    </div>
                                </If>
                                <If test={this.state.loadingModal}>
                                    <div className="loader"/>
                                </If>
                			</Dialog>



                            <Dialog
                                title='Stream URL'
                                modal={true}
                                open={this.state.urlAddOpen}
                                onRequestClose={() => this.setState({StreamAddOpen: false})}
                            >
                              
                                 
                                    <TextField ref="url-text" style={{'marginBottom': '15px' }} fullWidth={true} onEnterKeyDown={() => this.streamURL()} hintText="Video URL" />
                                    <RaisedButton secondary={true} onClick={() => this.streamURL()} style={{float: 'right', }} label="Stream" />
                                    <RaisedButton onClick={() => this.setState({urlAddOpen: false})} style={{float: 'right', 'marginRight': '10px' }} label="Cancel" />
                                  
                                
                            </Dialog>
                        </div>
                    </div>
               </center>
            </Dropzone>
        )
    }
}