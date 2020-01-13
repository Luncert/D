import os from 'os';
import { IPty } from 'node-pty';
import { Component } from './ComponentFactory';
import uuid from 'uuid/v4';
const NodePty = require('node-pty')

interface PtySession {
    ptyProc: IPty
}

export default class ShellCom extends Component {
    private sessions: Map<string, PtySession> = new Map()

    get name() {
        return 'shell-com'
    }

    newSession() {
        let sid = uuid()
        this.sessions.set(sid, { ptyProc: null })
        return sid
    }

    startPtyProc(sid: string, cols: number, rows: number) {
        let s = this.sessions.get(sid)
        if (s) {
            let shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
            s.ptyProc = NodePty.spawn(shell, [], {
                name: 'xterm-color',
                cols: cols,
                rows: rows,
                cwd: process.env.HOME,
                env: process.env
            })
            s.ptyProc.on('data', (data: any) => {
                this.remote.emit(sid, data)
            })

        }
    }

    resize(sid: string, cols: number, rows: number) {
        let s = this.sessions.get(sid)
        if (s) {
            s.ptyProc.resize(cols, rows)
        }
    }

    closeSession(sid: string) {
        let s = this.sessions.get(sid)
        if (s) {
            if (s.ptyProc != null) {
                s.ptyProc.kill()
            }
            this.sessions.delete(sid)
        }
    }
}
