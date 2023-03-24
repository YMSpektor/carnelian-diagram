import { JSXElement, Key } from ".";

export namespace JSXInternal {
    type Element = JSXElement;

    interface ElementChildrenAttribute {
        children: {};
    }

    interface IntrinsicElements {
        [elemName: string]: any;
    }

    export interface IntrinsicAttributes {
		key?: Key;
	}
}
