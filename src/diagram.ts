import { diff, patch } from "virtual-dom";
import h from "virtual-dom/h";
import { DOMElement } from ".";

export type DiagramElement<P> = (props: P) => DOMElement;

export interface DiagramElementInstance<P> {
    type: DiagramElement<P>;
    props: P;
}

export class DiagramDocument {
    private elements: DiagramElementInstance<any>[] = [];
    private lastTree: DOMElement;

    constructor() {
        this.lastTree = h("", []);
    }

    add<P>(type: DiagramElement<P>, props: P): DiagramElementInstance<P> {
        const element = {
            type,
            props
        };
        this.elements.push(element);
        return element;
    }

    render(rootNode: Element): Element {
        const nodes = this.elements.map(element => element.type(element.props));
        const tree = h("", nodes);
        const lastTree = this.lastTree;
        const patches = diff(lastTree, tree);
        this.lastTree = tree;
        return patch(rootNode, patches);
    }
}