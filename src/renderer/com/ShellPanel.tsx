import React, { Component } from 'react';

import { Terminal } from 'xterm';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css?global';

import { PageProps } from './PanelManager';
import PtySession from './PtySession';

const styles = require('./ShellPanel.css') as any;

const MINIMUM_COLS = 2;
const MINIMUM_ROWS = 1;
const PADDING_LEFT = 4;

interface ShellPanelState {
}

export default class ShellPanel extends Component<PageProps, ShellPanelState> {

    private root: HTMLDivElement
    private term: Terminal
    private pty: PtySession

    private tagLightTimer: NodeJS.Timeout

    constructor(props: any) {
        super(props)
        this.state = {
        }
        this.props.setRef(this)
    }

    componentDidMount() {
        this.term = new Terminal({
            cursorBlink: true,
            cursorStyle: 'underline',
            fontFamily: 'JetBrainsMono-Regular, Consolas, monospace',
            fontSize: 14,
            theme: {
                foreground: 'white',
                background: 'rgb(34, 36, 53)'
            }
        })
        // filter part of key events to allow AcceleratorManager process them
        this.term.attachCustomKeyEventHandler((event) => {
            if (event.ctrlKey) {
                if (event.keyCode == 9) { // ctrl + tab
                    return false
                }
                if (event.keyCode == 78) { // ctrl + n
                    return false
                }
                if (event.keyCode == 87) { // ctrl + w
                    return false
                }
                if (event.keyCode == 220) { // ctrl + \
                    return false
                }
                // if (event.keyCode == 83) { // ctrl + s
                //     return false
                // }
            }
            return true
        })
        // load WebLinkedAddon
        this.term.loadAddon(new WebLinksAddon())
        this.term.open(this.root)

        // resize container, terminal and node-pty
        let {cols, rows} = this.computeLayout()
        this.term.resize(cols, rows)
        try {
            this.pty = new PtySession(cols, rows)
            // process data transport
            this.term.onData((data) => this.pty.write(data))
            this.pty.onData((data) => {
                this.term.write(data)

                if (this.tagLightTimer != null) {
                    clearTimeout(this.tagLightTimer)
                }
                this.updatePageTag(true)
                this.tagLightTimer = setTimeout(() => this.updatePageTag(false), 100)
            })
        } catch (e) {
            console.error(e)
        }

        this.props.updatePageTag(
            <span>
                <span className={styles.tagStatusLight}></span>
                Powershell
            </span>)
    }

    private updatePageTag(enableTagLight: boolean) {
        this.props.updatePageTag(
            <span>
                <span className={styles.tagStatusLight} style={{
                    backgroundColor: enableTagLight ? 'rgb(0, 204, 255)' : 'rgb(1, 117, 146)'
                }}></span>
                Powershell
            </span>)
    }

    componentWillUnmount() {
        this.term.dispose()
        // failure to create pty in componentDidMount is possible: Windows error 232
        if (this.pty) {
            this.pty.close()
            this.pty = null
        }
    }

    // will be invoked by PanelManager
    resize() {
        if (this.root) {
            let { cols, rows } = this.computeLayout()
            // each xterm will bind resize event on window by themself,
            // I dont't if it matters.
            this.term.resize(cols, rows)
            this.term.refresh(0, -1)
            // this.pty.resize(cols, rows)
        }
    }

    focus() {
        this.term.focus()
    }

    computeLayout() {
        const rootStyle = window.getComputedStyle(this.root)
        const core = (this.term as any)._core;
        const dims = core._renderService.dimensions
        
        const availableWidth = parseInt(rootStyle.getPropertyValue('width')) - PADDING_LEFT - core.viewport.scrollBarWidth
        const availableHeight = parseInt(rootStyle.getPropertyValue('height'))
        
        return {
            cols: Math.max(MINIMUM_COLS, Math.floor(availableWidth / dims.actualCellWidth)),
            rows: Math.max(MINIMUM_ROWS, Math.floor(availableHeight / dims.actualCellHeight))
        }
    }

    render() {
        return (<div ref={(elem) => this.root = elem} className={styles.shellContainer}></div>)
    }
}