import React, { Component } from 'react';
import './ShellCom.css';

const O = `<!DOCTYPE html>
好的再见
`

interface Props {
    className?: string
    bgColor?: string
}

// TODO: click to copy the content
class Tag extends Component<Props> {

    render() {
        let className = 'tag'
        let bgColor = this.props.bgColor || 'rgb(12, 207, 175)'
        if (this.props.className) {
            className += ' ' + this.props.className
        }
        return (
            <span className={className} style={{backgroundColor: bgColor}}>
                {this.props.children}
                <span className='tag-tail' style={{borderLeftColor: bgColor}}></span>
            </span>
        )
    }
}

const CMD_STATUS = {
    Success: 0,
    Failed: 1,
}

const STATUS_COLOR = [
    'rgb(16, 228, 97)',
    'rgb(228, 16, 16)',
]

interface History {
    username: string
    hostname: string
    workpath: string
    command: string
    output: string
    status: number
}

export default class ShellPanel extends Component<any, any> {
    private history: History[]
    private username: string = ''
    private hostname: string = ''
    private workpath: string = ''

    constructor(props: any) {
        super(props)
        this.history = []
        this.username = 'root'
        this.hostname = 'ASxjoIJSAD'
        this.workpath = '/home/root/.bin/'
    }

    onInput(evt: React.KeyboardEvent) {
        let keyCode = evt.keyCode
        if (keyCode === 13) {
            let cmdInput = (this.refs.cmdInput as HTMLDivElement)
            this.history.push({
                username: this.username,
                hostname: this.hostname,
                workpath: this.workpath,
                command: cmdInput.innerHTML,
                status: CMD_STATUS.Success,
                output: O
            })
            this.forceUpdate()

            evt.stopPropagation()
            evt.preventDefault()
        } else if (keyCode === 9) {
            // handle TAB
            console.log('TAB')
            
            evt.stopPropagation()
            evt.preventDefault()
        }
    }

    focusInput() {
        (this.refs.cmdInput as HTMLDivElement).focus()
    }

    componentDidMount() {
        this.focusInput()
    }

    componentDidUpdate() {
        this.focusInput()
    }

    render() {
        return (
            <div className='container scroller'>
                {
                    this.history.map((item, idx) =>
                        <div key={idx} className='section'>
                            <div >
                                <Tag bgColor='rgb(240, 80, 50)'>{item.username}</Tag>
                                <Tag bgColor='rgb(50, 100, 240)'>{item.hostname}</Tag>
                                <Tag bgColor='rgb(168, 177, 86)'>{item.workpath}</Tag>
                                <div className='cmd-input'>{item.command}</div>
                            </div>
                            <div className='cmd-output'>{item.output}</div>
                        </div>
                    )
                }
                <div key={this.history.length + 1} className='section'
                    onClick={this.focusInput.bind(this)}>
                    <div>
                        <Tag bgColor='rgb(240, 80, 50)'>{this.username}</Tag>
                        <Tag bgColor='rgb(50, 100, 240)'>{this.hostname}</Tag>
                        <Tag bgColor='rgb(168, 177, 86)'>{this.workpath}</Tag>
                        <span ref='cmdInput' className='cmd-input'
                            contentEditable={true}
                            onKeyDown={this.onInput.bind(this)}></span>
                    </div>
                </div>
            </div>
        )
    }
}
// TODO: 在container上监听键盘事件，而不是最后一个section