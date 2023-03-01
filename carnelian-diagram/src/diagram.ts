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
    jsx?: JSX.Element;
    jsxControls?: JSX.Element;
    hooks: DIagramElementInstanceHooks;
}

export function getCurrentElement(): DiagramElementInstance<unknown> | undefined {
    return DiagramDocument.current?.["currentElement"];
}

type DiagramDocumentEventHandler<T> = (args: T) => void;

export class DiagramDocumentEvent<T> {
    private listeners: DiagramDocumentEventHandler<T>[] = [];

    addListener(listener: DiagramDocumentEventHandler<T>) {
        this.listeners.push(listener);
    }

    removeListener(listener: DiagramDocumentEventHandler<T>) {
        this.listeners = this.listeners.filter(x => x !== listener);
    }

    dispatch(args: T) {
        this.listeners.forEach(e => e(args));
    }
}

export interface SelectEventArgs {
    document: DiagramDocument;
    oldSelection: ReadonlySet<DiagramElementInstance<any>>;
    newSelection: ReadonlySet<DiagramElementInstance<any>>;
}

export class DiagramDocument {
    private elements: DiagramElementInstance<any>[] = [];
    private selectedElements: Set<DiagramElementInstance<any>> = new Set();
    private currentElement?: DiagramElementInstance<unknown>;
    private lastTree: VTree;
    private lastControlsTree: VTree;

    public readonly onSelect = new DiagramDocumentEvent<SelectEventArgs>();
    public static current: DiagramDocument;

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
        this.currentElement = element;
        element.hooks = {};
        element.jsx = element.type(element.props);
        return element.jsx;
    }

    private renderElementControls(transform: DOMMatrixReadOnly, element: DiagramElementInstance<unknown>): JSX.Element | void {
        this.currentElement = element;
        element.jsxControls = element.hooks.renderControlsCallback && element.hooks.renderControlsCallback(transform);
        return element.jsxControls;
    }

    render(rootNode: Element, elements?: DiagramElementInstance<any>[]): Element {
        DiagramDocument.current = this;
        const nodes = this.elements
            .map(element => !elements || elements.indexOf(element) >= 0 || !element.jsx ? this.renderElement(element) : element.jsx)
            .reduce<JSXNode[]>((acc, cur) => acc.concat(cur), []);
        const tree = h("", nodes);
        const lastTree = this.lastTree;
        const patches = diff(lastTree, tree);
        this.lastTree = tree;
        return patch(rootNode, patches);
    }

    renderControls(rootNode: Element, transform: DOMMatrixReadOnly, elements?: DiagramElementInstance<any>[]): Element {
        DiagramDocument.current = this;
        const nodes = this.elements
            .map(element => !elements || elements.indexOf(element) >= 0 || !element.jsxControls ? this.renderElementControls(transform, element) : element.jsxControls)
            .reduce<JSXNode[]>((acc, cur) => cur ? acc.concat(cur) : acc, []);
        const tree = h("", nodes);
        const lastTree = this.lastControlsTree;
        const patches = diff(lastTree, tree);
        this.lastControlsTree = tree;
        return patch(rootNode, patches);
    }

    hitTest(transform: DOMMatrixReadOnly, screenPoint: DOMPointReadOnly, tolerance: number): HitInfo | undefined {
        DiagramDocument.current = this;
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

    select(element: DiagramElementInstance<unknown>) {
        const oldSelection = this.selectedElements;
        this.selectedElements = new Set([element]);
        this.onSelect.dispatch({
            document: this,
            oldSelection,
            newSelection: this.selectedElements
        });
    }

    isSelected(element: DiagramElementInstance<unknown>): boolean {
        return this.selectedElements.has(element);
    }
}