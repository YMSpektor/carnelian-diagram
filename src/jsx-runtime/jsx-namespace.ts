import { ComponentChildren, Key } from ".";

export namespace JSX {
    export type Element = ComponentChildren | undefined;

    export interface ElementChildrenAttribute {
        children: {};
    }

    export interface IntrinsicElements {
        [elemName: string]: any;
    }

    export interface IntrinsicAttributes {
		key?: Key;
	}
}
