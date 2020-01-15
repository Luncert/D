import { ITerminalAddon, Terminal } from "xterm";

export default class MyAddon implements ITerminalAddon {
    constructor() {}
  
    public activate(terminal: Terminal): void {
        console.log(terminal)
    }
  
    public dispose(): void {}
}
  
  