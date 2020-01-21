import React, { Component, MouseEventHandler } from 'react';
import am, { KEYS, CombineKey, keySequence } from './AcceleratorManager';
import { ipcRenderer } from 'electron';
import { Channels } from '../../common/window';
// import SettingPanel from './SettingPanel';
import ShellPanel from './ShellPanel';

const styles = require('./PanelManager.css') as any;

interface PanelDividerProps {
    onMouseDown: MouseEventHandler<HTMLDivElement>
    style?: any
}

class PanelDivider extends Component<PanelDividerProps> {

    render() {
        let style = this.props.style
        return (
            <div className={styles.panelDivider} style={style}
                onMouseDown={this.props.onMouseDown}
            ></div>
        )
    }
}

interface PageContent {
    resize(): void
    focus(): void
}

interface PageProps {
    setRef(instance: PageContent): void
    updatePageTag(elem: JSX.Element): void
}

interface Panel {
    instance: PageContent
    width: number | string
}

interface Page {
    name: string
    type: React.ClassType<any, Component, typeof Component>
    elem: HTMLDivElement // ref to page's dom element
    tag: JSX.Element
    activePanelIdx: number
    panels: Panel[]
}

interface PanelManagerState {
    activePageIdx: number
}

const MAX_PAGE_NUM = 10
const PANEL_DIVIDER_WIDTH = 3
const MAX_PANEL_PER_PAGE = 4

export default class PanelManager extends Component<any, PanelManagerState> {

    private pages: Page[]
    private dragAttr: {
        dividerIdx: number
        originLeftOffset: number
        originLeftPanelWidth: number
        originRightPanelWidth: number
    }
    
    private onResize: () => void
    private onMouseMove: (evt: any) => void
    private onMouseUp: () => void

    constructor(props: any) {
        super(props)
        this.pages = []
        this.dragAttr = null
        this.state = {
            activePageIdx: -1,
        }
    }

    componentDidMount() {
        document.onkeydown = (evt) => am.emit('panel-manager', evt)

        am.register(this.switchPage.bind(this),
            keySequence(new CombineKey(KEYS.TAB, false, true))) // ctrl + tab
        am.register(() => this.createPage(ShellPanel),
            keySequence(new CombineKey(KEYS.N, false, true))) // ctrl + n
        am.register(this.closeActivePage.bind(this),
            keySequence(new CombineKey(KEYS.W, false, true))) // ctrl + w
        am.register(this.newPanel.bind(this),
            keySequence(new CombineKey(KEYS.BACKSLASH, false, true))) // ctrl + \
        am.register(this.closeActivePanel.bind(this),
            keySequence(new CombineKey(KEYS.W, false, true, true))) // ctrl + shift + w
        am.register(this.switchPanel.bind(this),
            keySequence(new CombineKey(KEYS.TAB, false, true, true))) // ctrl + shift + tab
        // am.register(() => this.createPage({ name: 'Settings', type: SettingPanel }),
        //     keySequence(new CombineKey(KEYS.S, false, true))) // ctrl + s

        this.createPage(ShellPanel)

        this.bindWindowEvent()
    }

    componentWillUnmount() {
        this.unbindWindowEvent()
    }

    get activePage() {
        return this.pages[this.state.activePageIdx]
    }

    get currentPageSplitted() {
        return this.activePagePanelNum > 1
    }

    get draggingDivider() {
        return this.dragAttr != null
    }

    get activePanel() {
        return this.activePage.panels[this.activePage.activePanelIdx]
    }

    get activePagePanelNum() {
        return this.activePage.panels.length
    }

    bindWindowEvent() {
        this.onResize = () => {
            if (this.currentPageSplitted) {
                this.computePageLayout()
            }
            this.forceUpdate(() => this.resizePanelContent())
        }
        window.addEventListener('resize', this.onResize)

        // on drag
        this.onMouseMove = (evt: MouseEvent) => {
            if (this.draggingDivider) {
                this.moveDivider(evt)
            }
        }
        window.addEventListener('mousemove', this.onMouseMove)

        // stop drag
        this.onMouseUp = () => {
            if (this.draggingDivider) {
                this.dragAttr = null
                am.enable()
            }
        }
        window.addEventListener('mouseup', this.onMouseUp)
    }

    unbindWindowEvent() {
        window.removeEventListener('resize', this.onResize)
        window.removeEventListener('mousemove', this.onMouseMove)
        window.removeEventListener('mouseup', this.onMouseUp)
    }

    createPage(type: React.ClassType<any, Component, typeof Component>) {
        if (this.pages.length >= MAX_PAGE_NUM) {
            console.error('max page num')
        } else {
            let page: Page = {name: this.pages.length.toString(), type: type,
                elem: null, tag: null, activePanelIdx: 0,
                panels: [ {instance: null, width: '100%'} ]}
            this.pages.push(page)
            this.setState({activePageIdx: this.pages.length - 1},
                () => this.activePanel.instance.focus())
        }
    }

    switchPage() {
        this.setState({activePageIdx: (this.state.activePageIdx + 1) % this.pages.length},
            () => this.activePanel.instance.focus())
    }

    closeActivePage() {
        const { activePageIdx } = this.state
        this.pages.splice(activePageIdx, 1)
        if (this.pages.length == 0) {
            ipcRenderer.sendSync(Channels.CloseWindow)
        } else {
            this.setState({activePageIdx: activePageIdx % this.pages.length})
        }
    }

    newPanel() {
        const page = this.activePage
        if (page.panels.length >= MAX_PANEL_PER_PAGE) {
            console.error('max panel num')
        } else {
            page.panels.push({ instance: null, width: 0 })
            this.computePageLayout()
            page.activePanelIdx = page.panels.length - 1
            this.forceUpdate(() => {
                this.resizePanelContent()
                this.activePanel.instance.focus()
            })
        }
    }

    /**
     * be invoked when
     * 1.create new panel
     * 2.drag divider
     * 3.close a panel
     * 4.window resize event
     */
    resizePanelContent() {
        this.activePage.panels.forEach((panel) => {
            if (panel.instance && panel.instance.resize) {
                panel.instance.resize()
            }
        })
    }

    computePageLayout() {
        const panels = this.activePage.panels
        const width = parseInt(window.getComputedStyle(this.activePage.elem).getPropertyValue('width'))
        let panelWidth = Math.floor((width - (panels.length - 1) * PANEL_DIVIDER_WIDTH) / panels.length)
        panels.forEach((item) => {
            item.width = panelWidth
        })
        panels[panels.length - 1].width = width - (panels.length - 1) * (PANEL_DIVIDER_WIDTH + panelWidth)
    }

    switchPanel() {
        this.activePage.activePanelIdx = (this.activePage.activePanelIdx + 1) % this.activePagePanelNum
        this.forceUpdate(() => this.activePanel.instance.focus())
    }

    moveDivider(evt: MouseEvent) {
        const { dividerIdx, originLeftOffset,
            originLeftPanelWidth, originRightPanelWidth } = this.dragAttr
        let leftPanel = this.activePage.panels[dividerIdx - 1]
        let rightPanel = this.activePage.panels[dividerIdx]
        let deltaX = evt.clientX - originLeftOffset
        const pageWidth = parseInt(window.getComputedStyle(this.activePage.elem).width)
        const minPanelWidth = pageWidth / MAX_PANEL_PER_PAGE
        if (originLeftPanelWidth + deltaX < minPanelWidth) {
            leftPanel.width = minPanelWidth
            rightPanel.width = originRightPanelWidth + (originLeftPanelWidth - minPanelWidth)
        } else if (originRightPanelWidth - deltaX < minPanelWidth) {
            rightPanel.width = minPanelWidth
            leftPanel.width = originLeftPanelWidth + (originRightPanelWidth - minPanelWidth)
        } else {
            leftPanel.width = originLeftPanelWidth + deltaX
            rightPanel.width = originRightPanelWidth - deltaX
        }
        this.forceUpdate()
        this.resizePanelContent()
    }

    closeActivePanel() {
        this.activePage.panels.splice(this.activePage.activePanelIdx, 1)
        if (this.activePagePanelNum == 0) {
            this.closeActivePage()
        } else {
            this.activePage.activePanelIdx %= this.activePagePanelNum
            this.computePageLayout()
            this.forceUpdate(() => this.resizePanelContent())
        }
    }

    render() {
        const { activePageIdx } = this.state

        return (
            <div className={styles.panelManager}>
                <div className={styles.content}>
                    {
                        this.pages.map((page, pageIdx) => (
                            // page
                            <div key={pageIdx}
                                className={styles.page}
                                ref={(elem) => page.elem = elem}
                                // Bug: this.pages[pageIdx].elem = elem, panelIdx may be out of bound
                                style={{zIndex: pageIdx == activePageIdx ? 1 : -1}}>
                                {
                                    // panel
                                    (() => {
                                        let left = 0
                                        return page.panels.map((panel, panelIdx) => {
                                            let content = React.createElement(page.type, {
                                                setRef: (ins: PageContent) => panel.instance = ins,
                                                updatePageTag: (elem: JSX.Element) => {
                                                    page.tag = elem
                                                    this.forceUpdate()
                                                }
                                            })
                                            let ret;
                                            if (panelIdx == 0) {
                                                ret = (
                                                    <div key={panelIdx}
                                                        className={styles.panelWrapper}
                                                        style={{width: panel.width}}>
                                                        <div className={styles.panel + ' ' +
                                                            (panelIdx == this.activePage.activePanelIdx ? styles.activePanel : '')}>
                                                            {content}
                                                        </div>
                                                    </div>
                                                )
                                                left += (panel.width as number)
                                            } else {
                                                ret = ([
                                                    <PanelDivider key={`divider-${panelIdx}`}
                                                        onMouseDown={({ nativeEvent }) => {
                                                            if (this.activePagePanelNum < MAX_PANEL_PER_PAGE) {
                                                                // disable all key bindings
                                                                am.disable()
                                                                this.dragAttr = {
                                                                    dividerIdx: panelIdx,
                                                                    originLeftOffset: nativeEvent.clientX,
                                                                    originLeftPanelWidth: this.activePage.panels[panelIdx - 1].width as number,
                                                                    originRightPanelWidth: this.activePage.panels[panelIdx].width as number,
                                                                }
                                                            }
                                                        }}
                                                        style={{left: left}} />,
                                                    <div key={panelIdx}
                                                        className={styles.panelWrapper}
                                                        style={{left: left + PANEL_DIVIDER_WIDTH, width: panel.width}}>
                                                        <div className={styles.panel + ' ' +
                                                            (panelIdx == this.activePage.activePanelIdx ? styles.activePanel : '')}>
                                                            {content}
                                                        </div>
                                                    </div>
                                                ])
                                                left += (panel.width as number) + PANEL_DIVIDER_WIDTH
                                            }
                                            return ret
                                        })
                                    })()
                                }
                            </div>
                        ))
                    }
                </div>
                <div className={styles.tagBar}>
                    {
                        this.pages.map((page, idx) => {
                            if (idx == activePageIdx) {
                                return (
                                    <div key={idx} className={`${styles.tag} ${styles.active}`}>
                                        <div className={styles.tagRadius}></div>
                                        {page.tag != null ? page.tag : page.name}
                                        <div className={styles.tagRadius}></div>
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={idx} className={styles.tag}>
                                        {page.tag != null ? page.tag : page.name}
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
        )
    }
}

export {
    PageProps
}