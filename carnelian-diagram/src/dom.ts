import { ComponentChildren } from "./jsx-runtime";
import { createProperties, diff, patch, VChild, VNode, VTree } from "virtual-dom";
import { DiagramComponentData, DiagramNode } from "./diagram";

type HyperscriptChild = undefined | null | VChild | HyperscriptChild[];
type Hyperscript = (tagName: string, properties: createProperties, children: HyperscriptChild) => VNode;

export const h: Hyperscript = require("virtual-dom/h");
export const svg: Hyperscript = require("virtual-dom/virtual-hyperscript/svg");

export class DOMBuilder {
    private lastTree: VTree;
    
    constructor() {
        this.lastTree = h("", {}, []);
    }

    private transformNode(node: DiagramNode): HyperscriptChild {
        const createVDomNode = (child: ComponentChildren<any, DiagramComponentData> | undefined): HyperscriptChild => {
            if (Array.isArray(child)) {
                return child.map(createVDomNode);
            }
            if (child && typeof child === 'object') {
                return this.transformNode(child);
            }
            else {
                return child;
            }
        }

        if (typeof node.type === 'string') {
            const { children, ...properties } = node.props;
            return svg(node.type, properties, node.data?.children.map(createVDomNode));
        }
        else {
            return createVDomNode(node.data?.children);
        }
    }

    updateDOM(rootElement: SVGGraphicsElement, rootNode: DiagramNode) {
        const tree = h("", {}, this.transformNode(rootNode));
        const lastTree = this.lastTree;
        const patches = diff(lastTree, tree);
        this.lastTree = tree;
        return patch(rootElement, patches);
    }
}