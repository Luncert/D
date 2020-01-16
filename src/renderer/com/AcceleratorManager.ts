
import NTreeNode from '../datastruct/NTree';
import LinkedList from '../datastruct/LinkedList';

class CombineKey {
    code: string;
    alt: boolean;
    ctrl: boolean;
    shift: boolean;

    constructor(code: string,
        alt: boolean=false,
        ctrl: boolean=false,
        shift: boolean=false)
    {
        this.code = code;
        this.alt = alt;
        this.ctrl = ctrl;
        this.shift = shift;
    }
}

function keySequence(...keys: CombineKey[]): CombineKey[] {
    return keys
}

const KEYS = {
    META_LEFT: 'MetaLeft',
    WAKEUP: 'WakeUp',
    CAPSLOCK: 'CapsLock',
    TAB: 'Tab',
    BACKQUOTE: 'Backquote',
    DIGIT1: 'Digit1', DIGIT2: 'Digit2',
    DIGIT3: 'Digit3', DIGIT4: 'Digit4',
    DIGIT5: 'Digit5', DIGIT6: 'Digit6',
    DIGIT7: 'Digit7', DIGIT8: 'Digit8',
    DIGIT9: 'Digit9', DIGIT0: 'Digit0',
    MINUS: 'Minus',
    EQUAL: 'Equal',
    BACKSPACE: 'BackSpace',
    A: 'KeyA', B: 'KeyB', C: 'KeyC',
    D: 'KeyD', E: 'KeyE', F: 'KeyF',
    G: 'KeyG', H: 'KeyH', I: 'KeyI',
    J: 'KeyJ', K: 'KeyK', L: 'KeyL',
    M: 'KeyM', N: 'KeyN', O: 'KeyO',
    P: 'KeyP', Q: 'KeyQ', R: 'KeyR',
    S: 'KeyS', T: 'KeyT', U: 'KeyU',
    V: 'KeyV', W: 'KeyW', X: 'KeyX',
    Y: 'KeyY', Z: 'KeyZ',
    BRACKET_LEFT: 'BracketLeft',
    BRACKET_RIGHT: 'BracketRight',
    BACKSLASH: 'Backslash',
    SEMICOLON: 'Semicolon',
    QUOTE: 'Quote',
    ENTER: 'Enter',
    COMMA: 'Comma',
    PERIOD: 'Period',
    SLASH: 'Slash',
    ARROWUP: 'ArrowUp', ARROWDOWN: 'ArrowDown',
    ARROWLEFT: 'ArrowLeft', ARROWRIGHT: 'ArrowRight'
}

type AcceleratorHandler = (sourceName: string, mainKey: string) => void

type KeyEventHandler = (evt: KeyboardEvent) => void

interface KeyEventSource {

    getName(): string

    bind(handler: KeyEventHandler): void
}

class KeyNode extends NTreeNode<CombineKey> {
    handler: AcceleratorHandler;

    public match(key: CombineKey): boolean {
        return (this.key.alt == key.alt
            && this.key.ctrl == key.ctrl
            && this.key.shift == key.shift
            && this.key.code == key.code);
    }
}

/**
 * 快捷键管理器，以来GlobalEventManager
 */
class AcceleratorManager {

    /**
     * 使用多叉树存储快捷键组合，用KeyNode做节点，CombineKey做节点值
     */
    private root: KeyNode;

    /**
     * 使用链表存储匹配结果
     */
    private matched: LinkedList<KeyNode>;

    constructor() {
        this.root = new KeyNode(null);
        this.matched = new LinkedList();
        // document.onkeydown = this.keyEventHandler.bind(this)
    }

    public registerKeyEventSource(source: KeyEventSource) {
        source.bind((evt) => this.keyEventHandler(source.getName(), evt))
    }


    /**
     * 按键事件处理
     * @param ev 
     */
    private keyEventHandler(sourceName: string, ev: KeyboardEvent) {
        let ck = new CombineKey(ev.code, ev.altKey, ev.ctrlKey, ev.shiftKey);
        console.log(sourceName, ev, ck)

        let tmp: KeyNode;
        for (let itr = this.matched.iterator(); itr.hasNext();) {
            tmp = <KeyNode> itr.next().matchChild(ck);
            if (tmp != null) {
                // 匹配成功则更新为匹子元素
                itr.update(tmp);
                tmp.handler && tmp.handler(sourceName, ev.code);
            }
            else {
                // 匹配失败则移除
                itr.remove();
            }
        }

        tmp = <KeyNode> this.root.matchChild(ck);
        if (tmp != null) {
            this.matched.add(tmp);
            tmp.handler && tmp.handler(sourceName, ev.code);
        }
    }

    /**
     * 注册快捷键，如果快捷键已经存在，则会绑定失败
     * @param handler 处理器
     * @param keys 要绑定的快捷键组合
     */
    public register(handler: AcceleratorHandler, ...keys: CombineKey[][]) {
        let node: KeyNode;
        for (let keySeq of keys) {
            let parent = this.root;
            // 匹配树，遇到不存在的节点即创建
            keySeq.forEach((key, i) => {
                node = <KeyNode> parent.matchChild(key);
                if (node == null) {
                    for (let j = i; j < keySeq.length; j++) {
                        let newKey = keySeq[j];
                        node = new KeyNode(newKey);
                        parent.addChild(node);
                        parent = node;
                    }
                    node.handler = handler;
                }
            })
        }
    }

}

export default new AcceleratorManager();
export {
    KEYS,
    CombineKey,
    KeyEventHandler,
    keySequence
}