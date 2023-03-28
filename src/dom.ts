import { ComponentChildren } from "./jsx-runtime";
import { createProperties, diff, patch, VChild, VNode, VTree } from "virtual-dom";
import { DiagramNode, isVirtualNode } from "./diagram";

export type HyperscriptChild = undefined | null | VChild | HyperscriptChild[];
export type Hyperscript = (tagName: string, properties: createProperties, children: HyperscriptChild) => VNode;

export const h: Hyperscript = require("virtual-dom/h");
export const svg: Hyperscript = require("virtual-dom/virtual-hyperscript/svg");

export class DOMBuilder {
    private lastTree: VTree;
    
    constructor() {
        this.lastTree = h("", {}, []);
    }

    private transformNode(node: DiagramNode | null): HyperscriptChild {
        const createVDomNode = (child: ComponentChildren<any> | undefined): HyperscriptChild => {
            if (Array.isArray(child)) {
                return child.map(createVDomNode);
            }
            if (isVirtualNode(child)) {
                return this.transformNode(child as DiagramNode);
            }
            else {
                return child;
            }
        }

        if (node) {
            if (typeof node.type === 'string') {
                const { children, ...properties } = node.props;
                if (properties) {
                    properties.class = properties.className;
                }
                return svg(node.type, properties, node.children.map(createVDomNode));
            }
            else {
                return createVDomNode(node.children);
            }
        }
    }

    updateDOM(rootElement: SVGGraphicsElement, rootNode: DiagramNode | null) {
        rootElement.classList.add("carnelian-diagram");
        
        const tree = h("", {}, this.transformNode(rootNode));
        const lastTree = this.lastTree;
        const patches = diff(lastTree, tree);
        this.lastTree = tree;
        return patch(rootElement, patches);
    }
}