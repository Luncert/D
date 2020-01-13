import { ipcRenderer, IpcRendererEvent } from 'electron';
import RPC_EVT_NAME from '../../common/rpc';

class ComponentExecutor {

    invoke(component: string, action: string, ...params: any): any {
        return ipcRenderer.sendSync(RPC_EVT_NAME, {
            component: component,
            action: action,
            params: params
        })
    }

    on(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) {
        ipcRenderer.on(channel, listener)
    }
}

const componentExecutor = new ComponentExecutor()
export default componentExecutor