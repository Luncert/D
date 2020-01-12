
interface PanelElement {
    root: HTMLElement
    style: HTMLStyleElement
}

export default class Panel {

    public init(): PanelElement {
        return {
            root: null,
            style: null
        }
    }

    public componentDidMount() {

    }

    // public componentDidUnmount() {
        
    // }
}