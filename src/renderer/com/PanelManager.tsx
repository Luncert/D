import React, { Component, MouseEventHandler } from 'react';
import ShellPanel from './ShellPanel';
import Q from 'jquery';

import './PanelManager.css';

const DIRECTION = {
    ToLeft: 0,
    ToRight: 1,
    ToTop: 2,
    ToBottom: 3
}

type Direction = number

function isHorizontal(direction: Direction): boolean {
    return direction <= DIRECTION.ToRight
}

interface Position {
    left: number
    top: number
}

interface Size {
    width: number
    height: number
}

interface Bound {
    left: number
    top: number
    width: number
    height: number
}

interface PanelDividerProps {
    direction: Direction
    position: Position
    onMouseDown: MouseEventHandler<HTMLDivElement>
}

class PanelDivider extends Component<PanelDividerProps> {

    render() {
        let direction = this.props.direction
        let style = this.props.position
        style = Object.assign(isHorizontal(direction) ?
            { width: 4, height: '100%', borderLeft: '1px solid rgb(80, 80, 80)', cursor: 'ew-resize' } :
            { width: '100%', height: 4, borderTop: '1px solid rgb(80, 80, 80)', cursor: 'ns-resize' }, style)
        return (
            <div className='panel-divider' style={style}
                onMouseDown={this.props.onMouseDown}
            ></div>
        )
    }
}

interface PanelProps {
    onRef: (ref: Panel) => void
}

interface PanelState {
    firstPanelBound: Size
    dividerPosition: Position
    secondPanelBound: Bound
}

interface DragAttrs {
    startX: number
    startY: number
    originDividerPos: Position
}

const DIVIDER_THICKNESS = 4

class Panel extends Component<PanelProps, PanelState> {

    private splitted: boolean = false
    private direction: Direction
    private newPanelContent: JSX.Element

    private firstPanelRef: Panel
    private secondPanelRef: Panel

    private dragging: boolean = false
    private dragAttrs: DragAttrs

    constructor(props: PanelProps) {
        super(props)
        this.state = {
            firstPanelBound: { width: 0, height: 0},
            dividerPosition: { left: 0, top: 0 },
            secondPanelBound: { left: 0, top: 0, width: 0, height: 0},
        }
        this.props.onRef(this)
    }

    /**
     * split a single panel into two panel contained by the old panel
     * @param direction 
     */
    public split(direction: Direction, content: JSX.Element) {
        if (!this.splitted) {
            this.splitted = true
            this.direction = direction
            this.newPanelContent = content
            this.computeLayout(true)
        } else {
            console.warn('Panel could has been splitted.')
        }
    }

    /**
     * compute the position and size of children panels and divider according to the root panel's size
     */
    private computeLayout(init: boolean = false) {
        const rootStyle = window.getComputedStyle(this.refs.root as HTMLDivElement)
        const rootWidth = parseInt(rootStyle.getPropertyValue('width'))
        const rootHeight = parseInt(rootStyle.getPropertyValue('height'))
        if (init) {
    
            let firstPanelBound, dividerPosition, secondPanelBound
    
            if (isHorizontal(this.direction)) {
                let panelWidth = (rootWidth - DIVIDER_THICKNESS) / 2
                firstPanelBound = { width: panelWidth, height: rootHeight }
                dividerPosition = { left: panelWidth, top: 0}
                secondPanelBound = { left: rootWidth - panelWidth, top: 0, width: panelWidth, height: rootHeight}
            } else {
                let panelHeight = (rootHeight - DIVIDER_THICKNESS) / 2
                firstPanelBound = { width: rootWidth, height: panelHeight }
                dividerPosition = { left: 0, top: panelHeight }
                secondPanelBound = { left: 0, top: rootHeight - panelHeight, width: rootWidth, height: panelHeight }
            }
    
            this.setState({ firstPanelBound, dividerPosition, secondPanelBound })
        } else {
            // do scale
            const { firstPanelBound, secondPanelBound } = this.state
            if (isHorizontal(this.direction)) {
                const ratio = firstPanelBound.width / (firstPanelBound.width + DIVIDER_THICKNESS + secondPanelBound.width)
                
                let firstPanelWidth = rootWidth * ratio
                let secondPanelLeft = firstPanelWidth + DIVIDER_THICKNESS

                this.setState({
                    firstPanelBound: { width: firstPanelWidth, height: firstPanelBound.height},
                    dividerPosition: { left: firstPanelWidth, top: 0 },
                    secondPanelBound: { left: secondPanelLeft, top: 0, width: rootWidth - secondPanelLeft, height: secondPanelBound.height }
                })
            } else {
                const ratio = firstPanelBound.height / (firstPanelBound.height + DIVIDER_THICKNESS + secondPanelBound.height)

                let firstPanelHeight = rootHeight * ratio
                let secondPanelTop = firstPanelHeight + DIVIDER_THICKNESS

                this.setState({
                    firstPanelBound: { width: firstPanelBound.width, height: firstPanelHeight },
                    dividerPosition: { left: 0, top: firstPanelHeight },
                    secondPanelBound: { left: 0, top: secondPanelTop, width: secondPanelBound.width, height: rootHeight - secondPanelTop}
                })
            }
        }
    }

    /**
     * recompute children elements' bound when divider is dragging
     */
    private moveDivider(evt: any) {
        const rootStyle = window.getComputedStyle(this.refs.root as HTMLDivElement)
        const { firstPanelBound, secondPanelBound } = this.state
        const { startX, startY, originDividerPos } = this.dragAttrs
        if (isHorizontal(this.direction)) {
            const rootWidth = parseInt(rootStyle.getPropertyValue('width'))
            let dividerLeft = originDividerPos.left + (evt.clientX - startX)
            this.setState({
                firstPanelBound: { width: dividerLeft, height: firstPanelBound.height },
                dividerPosition: { left: dividerLeft, top: 0 },
                secondPanelBound: { left: dividerLeft + DIVIDER_THICKNESS, top: 0,
                    width: rootWidth - dividerLeft - DIVIDER_THICKNESS, height: secondPanelBound.height }
            })
        } else {
            const rootHeight = parseInt(rootStyle.getPropertyValue('height'))
            let dividerTop = originDividerPos.top + (evt.clientY - startY)
            this.setState({
                firstPanelBound: { width: firstPanelBound.width, height: dividerTop },
                dividerPosition: { left: 0, top: dividerTop},
                secondPanelBound: { left: 0, top: dividerTop + DIVIDER_THICKNESS,
                    width: secondPanelBound.width, height: rootHeight - dividerTop - DIVIDER_THICKNESS}
            })
        }
    }

    public resize() {
        this.computeLayout()
        if (this.splitted) {
            this.firstPanelRef.resize()
            this.secondPanelRef.resize()
        }
    }

    public onMouseMove(evt: any) {
        if (this.dragging) {
            this.moveDivider(evt)
        } else if (this.splitted) {
            this.firstPanelRef.onMouseMove(evt)
            this.secondPanelRef.onMouseMove(evt)
        }
    }

    /**
     * stop dragging
     * @param evt 
     */
    public onMouseUp() {
        if (this.dragging) {
            this.dragging = false
        } else if (this.splitted) {
            this.firstPanelRef.onMouseUp()
            this.secondPanelRef.onMouseUp()
        }
    }

    render() {
        const { firstPanelBound, dividerPosition, secondPanelBound } = this.state
        if (this.splitted) {
            let toRightOrBottom = (this.direction == DIRECTION.ToRight ||
                this.direction == DIRECTION.ToBottom)

            return (
                <div ref='root' className='panel-container'>
                    <div className='panel-wrapper'
                        style={firstPanelBound}>
                        <Panel onRef={(ref) => this.firstPanelRef = ref}>
                            {toRightOrBottom ? this.props.children : this.newPanelContent}
                        </Panel>
                    </div>
                    <PanelDivider direction={this.direction} position={dividerPosition}
                        onMouseDown={({ nativeEvent }) => {
                            this.dragging = true
                            this.dragAttrs = {
                                startX: nativeEvent.clientX,
                                startY: nativeEvent.clientY,
                                originDividerPos: dividerPosition
                            }
                        }}
                    />
                    <div className='panel-wrapper'
                        style={secondPanelBound}>
                        <Panel onRef={(ref) => this.secondPanelRef = ref}>
                            {toRightOrBottom ? this.newPanelContent : this.props.children}
                        </Panel>
                    </div>
                </div>
            )
        } else {

        }
        return (
            <div ref='root' className='panel'>{this.props.children}</div>
        )
    }
}

export default class PanelManager extends Component {

    private childRef: Panel

    constructor(props: any) {
        super(props)
    }

    componentDidMount() {
        Q(window).resize(() => this.childRef.resize())
        Q(window).mousemove((evt) => this.childRef.onMouseMove(evt))
        Q(window).mouseup(() => this.childRef.onMouseUp())

        this.childRef.split(DIRECTION.ToBottom, <span><ShellPanel /></span>)
    }

    render() {
        return (
            <div ref='root' style={{
                width: '100%', height: 'calc(100% - 30px)',
                backgroundColor: 'rgb(34, 36, 53)'
            }}>
                <Panel onRef={(ref) => this.childRef = ref}><ShellPanel /></Panel>
            </div>
        )
    }
}