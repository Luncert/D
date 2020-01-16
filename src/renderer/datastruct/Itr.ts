
abstract class Itr<T> {

    public abstract hasNext(): boolean;

    public abstract next(): T;

    /**
     * 更新当前元素
     */
    public abstract update(newValue: T): void;

    /**
     * 删除当前元素
     */
    public abstract remove(): void;

}

interface Itrable<T> {

    iterator: () => Itr<T>;

}

export {
    Itr,
    Itrable
}