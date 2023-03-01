import { createProperties, VNode } from "virtual-dom";

export type JSXNode = string | VNode;

declare function hFn(tagName: string, properties: createProperties, children: JSX.Element): VNode
declare function hFn(tagName: string, children: JSX.Element): VNode;
export const h: typeof hFn = require("virtual-dom/h");
export const svg: typeof hFn = require("virtual-dom/virtual-hyperscript/svg");

declare global {
    namespace JSX {
        type ElementRecursive = void | JSXNode | ElementRecursive[];
        type Element = ElementRecursive;

        interface ElementChildrenAttribute {
            children: Element;
        }

        interface IntrinsicElements {
            [elemName: string]: any;
        }
    }
}

export interface JSXProperties extends createProperties {
    children: string | JSXNode[];
}

export type JSXComponent<P extends JSXProperties> = (props: P) => JSX.Element;

function _jsx(
    tagName: string | JSXComponent<JSXProperties>, 
    properties: JSXProperties, 
): JSX.Element
{
    if (typeof tagName === "string")
    {
        const { children, ...props } = properties;
        return svg(tagName, props, children);
    }
    else {
        return tagName(properties);
    }
}

export const Fragment = function(props: {children: JSX.Element}): JSX.Element {
    return props.children;
}

export const jsx = _jsx;
export const jsxs = _jsx;