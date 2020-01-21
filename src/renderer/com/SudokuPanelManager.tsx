// import React, { Component, MouseEventHandler } from 'react';
// import ShellPanel from './ShellPanel';
// import am, { KEYS, CombineKey, keySequence } from './AcceleratorManager';

// import './PanelManager.css';
// import uuid from 'uuid';

// const DIRECTION = {
//     Left: -1,
//     Right: 1,
//     Top: -2,
//     Bottom: 2
// }

// type Direction = number

// function isHorizontal(direction: Direction): boolean {
//     return direction == DIRECTION.Left && direction == DIRECTION.Right
// }

// function isOpposite(direction1: Direction, direction2: Direction) {
//     return direction1 == -direction2
// }

// interface Position {
//     left: number
//     top: number
// }

// interface Size {
//     width: number
//     height: number
// }

// interface Bound {
//     left: number
//     top: number
//     width: number
//     height: number
// }

// interface PanelDividerProps {
//     direction: Direction
//     position: Position
//     onMouseDown: MouseEventHandler<HTMLDivElement>
// }

// class PanelDivider extends Component<PanelDividerProps> {

//     render() {
//         let direction = this.props.direction
//         let style = this.props.position
//         style = Object.assign(isHorizontal(direction) ?
//             { width: 4, height: '100%', borderLeft: '1px solid rgb(80, 80, 80)', cursor: 'ew-resize' } :
//             { width: '100%', height: 4, borderTop: '1px solid rgb(80, 80, 80)', cursor: 'ns-resize' }, style)
//         return (
//             <div className='panel-divider' style={style}
//                 onMouseDown={this.props.onMouseDown}
//             ></div>
//         )
//     }
// }

// interface PanelProps {
//     registerPanel: (panel: Panel) => void // register panel to PanelManager
//     parent?: Panel
// }

// interface PanelState {
//     firstPanelBound: Size
//     dividerPosition: Position
//     secondPanelBound: Bound
// }

// interface DragAttrs {
//     startX: number
//     startY: number
//     originDividerPos: Position
// }

// const DIVIDER_THICKNESS = 4

// class Panel extends Component<PanelProps, PanelState> {
//     private id: string

//     private splitted: boolean = false
//     private direction: Direction
//     private newPanelContent: JSX.Element

//     private parent: Panel
//     private firstPanel: Panel
//     private secondPanel: Panel

//     private dragging: boolean = false
//     private dragAttrs: DragAttrs

//     constructor(props: PanelProps) {
//         super(props)
//         this.id = `panel-${uuid()}`
//         this.parent = this.props.parent
//         this.state = {
//             firstPanelBound: { width: 0, height: 0},
//             dividerPosition: { left: 0, top: 0 },
//             secondPanelBound: { left: 0, top: 0, width: 0, height: 0},
//         }
//         this.props.registerPanel(this)
//     }

//     public getID() { return this.id; }

//     public getNeighbor(direction: Direction): Panel {
//         if (this.parent) {
//             const parent = this.parent

//             if (parent.firstPanel == this) {
//                 if (direction == parent.direction) {
//                     return parent.secondPanel
//                 }
//             } else if (isOpposite(direction, parent.direction)) {
//                 return parent.firstPanel
//             }

//             let parentNeighbor = this.parent.getNeighbor(direction)
//             if (parentNeighbor != null) {
//                 if (!parentNeighbor.splitted) {
//                     return parentNeighbor
//                 } else {
//                     if (Math.abs(parent.direction) == Math.abs(parentNeighbor.direction)) {
//                         // both parent and parent neighbor are horizontal or vertical splitted
//                         return isOpposite(direction, parentNeighbor.direction) ?
//                             parentNeighbor.firstPanel : parentNeighbor.secondPanel
//                     } else {
//                         // return the left top child panel of parent neighbor
//                         return (parentNeighbor.direction == DIRECTION.Left || parentNeighbor.direction == DIRECTION.Top) ?
//                             parentNeighbor.firstPanel : parentNeighbor.secondPanel
//                     }
//                 }
//             }
//         }
//         return null
//     }

//     /**
//      * split a single panel into two panel contained by the old panel
//      * @param direction 
//      */
//     public split(direction: Direction, content: JSX.Element) {
//         if (!this.splitted) {
//             this.splitted = true
//             this.direction = direction
//             this.newPanelContent = content
//             this.computeLayout(true)
//         } else {
//             console.warn('Panel could has been splitted.')
//         }
//     }

//     /**
//      * compute the position and size of children panels and divider according to the root panel's size
//      */
//     private computeLayout(init: boolean = false) {
//         const rootStyle = window.getComputedStyle(this.refs.root as HTMLDivElement)
//         const rootWidth = parseInt(rootStyle.getPropertyValue('width'))
//         const rootHeight = parseInt(rootStyle.getPropertyValue('height'))
//         if (init) {
//             let firstPanelBound, dividerPosition, secondPanelBound
    
//             if (isHorizontal(this.direction)) {
//                 let panelWidth = (rootWidth - DIVIDER_THICKNESS) / 2
//                 firstPanelBound = { width: panelWidth, height: rootHeight }
//                 dividerPosition = { left: panelWidth, top: 0}
//                 secondPanelBound = { left: rootWidth - panelWidth, top: 0, width: panelWidth, height: rootHeight}
//             } else {
//                 let panelHeight = (rootHeight - DIVIDER_THICKNESS) / 2
//                 firstPanelBound = { width: rootWidth, height: panelHeight }
//                 dividerPosition = { left: 0, top: panelHeight }
//                 secondPanelBound = { left: 0, top: rootHeight - panelHeight, width: rootWidth, height: panelHeight }
//             }
    
//             this.setState({ firstPanelBound, dividerPosition, secondPanelBound })
//         } else {
//             // do scale
//             const { firstPanelBound, secondPanelBound } = this.state
//             if (isHorizontal(this.direction)) {
//                 const ratio = firstPanelBound.width / (firstPanelBound.width + DIVIDER_THICKNESS + secondPanelBound.width)
                
//                 let firstPanelWidth = Math.floor(rootWidth * ratio)
//                 let secondPanelLeft = firstPanelWidth + DIVIDER_THICKNESS

//                 this.setState({
//                     firstPanelBound: { width: firstPanelWidth, height: rootHeight},
//                     dividerPosition: { left: firstPanelWidth, top: 0 },
//                     secondPanelBound: { left: secondPanelLeft, top: 0, width: rootWidth - secondPanelLeft, height: rootHeight }
//                 })
//             } else {
//                 const ratio = firstPanelBound.height / (firstPanelBound.height + DIVIDER_THICKNESS + secondPanelBound.height)

//                 let firstPanelHeight = Math.floor(rootHeight * ratio)
//                 let secondPanelTop = firstPanelHeight + DIVIDER_THICKNESS

//                 this.setState({
//                     firstPanelBound: { width: rootWidth, height: firstPanelHeight },
//                     dividerPosition: { left: 0, top: firstPanelHeight },
//                     secondPanelBound: { left: 0, top: secondPanelTop, width: rootWidth, height: rootHeight - secondPanelTop}
//                 })
//             }
//         }
//     }

//     /**
//      * recompute children elements' bound when divider is dragging
//      */
//     private moveDivider(evt: any) {
//         const rootStyle = window.getComputedStyle(this.refs.root as HTMLDivElement)
//         const { firstPanelBound, secondPanelBound } = this.state
//         const { startX, startY, originDividerPos } = this.dragAttrs
//         if (isHorizontal(this.direction)) {
//             const rootWidth = parseInt(rootStyle.getPropertyValue('width'))
//             let dividerLeft = originDividerPos.left + (evt.clientX - startX)
//             this.setState({
//                 firstPanelBound: { width: dividerLeft, height: firstPanelBound.height },
//                 dividerPosition: { left: dividerLeft, top: 0 },
//                 secondPanelBound: { left: dividerLeft + DIVIDER_THICKNESS, top: 0,
//                     width: rootWidth - dividerLeft - DIVIDER_THICKNESS, height: secondPanelBound.height }
//             })
//         } else {
//             const rootHeight = parseInt(rootStyle.getPropertyValue('height'))
//             let dividerTop = originDividerPos.top + (evt.clientY - startY)
//             this.setState({
//                 firstPanelBound: { width: firstPanelBound.width, height: dividerTop },
//                 dividerPosition: { left: 0, top: dividerTop},
//                 secondPanelBound: { left: 0, top: dividerTop + DIVIDER_THICKNESS,
//                     width: secondPanelBound.width, height: rootHeight - dividerTop - DIVIDER_THICKNESS}
//             })
//         }
//     }

//     public resize() {
//         if (this.splitted) {
//             this.computeLayout()
//             this.firstPanel.resize()
//             this.secondPanel.resize()
//         }
//     }

//     public onMouseMove(evt: any) {
//         if (this.dragging) {
//             this.moveDivider(evt)
//         } else if (this.splitted) {
//             this.firstPanel.onMouseMove(evt)
//             this.secondPanel.onMouseMove(evt)
//         }
//     }

//     /**
//      * stop dragging
//      * @param evt 
//      */
//     public onMouseUp() {
//         if (this.dragging) {
//             this.dragging = false
//         } else if (this.splitted) {
//             this.firstPanel.onMouseUp()
//             this.secondPanel.onMouseUp()
//         }
//     }

//     render() {
//         const { firstPanelBound, dividerPosition, secondPanelBound } = this.state
//         if (this.splitted) {
//             let toRightOrBottom = (this.direction == DIRECTION.Right ||
//                 this.direction == DIRECTION.Bottom)

//             return (
//                 <div ref='root' className='panel-container'>
//                     <div className='panel-wrapper'
//                         style={firstPanelBound}>
//                         <Panel parent={this} registerPanel={(childPanel) => {
//                             this.firstPanel = childPanel
//                             this.props.registerPanel(childPanel)
//                         }}>
//                             {toRightOrBottom ? this.props.children : this.newPanelContent}
//                         </Panel>
//                     </div>
//                     <PanelDivider direction={this.direction} position={dividerPosition}
//                         onMouseDown={({ nativeEvent }) => {
//                             this.dragging = true
//                             this.dragAttrs = {
//                                 startX: nativeEvent.clientX,
//                                 startY: nativeEvent.clientY,
//                                 originDividerPos: dividerPosition
//                             }
//                         }}
//                     />
//                     <div className='panel-wrapper'
//                         style={secondPanelBound}>
//                         <Panel parent={this} registerPanel={(childPanel) => {
//                             this.secondPanel = childPanel
//                             this.props.registerPanel(childPanel)
//                         }}>
//                             {toRightOrBottom ? this.newPanelContent : this.props.children}
//                         </Panel>
//                     </div>
//                 </div>
//             )
//         } else {
//             return (
//                 <div id={this.id} ref='root' className='panel active'>
//                     {this.props.children}
//                 </div>
//             )
//         }
//     }
// }

// export default class PanelManager extends Component {

//     private keyDirectionMap: Map<string, Direction>

//     private rootPanel: Panel
//     private panelRegistry: Map<string, Panel>

//     private onResize: () => void
//     private onMouseMove: (evt: any) => void
//     private onMouseUp: () => void

//     constructor(props: any) {
//         super(props)
//         this.panelRegistry = new Map()

//         this.keyDirectionMap = new Map()
//             .set(KEYS.A, DIRECTION.Left)
//             .set(KEYS.D, DIRECTION.Right)
//             .set(KEYS.W, DIRECTION.Top)
//             .set(KEYS.S, DIRECTION.Bottom)
//     }

//     componentDidMount() {
//         // notice: invoke resize.bind(this) twice will create two different function for resize()
//         this.onResize = this.rootPanel.resize.bind(this.rootPanel)
//         window.addEventListener('resize', this.onResize)

//         this.onMouseMove = this.rootPanel.onMouseMove.bind(this.rootPanel)
//         window.addEventListener('mousemove', this.onMouseMove)

//         this.onMouseUp = this.rootPanel.onMouseUp.bind(this.rootPanel)
//         window.addEventListener('mouseup', this.onMouseUp)

//         // switch panel key binding: alt + [WASD]
//         am.register(this.switchActivePanel.bind(this),
//             keySequence(new CombineKey(KEYS.W, true)),
//             keySequence(new CombineKey(KEYS.A, true)),
//             keySequence(new CombineKey(KEYS.S, true)),
//             keySequence(new CombineKey(KEYS.D, true)))
//         // split panel key binding: ctrl + shift + [WASD]
//         am.register(this.splitPanel.bind(this),
//             keySequence(new CombineKey(KEYS.W, false, true, true)),
//             keySequence(new CombineKey(KEYS.A, false, true, true)),
//             keySequence(new CombineKey(KEYS.S, false, true, true)),
//             keySequence(new CombineKey(KEYS.D, false, true, true)))
//     }

//     componentWillUnmount() {
//         window.removeEventListener('resize', this.onResize)
//         window.removeEventListener('mousemove', this.onMouseMove)
//         window.removeEventListener('mouseup', this.onMouseUp)
//     }

//     switchActivePanel(sourceName: string, mainKey: string) {
//         let targetPanel = this.panelRegistry.get(sourceName)
//         let direction = this.keyDirectionMap.get(mainKey)
//         let neighbor = targetPanel.getNeighbor(direction)
//         console.log(sourceName, mainKey, neighbor)
//     }

//     splitPanel(sourceName: string, mainKey: string) {
//         let targetPanel = this.panelRegistry.get(sourceName)
//         let direction = this.keyDirectionMap.get(mainKey)
//         targetPanel.split(direction, <span>hi</span>)
//         console.log(sourceName, mainKey)
//     }

//     registerPanel(panel: Panel) {
//         this.panelRegistry.set(panel.getID(), panel)
//     }

//     render() {
//         return (
//             <div id='panel-mananger' style={{
//                 width: '100%', height: 'calc(100% - 30px)',
//                 backgroundColor: 'rgb(34, 36, 53)'
//             }}>
//                 <Panel ref={(panel) => this.rootPanel = panel}
//                     registerPanel={(panel) => this.registerPanel(panel)}>
//                     <ShellPanel />
//                 </Panel>
//             </div>
//         )
//     }
// }