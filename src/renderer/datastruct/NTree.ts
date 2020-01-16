
export default abstract class NTreeNode<T> {

    protected key: T;
    private children: NTreeNode<T>[];

    constructor(key: T) {
        this.key = key;
        this.children = [];
    }

    public getKey(): T { return this.key; }

    public abstract match(key: T): boolean;

    public matchChild(key: T): NTreeNode<T> {
        let i = this.searchChild(key);
        return i < this.children.length ? this.children[i] : null;
    }

    private searchChild(key: T): number {
        let i = 0;
        for (; i < this.children.length; i++) {
            if (this.children[i].match(key)) {
                return i;
            }
        }
        return i;
    }

    public addChild(child: NTreeNode<T>) {
        this.children.push(child);
    }

    public removeChild(key: T): NTreeNode<T> {
        let i = this.searchChild(key);
        return this.removeChildByIndex(i);
    }

    public removeChildByIndex(i: number): NTreeNode<T> {
        if (i >= 0 && i < this.children.length) {
            return this.children.splice(i, 1)[0];
        }
        else return null;
    }

    public getChildrenNum(): number {
        return this.children.length;
    }
}