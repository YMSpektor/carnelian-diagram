export type ComponentChild<P = any> = VirtualNode<P> | string | null | undefined;
export type ComponentChildren<P = any> = ComponentChild<P>[] | ComponentChild<P> | ComponentChildren<P>[];
export type RenderableProps<P> = P & Readonly<{ children?: ComponentChildren; }>;
export type FunctionComponent<P> = (props: RenderableProps<P>) => JSX.Element;
export type ComponentType<P = {}> = FunctionComponent<P>;
export type Key = string | number | any;

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

declare global {
    namespace JSX {
        type Element = ComponentChildren | undefined;

        interface ElementChildrenAttribute {
            children: any;
        }

        interface IntrinsicElements {
            [elemName: string]: any;
        }
    }
}

export {
    createElement as jsx,
    createElement as jsxs,
    createElement as jsxDEV,
    Fragment
}