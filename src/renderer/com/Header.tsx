import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import open from 'open';

import { Channels, WINDOW_STATE } from '../../common/window';

import './FontStyle.css';
import './Header.css';

interface State {
    headerText: string
    windowState: number
}

export default class Header extends Component<any, State> {

    constructor(props: any) {
        super(props)
        this.state = {
            headerText: 'Ternimal D',
            windowState: this.fetchWindowState()
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize.bind(this))
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize.bind(this))
    }

    onResize() {
        this.setState({ windowState: this.fetchWindowState() })
    }

    fetchWindowState() {
        return ipcRenderer.sendSync(Channels.FetchWindowState)
    }

    render() {
        const { headerText, windowState } = this.state
        return (
            <div className='header'>
                <div className='app-icon'
                    onClick={() => open('https://github.com/Luncert/D', {app: 'chrome'})}></div>
                <div className='text-area'>{headerText}</div>
                <div className='drag-area'></div>
                <div className='btn-group'>
                    <div className='btn'
                        onClick={() => this.setState({windowState: ipcRenderer.sendSync(Channels.MinimizeWindow)})}>
                        <i className='iconfont icon2zuixiaohua-1'></i>
                    </div>
                    <div className='btn'
                        onClick={() => {
                            if (windowState == WINDOW_STATE.NORMAL) {
                                this.setState({windowState: ipcRenderer.sendSync(Channels.MaximizeWindow)})
                            } else if (windowState == WINDOW_STATE.MAXIMIZED) {
                                this.setState({windowState: ipcRenderer.sendSync(Channels.UnmaximizeWindow)})
                            }
                        }}>
                        <i className={'iconfont ' + (windowState === WINDOW_STATE.NORMAL ?
                            'icon3zuidahua-1' : 'icon3zuidahua-3')}></i>
                    </div>
                    <div className='btn'
                        onClick={() => this.setState({windowState: ipcRenderer.sendSync(Channels.CloseWindow)})}>
                        <i className='iconfont icon4guanbi-1'></i>
                    </div>
                </div>
            </div>
        )
    }
}