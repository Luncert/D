import React, { Component } from 'react';
import { Terminal } from 'xterm';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';
import Q from 'jquery';

import PtySession from './PtySession';
import './ShellPanel.css';

const MINIMUM_COLS = 2;
const MINIMUM_ROWS = 1;
const PADDING = 4;

export default class ShellPanel extends Component {

    private term: Terminal
    private pty: PtySession

    constructor(props: any) {
        super(props)
    }

    componentDidMount() {
        let root = (this.refs.root as HTMLDivElement)
        this.term = new Terminal({
            cursorBlink: true,
            cursorStyle: 'underline',
            theme: {
                foreground: 'white',
                background: 'rgb(34, 36, 53)'
            }
        })
        this.term.loadAddon(new WebLinksAddon())
        this.term.open(root)
        
        // resize container, terminal and node-pty
        let {cols, rows} = this.computeLayout()
        this.term.resize(cols, rows)
        this.pty = new PtySession(cols, rows)

        // listen on window resize event
        Q(window).resize(() => this.resize())
        
        // process data transport
        this.pty.onData((data) => {
            this.term.write(data)
        })

        this.term.onData((data) => {
            // if (evt.domEvent.keyCode == 9) {
            //     // Tab
            // } else if (evt.domEvent.keyCode == 13) {
            //     // Enter
            //     this.term.write('\r\n')
            // } else {
            //     this.term.write(evt.key)
            // }
            this.pty.write(data)
        })
    }
    
    componentWillUnmount() {
        this.pty.close()
    }

    computeLayout() {
        const rootStyle = window.getComputedStyle(this.refs.root as HTMLDivElement)
        const width = parseInt(rootStyle.getPropertyValue('width'))
        const height = parseInt(rootStyle.getPropertyValue('height'))
        const core = (this.term as any)._core;
        const dims = core._renderService.dimensions
        
        // no right padding
        const availableWidth = width - PADDING - core.viewport.scrollBarWidth;
        const availableHeight = height - PADDING;

        return {
            cols: Math.max(MINIMUM_COLS, Math.floor(availableWidth / dims.actualCellWidth)),
            rows: Math.max(MINIMUM_ROWS, Math.floor(availableHeight / dims.actualCellHeight))
        }
    }

    resize() {
        let { cols, rows } = this.computeLayout()
        this.term.resize(cols, rows)
        this.pty.resize(cols, rows)
    }

    render() {
        return (<div ref='root' className='container'></div>)
    }
}