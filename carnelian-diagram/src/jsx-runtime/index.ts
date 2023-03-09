export type ComponentChild<P = any, D = any> = VirtualNode<P, D> | string | null | undefined;
export type ComponentChildren<P = any, D = any> = ComponentChild<P, D>[] | ComponentChild<P, D>;
export type RenderableProps<P> = P & Readonly<{ children?: ComponentChildren; }>;
export type FunctionComponent<P> = (props: RenderableProps<P>) => JSX.Element;
export type ComponentType<P = {}> = FunctionComponent<P>;

export interface VirtualNode<P = {}, D = unknown> {
    type: string | ComponentType<P>;
    props: P & { children?: ComponentChildren };
    data?: D;
}

export function createElement<P, D>(
    type: string | ComponentType<P>,
    props: P & { children?: ComponentChildren }
): VirtualNode<P, D> {
    return {
        type,
        props
    }
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