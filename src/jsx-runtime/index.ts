import { JSXInternal } from "./jsx.d";

export type ComponentChild<P = any> = VirtualNode<P> | string | null | undefined;
export type ComponentChildren<P = any> = ComponentChild<P>[] | ComponentChild<P> | ComponentChildren<P>[];
export type JSXElement = ComponentChildren | undefined;
export type RenderableProps<P> = P & Readonly<{ children?: ComponentChildren; }>;
export type FunctionComponent<P> = (props: P) => JSXElement;
export type ComponentType<P> = FunctionComponent<P>;
export type Key = string | number | any;

export import JSX = JSXInternal;

export interface VirtualNode<P = {}> {
    type: string | ComponentType<P>;
    props: P & { children?: ComponentChildren };
    key: Key;
}

export type CreateElementFn = <P>(
    type: string | ComponentType<P>,
    props: RenderableProps<P>,
    key: Key
) => VirtualNode<P>;

export interface JSXCore {
    createElement: CreateElementFn;
}

export const jsxCore: JSXCore = {
    createElement: (type, props, key) => {
        return {
            type,
            props,
            key
        }
    }
}

export function createElement<P>(
    type: string | ComponentType<P>,
    props: P & { children?: ComponentChildren },
    key: Key
): VirtualNode<P> {
    return jsxCore.createElement(type, props, key);
}

function Fragment(props: RenderableProps<{}>) {
    return props.children;
}

export {
    createElement as jsx,
    createElement as jsxs,
    createElement as jsxDEV,
    Fragment
}