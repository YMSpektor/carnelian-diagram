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
export type HitTestCallback = (transform: DOMMatrixReadOnly, point: DOMPointReadOnly, tolerance: number) => HitArea | void;
export type RenderControlsCallback = (transform: DOMMatrixReadOnly) => JSX.Element;

export type DiagramElement<P> = (props: P) => JSX.Element;

interface DIagramElementInstanceHooks {
    hitTestCallback?: HitTestCallback;
    renderControlsCallback?: RenderControlsCallback;
}

export interface DiagramElementInstance<P> {
    type: DiagramElement<P>;
    props: P;
    hooks: DIagramElementInstanceHooks;
}

let curElement: DiagramElementInstance<unknown>;

export function useHitTest(callback: HitTestCallback) {
    const oldCallback = curElement.hooks.hitTestCallback;
    curElement.hooks.hitTestCallback = !oldCallback ? callback : (transform, point, tolerance) => {
        return oldCallback(transform, point, tolerance) || callback(transform, point, tolerance);
    }
}

export function useControls(callback: RenderControlsCallback) {
    const oldCallback = curElement.hooks.renderControlsCallback;
    curElement.hooks.renderControlsCallback = !oldCallback ? callback : (transform) => {
        return [oldCallback, callback]
            .map(cb => cb(transform))
            .reduce<JSXNode[]>((acc, cur) => acc.concat(cur), []);
    }
}

export class DiagramDocument {
    private elements: DiagramElementInstance<any>[] = [];
    private lastTree: VTree;
    private lastControlsTree: VTree;

    constructor() {
        this.lastTree = h("", []);
        this.lastControlsTree = h("", []);
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

    private renderElementControls(transform: DOMMatrixReadOnly, element: DiagramElementInstance<unknown>): JSX.Element | void {
        return element.hooks.renderControlsCallback && element.hooks.renderControlsCallback(transform);
    }

    render(rootNode: Element): Element {
        const nodes = this.elements
            .map(element => this.renderElement(element))
            .reduce<JSXNode[]>((acc, cur) => acc.concat(cur), []);
        const tree = h("", nodes);
        const lastTree = this.lastTree;
        const patches = diff(lastTree, tree);
        this.lastTree = tree;
        return patch(rootNode, patches);
    }

    renderControls(rootNode: Element, transform: DOMMatrixReadOnly): Element {
        const nodes = this.elements
            .map(element => this.renderElementControls(transform, element))
            .reduce<JSXNode[]>((acc, cur) => cur ? acc.concat(cur) : acc, []);
        const tree = h("", nodes);
        const lastTree = this.lastControlsTree;
        const patches = diff(lastTree, tree);
        this.lastControlsTree = tree;
        return patch(rootNode, patches);
    }

    hitTest(transform: DOMMatrixReadOnly, screenPoint: DOMPointReadOnly, tolerance: number): HitInfo | undefined {
        for (var i = this.elements.length - 1; i >= 0; i--) {
            const element = this.elements[i];
            const hitArea = element.hooks.hitTestCallback && element.hooks.hitTestCallback(transform, screenPoint, tolerance);
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