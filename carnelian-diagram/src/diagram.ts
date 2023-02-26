import { JSXNode } from "carnelian";
import { diff, patch, VTree } from "virtual-dom";
import h from "virtual-dom/h";

export interface HitArea {
    type: string;
}

export interface HitInfo {
    element: DiagramElementInstance<unknown>;
    screenX: number;
    screenY: number;
    elementX: number;
    elementY: number;
    hitArea: HitArea;
}
export type HitTestCallback = (transform: DOMMatrixReadOnly, point: DOMPointReadOnly) => HitArea | void;

export type DiagramElement<P> = (props: P) => JSX.Element;

interface DIagramElementInstanceHooks {
    hitTestCallback?: HitTestCallback;
}

export interface DiagramElementInstance<P> {
    type: DiagramElement<P>;
    props: P;
    hooks: DIagramElementInstanceHooks;
}

let curElement: DiagramElementInstance<unknown>;

export function useHitTest(callback: HitTestCallback) {
    const oldCallback = curElement.hooks.hitTestCallback;
    curElement.hooks.hitTestCallback = !oldCallback ? callback : (transform, point) => {
        return oldCallback(transform, point) || callback(transform, point);
    }
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
            props,
            hooks: {}
        };
        this.elements.push(element);
        return element;
    }

    private renderElement(element: DiagramElementInstance<unknown>): JSX.Element {
        curElement = element;
        element.hooks = {};
        return element.type(element.props);
    }

    render(rootNode: Element): Element {
        let nodes: JSXNode[] = [];
        this.elements
            .map(element => this.renderElement(element))
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

    hitTest(transform: DOMMatrixReadOnly, screenPoint: DOMPointReadOnly): HitInfo | undefined {
        for (var i = this.elements.length - 1; i >= 0; i--) {
            const element = this.elements[i];
            const hitArea = element.hooks.hitTestCallback && element.hooks.hitTestCallback(transform, screenPoint);
            if (hitArea) {
                const elemPt = screenPoint.matrixTransform(transform);
                return {
                    element,
                    screenX: screenPoint.x,
                    screenY: screenPoint.y,
                    elementX: elemPt.x,
                    elementY: elemPt.y,
                    hitArea
                }
            }
        }
    }
}