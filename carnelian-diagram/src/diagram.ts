import { JSXNode } from "carnelian";
import { diff, patch, VTree } from "virtual-dom";
import h from "virtual-dom/h";

export type DiagramElement<P> = (props: P) => JSX.Element;

export interface DiagramElementInstance<P> {
    type: DiagramElement<P>;
    props: P;
}

export class DiagramDocument {
    private elements: DiagramElementInstance<any>[] = [];
    private lastTree: VTree;

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
        let nodes: JSXNode[] = [];
        this.elements
            .map(element => element.type(element.props))
            .forEach(element => {
                if (Array.isArray(element)) {
                    nodes.push(...element);
                }
                else {
                    nodes.push(element);
                }
            });
        const tree = h("", nodes);
        const lastTree = this.lastTree;
        const patches = diff(lastTree, tree);
        this.lastTree = tree;
        return patch(rootNode, patches);
    }
}