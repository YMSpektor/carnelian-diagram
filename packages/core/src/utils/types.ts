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

export type AddParameters<
    TFunction extends (...args: any) => any,
    TParameters extends [...args: any]
> = (
  ...args: [...Parameters<TFunction>, ...TParameters]
) => ReturnType<TFunction>;