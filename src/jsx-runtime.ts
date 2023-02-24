import h from "virtual-dom/h";
import { createProperties, VNode } from "virtual-dom";

declare global {
    namespace JSX {
        type Element = JSXNode | JSXNode[];

        interface IntrinsicElements {
            [elemName: string]: any;
        }
    }
}

export type JSXNode = string | VNode;

interface JSXProperties extends createProperties {
    children: string | JSXNode[];
}

function _jsx(
    tagName: string | symbol, 
    properties: JSXProperties, 
): JSX.Element
{
    if (typeof tagName === "string")
    {
        const { children, ...props } = properties;
        return h(tagName, props, children);
    }
    else {
        if (tagName === Fragment) {
            return properties.children;
        }
        throw new Error(`Invalid tag passed: ${tagName.toString()}`);
    }
}

export const Fragment = Symbol.for("Fragment");

export const jsx = _jsx;
export const jsxs = _jsx;