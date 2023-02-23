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
declare function _jsx(tagName: string, properties: createProperties, ...children: VChild[]): DOMElement;
export declare const jsx: typeof _jsx;
export declare const jsxs: typeof _jsx;
export {};
