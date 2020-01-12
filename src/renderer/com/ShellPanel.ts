import Panel from "./Panel";

export default class ShellPanel extends Panel {

    // private cwd: string
    private container: JQuery<HTMLDivElement>
    private textarea: JQuery<HTMLTextAreaElement>
    private canvas: JQuery<HTMLCanvasElement>

    constructor() {
        super()
    }

    init() {
        let style = new HTMLStyleElement()
        style.innerHTML = `
            .scroller::-webkit-scrollbar {
                margin-right: 2px;
                width: 6px;
                background-color: rgb(47, 48, 63);
            }

            .scroller::-webkit-scrollbar-thumb {
                border-radius: 0;
                background-color: rgba(95, 97, 114);
            }

            .scroller::-webkit-scrollbar-thumb:hover {
                background-color: rgb(95, 97, 114);
            }

            .scroller::-webkit-scrollbar-track {
                background-color: rgb(47, 48, 63);
            }
            
            .shell-textarea {
                position: absolute;
                top: 0; left: 0;
                opacity: 0.1;
                /* z-index: -10; */
                white-space: nowrap;
                resize: none;
                overflow: hidden;
            }
            
            .content-layer {
                background-color: rgba(40, 40, 40, 0.5);
            }
        `

        let root = new HTMLDivElement()
        this.container = $(root)
        this.container.addClass('scroller')

        this.textarea = $(`
            <textarea ref='shellTextarea'
                className='shell-textarea'
                tabIndex={0}
                aria-label='Ternimal input'
                aria-multiline='false'
                autoCorrect='off'
                autoCapitalize='off'
                spellCheck='false'
                style={{
                    lineHeight: 14,
                    width: 6.60938,
                    height: 14,
                    left: 99.1406,
                    top: 14 * 1
                }}
                >
            </textarea>
        `)
        this.textarea.appendTo(this.container)

        this.canvas = $(`
            <canvas ref='contentLayer' className='content-layer'
                width={400} height={600}>
            </canvas>
        `)
        this.canvas.appendTo(this.container)

        return {root, style};
    }

}
