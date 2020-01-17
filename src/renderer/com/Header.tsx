import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import open from 'open';

import { Channels, WINDOW_STATE } from '../../common/window';

const iconStyles = require('./IconStyle.css') as any;
const styles = require('./Header.css') as any;

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
            <div className={styles.header}>
                <div className={styles.appIcon}
                    onClick={() => open('https://github.com/Luncert/D', {app: 'chrome'})}></div>
                <div className={styles.textArea}>{headerText}</div>
                <div className={styles.dragArea}></div>
                <div className={styles.btnGroup}>
                    <div className={styles.btn}
                        onClick={() => this.setState({windowState: ipcRenderer.sendSync(Channels.MinimizeWindow)})}>
                        <i className={`${iconStyles.iconfont} ${iconStyles.iconMinimal}`}></i>
                    </div>
                    <div className={styles.btn}
                        onClick={() => {
                            if (windowState == WINDOW_STATE.NORMAL) {
                                this.setState({windowState: ipcRenderer.sendSync(Channels.MaximizeWindow)})
                            } else if (windowState == WINDOW_STATE.MAXIMIZED) {
                                this.setState({windowState: ipcRenderer.sendSync(Channels.UnmaximizeWindow)})
                            }
                        }}>
                        <i className={iconStyles.iconfont + ' ' + (windowState === WINDOW_STATE.NORMAL ?
                            iconStyles.iconMaximal1 : iconStyles.iconMaximal2)}></i>
                    </div>
                    <div className={styles.btn}
                        onClick={() => this.setState({windowState: ipcRenderer.sendSync(Channels.CloseWindow)})}>
                        <i className={`${iconStyles.iconfont} ${iconStyles.iconClose}`}></i>
                    </div>
                </div>
            </div>
        )
    }
}