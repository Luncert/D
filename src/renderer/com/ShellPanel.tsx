import React, { Component } from 'react';

import { Terminal } from 'xterm';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css?global';

import am, { KeyEventHandler } from './AcceleratorManager';
import PtySession from './PtySession';
import './ShellPanel.css';

const MINIMUM_COLS = 2;
const MINIMUM_ROWS = 1;
const PADDING_LEFT = 4;

class ShellKeyEventSource {

    private panelID: string
    private term: Terminal

    constructor(panelID: string, term: Terminal) {
        this.panelID = panelID
        this.term = term
    }

    getName() {
        return this.panelID
    }

    bind(handler: KeyEventHandler) {
        // this.term.element.onkeypress = (evt) => console.log(evt)
        this.term.element.onkeydown = (evt) => {
            console.log(evt)
        }
        // this.term.onKey((evt) => console.log(evt.domEvent))
        // this.term.element.parentElement.onkeydown = (evt) => {
        //     console.log('1', evt)
        //     if (evt.altKey) {
        //     }
        // }
    }
}

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
            fontFamily: 'JetBrainsMono-Regular, Consolas, monospace',
            fontSize: 14,
            theme: {
                foreground: 'white',
                background: 'rgb(34, 36, 53)'
            }
        })
        this.term.loadAddon(new WebLinksAddon())
        this.term.open(this.root);
        // this.term.registerCharacterJoiner((text) => {
        //     console.log(text)
        //     text = '123'
        //     return [[7, 9]]
        // })

        // resize container, terminal and node-pty
        let {cols, rows} = this.computeLayout()
        this.term.resize(cols, rows)
        try {
            this.pty = new PtySession(cols, rows)
            // process data transport
            this.term.onData((data) => this.pty.write(data))
            this.pty.onData((data) => this.term.write(data))
        } catch (e) {
            console.error(e)
        }

        // make xterm be AcceleratorManager's event source
        am.registerKeyEventSource(new ShellKeyEventSource(this.root.parentElement.id, this.term))

        // listen on window resize event
        this.onResize = this.resize.bind(this)
        window.addEventListener('resize', this.onResize)
    }
    
    private onResize: () => void

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize)
        this.term.dispose()
        // failure to create pty in componentDidMount is possible: Windows error 232
        if (this.pty) {
            this.pty.close()
            this.pty = null
        }
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
        return (<div ref={(elem) => this.root = elem} className='shell-container'></div>)
    }
}