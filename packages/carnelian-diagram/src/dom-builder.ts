import { ComponentChildren } from "./jsx-runtime";
import { createProperties, diff, patch, VChild, VNode } from "virtual-dom";
import { DiagramNode, isVirtualNode } from "./diagram";

export type HyperscriptChild = undefined | null | VChild | HyperscriptChild[];
export type Hyperscript = (tagName: string, properties: createProperties, children: HyperscriptChild) => VNode;

export const h: Hyperscript = require("virtual-dom/h");
export const svg: Hyperscript = require("virtual-dom/virtual-hyperscript/svg");

export class DiagramDOMBuilder {
    private lastTree: VNode;
    private oldClass?: string | null;
    
    constructor(private root: SVGGraphicsElement) {
        this.oldClass = root.attributes?.getNamedItem("class")?.nodeValue;
        this.lastTree = svg("", {}, []);
    }

    private transformProperties(properties: createProperties): createProperties {
        properties.class = properties.className;
        delete properties.className;
        return properties;
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
                return svg(node.type, this.transformProperties(properties), node.children.map(createVDomNode));
            }
            else {
                return createVDomNode(node.children);
            }
        }
    }

    updateDOM(rootNode: DiagramNode | null) {
        const props = rootNode ? this.transformProperties({
            className: this.oldClass ? `${this.oldClass} carnelian-diagram` : "carnelian-diagram",
            stroke: "black",
            fill: "white"
        }): {};
        const tree = svg("", props, this.transformNode(rootNode));
        const lastTree = this.lastTree;
        const patches = diff(lastTree, tree);
        this.lastTree = tree;
        return patch(this.root, patches);
    }
}