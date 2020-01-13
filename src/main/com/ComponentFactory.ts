import { ipcMain } from 'electron';
import RPC_EVT_NAME, { RPCParam } from '../../common/rpc';

class Remote {

    emit(event: string | symbol, ...args: any[]): boolean {
        return ipcMain.emit(event, args)
    }
}

export class Component {

    protected remote: Remote = new Remote()

    get name() {
        return ''
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    executeAction(action: string, params: []): any {
        console.log(action, params)
        let func = ((<any>this)[action])
        if (func && typeof(func) === 'function') {
            return func.apply(this, params)
        }
    }
}

export default class ComponentFactory {

    private componnents: Map<string, Component>

    constructor() {
        this.componnents = new Map()
    }

    loadComponent(com: Component) {
        if (this.componnents.has(com.name)) {
            throw new Error()
        }
        this.componnents.set(com.name, com)
    }

    serve() {
        this.componnents.forEach((com) => {
            com.componentDidMount()
        })

        ipcMain.on(RPC_EVT_NAME, (event, param: RPCParam) => {
            let com = this.componnents.get(param.component)
            if (com != null) {
                event.returnValue = com.executeAction(param.action, param.params)
            }
        })
    }

    stop() {
        this.componnents.forEach((com) => {
            com.componentWillUnmount()
        })
        this.componnents.clear()
    }
}
