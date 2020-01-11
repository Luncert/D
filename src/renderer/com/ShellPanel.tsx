// import React, { Component } from 'react';
// import './ShellCom.css';
// import FontList from '../res/font/FontList.json';

// const FontFace = (window as any).FontFace

// const CMD_STATUS = {
//     Success: 0,
//     Failed: 1,
// }

// const STATUS_COLOR = [
//     'rgb(16, 228, 97)',
//     'rgb(228, 16, 16)',
// ]

// interface History {
//     username: string
//     hostname: string
//     workpath: string
//     command: string
//     output: string
//     status: number
// }

// export default class ShellPanel extends Component<any, any> {
//     private history: History[]
//     private username: string = ''
//     private hostname: string = ''
//     private workpath: string = ''

//     constructor(props: any) {
//         super(props)
//         this.history = []
//         this.username = 'root'
//         this.hostname = 'ASxjoIJSAD'
//         this.workpath = '/home/root/.bin/'
//     }

//     onInput(evt: React.KeyboardEvent) {
//         let keyCode = evt.keyCode
//         if (keyCode === 13) {
//             let cmdInput = (this.refs.cmdInput as HTMLDivElement)
//             this.history.push({
//                 username: this.username,
//                 hostname: this.hostname,
//                 workpath: this.workpath,
//                 command: cmdInput.innerHTML,
//                 status: CMD_STATUS.Success,
//                 output: ''
//             })
//             this.forceUpdate()

//             evt.stopPropagation()
//             evt.preventDefault()
//         } else if (keyCode === 9) {
//             // handle TAB
//             console.log('TAB')
            
//             evt.stopPropagation()
//             evt.preventDefault()
//         }
//     }

//     componentDidMount() {
//         let font = new FontFace('Core', `url(${require('../res/font/Core.otf')})`)
//         font.load().then((font: any) => {
//             (document as any).fonts.add(font)
//         }).then(() => {
//             let contentLayer = (this.refs.contentLayer as HTMLCanvasElement)
//             contentLayer.width = 400
//             contentLayer.height = 600
//             let ctx = contentLayer.getContext('2d')
//             ctx.font = '14px/14px Core'
//             ctx.fillStyle = 'red'
//             ctx.fillText('Hello World!', 0, 14)
//             ;
//             (window as any)['ctx'] = ctx
//         }).catch((e: any) => console.error(e))
//     }

//     componentDidUpdate() {
//     }

//     render() {
//         return (
//             <div className='container scroller'>
//                 <textarea ref='shellTextarea'
//                     className='shell-textarea'
//                     tabIndex={0}
//                     aria-label='Ternimal input'
//                     aria-multiline='false'
//                     autoCorrect='off'
//                     autoCapitalize='off'
//                     spellCheck='false'
//                     style={{
//                         lineHeight: 14,
//                         width: 6.60938,
//                         height: 14,
//                         left: 99.1406,
//                         top: 14 * 1
//                     }}
//                     ></textarea>
//                 <canvas ref='contentLayer' className='content-layer'
//                     width={400} height={600}></canvas>
//             </div>
//         )
//     }
// }
// // TODO: 在container上监听键盘事件，而不是最后一个section