import { IPty } from 'node-pty';
const NodePty = <any>require('node-pty');

export type DataProcessor = (data: string) => void

export default class PtySession {
    private ptyProc: IPty

    constructor(cols: number, rows: number) {
        this.ptyProc = NodePty.spawn('powershell.exe', ['-NoLogo'], {
            name: 'xterm-color',
            cols: cols,
            rows: rows,
            cwd: process.env.HOME,
            env: process.env,
        })
    }

    onData(dataProcessor: DataProcessor) {
        this.ptyProc.on('data', dataProcessor)
    }

    write(data: string) {
        this.ptyProc.write(data)
    }

    resize(cols: number, rows: number) {
        this.ptyProc.resize(cols, rows)
    }

    close() {
        if (this.ptyProc) {
            this.ptyProc.kill()
        }
    }
}