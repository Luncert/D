import Component from "./Component";
import $ from 'jquery';
import './ShellPanel.css';

const FontFace = (window as any).FontFace

const data = 
`*你好.scroller::-webkit-scrollbar-thumb:hover xxxxxxxxxxxxxxxxxxxxxxxxxx {
    background-color: rgb(95, 97, 114);
}

.scroller::-webkit-scrollbar-track {
    background-color: rgb(47, 48, 63);
}

.container {
    position: relative;
    width: 300px;
    height: 300px;
    overflow: hidden;
    border: 1px solid gray;
}

.shell-textarea {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.1;
    /* z-index: -10; */
    white-space: nowrap;
    resize: none;
    overflow: hidden;
}

.content-layer {
    background-color: rgba(40, 40, 40, 0.5);
}`

interface ShellBound {
    width: number
    height: number
}

interface FontAttr {
    fontSize: number
    lineHeight: number
    letterSpacing: number
}

interface ScrollBarAttr {
    scrollTop: number
    height: number
    scrollHeight: number
}

export default class ShellPanel extends Component {

    // private cwd: string
    private container: JQuery<HTMLDivElement>
    private scrollBar: JQuery<HTMLDivElement>
    private textarea: JQuery<HTMLTextAreaElement>
    private content: JQuery<HTMLCanvasElement>

    private bound: ShellBound
    private fontAttr: FontAttr
    private scrollBarAttr: ScrollBarAttr

    constructor() {
        super()
        this.bound = {
            width: 300,
            height: 300
        }
        this.fontAttr = {
            fontSize: 20,
            lineHeight: 16,
            letterSpacing: 1
        }
        this.scrollBarAttr = {
            height: 10,
            scrollTop: 0,
            scrollHeight: this.bound.height - 10
        }
    }

    componentDidMount() {
        // bind mousewhell event for scroll-bar
        this.content.bind('mousewheel', ({originalEvent}) => {
            let evt = (originalEvent as WheelEvent)

            let tmp = this.scrollBarAttr.scrollTop
            tmp += this.fontAttr.lineHeight * (evt.deltaY > 0 ? 1 : -1)

            if (tmp < 0) {
                tmp = 0
            } else if (tmp > this.scrollBarAttr.scrollHeight) {
                tmp = this.scrollBarAttr.scrollHeight
            }
            this.scrollBar.css('top', tmp)
            this.scrollBarAttr.scrollTop = tmp
        })

        // load custom font and draw
        let font = new FontFace('Core', `url(${require('../res/font/Core.otf').default})`)
        font.load().then((font: any) => {
            (document as any).fonts.add(font)
        }).then(() => {
            let ctx = this.content[0].getContext('2d')
            ctx.font = `${this.fontAttr.fontSize}px/${this.fontAttr.lineHeight}px Core`
            ctx.fillStyle = 'black'

            let yNum = Math.floor(this.bound.height / this.fontAttr.lineHeight)

            for (let i = 0, c, startX = 0, y = 1; y <= yNum; i++) {
                c = data[i]
                if (c == '\n') {
                    startX = 0
                    y++
                } else {
                    let actualWidth = ctx.measureText(c).width
                    let tmp = startX + actualWidth
                    if (tmp > this.bound.width) {
                        startX = 0
                        y++
                        tmp = actualWidth
                    }
                    ctx.fillText(c, startX, y * this.fontAttr.lineHeight)
                    startX = tmp + this.fontAttr.letterSpacing
                }
            }
        }).catch((e: any) => console.error(e))
    }

    init() {
        let root = document.createElement('div')
        this.container = $(root)
        this.container.addClass('container')
        this.container.css('width', this.bound.width + 11)
        this.container.css('height', this.bound.height)

        this.scrollBar = $(`<div class='scroll-bar'></div>`)
        this.scrollBar.appendTo(this.container)

        this.textarea = $(`
            <textarea class='shell-textarea'
                tabindex='0'
                aria-label='Ternimal input'
                aria-multiline='false'
                autocorrect='off'
                autocapitalize='off'
                spellcheck='false'
                >
            </textarea>
        `)
        this.textarea.css('lineHeight', this.fontAttr.letterSpacing)
        this.textarea.css('width', 6.60938)
        this.textarea.css('height', 14)
        this.textarea.css('left', 99.1406)
        this.textarea.css('top', 14)
        this.textarea.appendTo(this.container)

        this.content = $(`<canvas class='content-layer'></canvas>`)
        this.content.attr('width', this.bound.width)
        this.content.attr('height', this.bound.height)
        this.content.appendTo(this.container)

        return root;
    }

}
