export interface MutableRefObject<T> {
    current: T;
}

export interface RefObject<T> {
    readonly current: T | null;
}

export type WithThis<
    TThis,
    TFunction extends (...args: any) => any,
> = (
    this: TThis,
    ...args: [...Parameters<TFunction>]
) => ReturnType<TFunction>;