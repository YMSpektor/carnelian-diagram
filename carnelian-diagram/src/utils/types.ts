export type WithThis<
    TThis,
    TFunction extends (...args: any) => any,
> = (
    this: TThis,
    ...args: [...Parameters<TFunction>]
) => ReturnType<TFunction>;