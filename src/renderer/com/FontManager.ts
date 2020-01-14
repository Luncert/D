
const FONT_RES_PATH = '../res/font'

interface FontInfo {
    fileName: string
    loaded: boolean
}

const FontFace = (window as any).FontFace

class FontManager {

    private fontInfoMap: Map<string, FontInfo>

    constructor() {
        this.fontInfoMap = new Map()
        let fontList: {fontName: string, fileName: string}[] = require('../res/font/FontList.json')
        fontList.forEach((item) => {
            this.fontInfoMap.set(item.fontName, { fileName: item.fileName, loaded: false })
        })
    }

    getFontList(): string[] {
        let ret: string[] = []
        this.fontInfoMap.forEach((_, key) => ret.push(key))
        return ret
    }

    async loadFont(fontName: string) {
        let fontInfo = this.fontInfoMap.get(fontName)
        if (fontInfo == null) {
            throw new Error(`Invalid font name: ${fontName}.`)
        } else if (!fontInfo.loaded) {
            let font = new FontFace(fontName, `url(${require(FONT_RES_PATH + '/' + fontInfo.fileName).default})`)
            await font.load()
            await (document as any).fonts.add(font)
        }
    }

    loadFontAsync(fontName: string, onDone: () => void) {
        let fontInfo = this.fontInfoMap.get(fontName)
        if (fontInfo == null) {
            throw new Error(`Invalid font name: ${fontName}.`)
        } else {
            if (!fontInfo.loaded) {
                // let font = new FontFace(fontName, `url(${require(FONT_RES_PATH + '/' + fontInfo.fileName).default})`)
                let font = new FontFace(fontName, `url(${require('../res/font/Zebra-F.ttf').default}`)
                font.load()
                    .then((font: any) => {
                        (document as any).fonts.add(font)
                    })
                    .then(onDone)
                    .catch((e: any) => {
                        throw new Error('Failed to load font, details: ' + e)
                    })
            }
        }

    }
}

const fontManager = new FontManager()

export default fontManager