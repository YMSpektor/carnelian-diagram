import h from "virtual-dom/h";
import { createProperties, VChild, VNode } from "virtual-dom";

export type DOMElement = VNode;

declare global {
    namespace JSX {
        type Element = DOMElement;

        interface IntrinsicElements {
            [elemName: string]: any;
        }
    }
}

interface JSXProperties extends createProperties {
    children: VChild[];
}

function _jsx(
    tagName: string, 
    properties: JSXProperties, 
): DOMElement
{
    const { children, ...props } = properties;
    return h(tagName, props, children);
}

export const jsx = _jsx;
export const jsxs = _jsx;