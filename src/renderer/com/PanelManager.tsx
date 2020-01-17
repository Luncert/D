import React, { Component } from 'react';
import am, { KEYS, CombineKey, keySequence } from './AcceleratorManager';
import { ipcRenderer } from 'electron';
import { Channels } from '../../common/window';
import SettingPanel from './SettingPage';
import ShellPanel from './ShellPanel';

// TODO: 切换page会卸载ShellPanel导致session关闭，在ShellPanel卸载的时候把pty收集起来
const styles = require('./PanelManager.css') as any;

interface Page {
    name: string
    element: JSX.Element
}

interface PanelManagerState {
    activeViewIdx: number
}

export default class PanelManager extends Component<any, PanelManagerState> {

    private root: HTMLDivElement
    private pages: Page[]

    constructor(props: any) {
        super(props)
        this.pages = [{ name: 'python2.7', element: <ShellPanel /> }]
        this.state = {
            activeViewIdx: 0
        }
    }

    componentDidMount() {
        document.onkeydown = (evt) => am.emit('panel-manager', evt)

        am.register(this.switchPage.bind(this),
            keySequence(new CombineKey(KEYS.TAB, false, true)))
        am.register(this.newPage.bind(this),
            keySequence(new CombineKey(KEYS.N, false, true)))
        am.register(this.closePage.bind(this),
            keySequence(new CombineKey(KEYS.W, false, true)))

        this.newPage()
    }

    newPage() {
        this.pages.push({ name: 'Settings', element: <SettingPanel />})
        this.setState({activeViewIdx: this.pages.length - 1})
    }

    switchPage() {
        this.setState({activeViewIdx: (this.state.activeViewIdx + 1) % this.pages.length})
    }

    closePage() {
        const { activeViewIdx } = this.state
        this.pages.splice(activeViewIdx, 1)
        if (this.pages.length == 0) {
            ipcRenderer.sendSync(Channels.CloseWindow)
        } else {
            this.setState({activeViewIdx: activeViewIdx % this.pages.length})
        }
    }

    render() {
        const { activeViewIdx } = this.state

        let pageContent = this.pages[activeViewIdx].element

        return (
            <div ref={(elem) => this.root = elem} className={styles.panelManager}>
                <div className={styles.page}>{pageContent}</div>
                <div className={styles.tagBar}>
                    {
                        this.pages.map((item, idx) => {
                            if (idx == activeViewIdx) {
                                return (
                                    <div key={idx} className={`${styles.tag} ${styles.active}`}>
                                        <div className={styles.tagRadius}></div>
                                        {item.name}
                                        <div className={styles.tagRadius}></div>
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={idx} className={styles.tag}>{item.name}</div>
                                )
                            }
                        })
                    }
                </div>
            </div>
        )
    }
}