import React, { Component } from 'react';

import { Terminal } from 'xterm';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';

import PtySession from './PtySession';
import fontManager from './FontManager';
import './ShellPanel.css';

const MINIMUM_COLS = 2;
const MINIMUM_ROWS = 1;
const PADDING_LEFT = 4;

export default class ShellPanel extends Component {

    private root: HTMLDivElement
    private term: Terminal
    private pty: PtySession

    constructor(props: any) {
        super(props)
    }

    componentDidMount() {
        this.term = new Terminal({
            cursorBlink: true,
            cursorStyle: 'underline',
            theme: {
                foreground: 'white',
                background: 'rgb(34, 36, 53)'
            }
        })
        this.term.loadAddon(new WebLinksAddon())
        this.term.open(this.root)

        // resize container, terminal and node-pty
        let {cols, rows} = this.computeLayout()
        this.term.resize(cols, rows)
        this.pty = new PtySession(cols, rows)
        
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

        // listen on window resize event
        this.onResize = this.resize.bind(this)
        window.addEventListener('resize', this.onResize)

        fontManager.loadFontAsync('Core', () => {
            this.term.setOption('fontFamily', 'Core')
            // this.term.setOption('fontSize', 20)
            this.term.setOption('letterSpacing', 1)
        })
    }
    
    private onResize: () => void

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize)
        this.term.dispose()
        this.pty.close()
    }

    resize() {
        let { cols, rows } = this.computeLayout()
        // each xterm will bind resize event on window by themself,
        // I dont't if it matters.
        this.term.resize(cols, rows)
        this.pty.resize(cols, rows)
    }

    computeLayout() {
        const rootStyle = window.getComputedStyle(this.term.element.parentElement)
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
        return (<div ref={(elem) => this.root = elem} className='container'></div>)
    }
}