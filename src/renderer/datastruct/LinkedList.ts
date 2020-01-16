import { Itrable, Itr } from "./Itr";

class ListNode<T> {

    data: T;
    next: ListNode<T>;
    
    constructor(data: T, next: ListNode<T>) {
        this.data = data;
        this.next = next;
    }

}

class ListItr<T> extends Itr<T> {

    private list: LinkedList<T>;
    private pre: ListNode<T>;
    private cur: ListNode<T>;

    constructor(list: LinkedList<T>) {
        super();
        this.list = list;
        this.cur = list.head;
    }

    public hasNext(): boolean {
        return this.cur.next != null;
    }
    
    public next(): T {
        // remove操作导致pre.next != cur，这时pre.next已经是cur.next
        if (!this.pre || this.pre.next == this.cur) {
            this.pre = this.cur;
        }
        this.cur = this.cur.next;
        return this.cur.data;
    }

    public update(newValue: T): void {
        this.cur.data = newValue;
    }

    public remove(): void {
        this.pre.next = this.cur.next;
        if (this.list.tail == this.cur) {
            this.list.tail = this.pre;
        }
        this.list.sz--;
    }

}

export default class LinkedList<T> implements Itrable<T> {

    head: ListNode<T>;
    tail: ListNode<T>;
    sz: number;

    constructor() {
        this.tail = this.head = new ListNode(null, null);
        this.sz = 0;
    }

    public add(data: T) {
        this.tail = this.tail.next = new ListNode(data, null);
        this.sz++;
    }

    public get(i: number): T {
        this.indexCheck(i);
        let node = this.head.next;
        for (let t = 0; t < i; t++) {
            node = node.next;
        }
        return node.data;
    }

    public remove(i: number): T {
        this.indexCheck(i);
        let pre = this.head, node = pre.next;
        for (let t = 0; t < i; t++) {
            pre = node;
            node = node.next;
        }
        pre.next = node.next;
        if (i == this.sz - 1) {
            this.tail = pre;
        }
        this.sz--;
        return node.data;
    }

    public forEach(callbackfn: (value: T, index: number) => void): void {
        let node = this.head.next;
        for (let i = 0; i < this.sz; i++) {
            callbackfn(node.data, i);
            node = node.next;
        }
    }

    public iterator(): Itr<T> {
        return new ListItr(this);

    }

    private indexCheck(i: number) {
        if (i < 0 || i >= this.sz) {
            throw new Error('invalid index: ' + i);
        }
    }

    public isEmpty(): boolean { return this.sz == 0; }

    public size(): number { return this.sz; }

}