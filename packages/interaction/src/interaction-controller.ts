import { Diagram, DiagramElementNode } from "@carnelian-diagram/core";
import { createElement, Fragment, JSX } from "@carnelian-diagram/core/jsx-runtime";
import { InteractionContextType } from "./context";
import { DiagramElementHitTest, hasHitTestProps, HitTestCollection, HitInfo, addHitTestProps } from "./hit-tests";
import { DiagramElementIntersectionTest } from "./intersection-tests";
import { inflateRect, intersectRect, pointInRect, polygonBounds, Rect, rectPoints, transformPoint } from "./geometry";
import { DefaultControlRenderingService, DefaultDeletionService, DefaultElementDrawingService, DefaultElementInteractionService, DefaultGridSnappingService, DefaultPaperService, DefaultSelectionService, DefaultTextEditingService, InteractionServive, InteractiveServiceCollection } from "./services";
import { Channel } from "type-pubsub";
import { computeTransformResult, DiagramElementTransform, DiagramElementTransforms } from "./transforms";
import { PolygonCollider, RectCollider } from "./collisions";

export type RenderControlsCallback = (transform: DOMMatrixReadOnly, element: DiagramElementNode) => JSX.Element;

export interface DiagramElementControls {
    element: DiagramElementNode;
    callback: RenderControlsCallback;
}

interface PendingAction<T> {
    action: string;
    payload: T;
    resolve: () => void;
    reject: (reason: unknown) => void;
}

export type ActionCallback<T> = (payload: T) => void;

export interface DiagramElementAction<T> {
    action: string;
    element: DiagramElementNode;
    callback: ActionCallback<T>;
}

export const SELECT_EVENT = "select";

export interface SelectEventArgs {
    selectedElements: DiagramElementNode[];
}

export class InteractionController {
    private controls = new Map<DiagramElementNode, Map<object, DiagramElementControls>>();
    private hitTests: HitTestCollection = {};
    private intersectionTests = new Map<object, DiagramElementIntersectionTest>;
    private transforms = new Map<DiagramElementNode, DiagramElementTransforms>;
    private actions = new Map<object, DiagramElementAction<any>>();
    private pendingActions = new Map<DiagramElementNode, PendingAction<any>[]>();
    private selectedElements = new Set<DiagramElementNode>();
    private services: InteractionServive[];
    private serviceCapture: InteractionServive | null = null;
    private channel = new Channel<string>;
    screenCTM?: DOMMatrixReadOnly;
    interactionContext: InteractionContextType;

    constructor(
        public readonly diagram: Diagram,
        configureServices?: (services: InteractiveServiceCollection) => void
    ) {
        this.interactionContext = this.createInteractionContext();
        this.services = [
            new DefaultPaperService(this),
            new DefaultGridSnappingService(),
            new DefaultSelectionService(this),
            new DefaultElementInteractionService(this),
            new DefaultDeletionService(this),
            new DefaultElementDrawingService(this),
            new DefaultTextEditingService(this),
            new DefaultControlRenderingService(),
        ];
        configureServices?.(new InteractiveServiceCollection(this.services));
    }

    attach(root: HTMLElement | SVGElement) {
        this.detach();

        this.services.forEach(s => s.activate?.(this.diagram, root as HTMLElement));

        const tabIndex = root.getAttribute("tabindex");
        if (!tabIndex || +tabIndex < 0) {
            root.setAttribute("tabindex", "0");
        }

        this.detach = () => {
            this.detach = () => { };

            this.services.forEach(s => s.deactivate?.());

            if (!tabIndex) {
                root.removeAttribute("tabindex");
            }
            else if (+tabIndex < 0) {
                root.setAttribute("tabindex", tabIndex);
            }
        }
    }

    detach() { };

    getService<T extends InteractionServive>(predicate: (service: InteractionServive) => service is T): T | undefined {
        return this.services.find<T>(predicate);
    }

    setInputCapture(service: InteractionServive) {
        if (this.serviceCapture !== service) {
            this.services.forEach(s => {
                if (s !== service) {
                    s.deactivate?.();
                }
            });

            this.serviceCapture = service;
        }
    }

    releaseInputCapture(root: HTMLElement, service: InteractionServive) {
        if (this.serviceCapture === service) {
            this.serviceCapture = null;

            service.deactivate?.(); // Release to initialize all services at the same order

            this.services.forEach(s => {
                s.activate?.(this.diagram, root);
            });
        }
    }

    private createInteractionContext(): InteractionContextType {
        const updateControls = (element: DiagramElementNode, key: {}, controls?: DiagramElementControls) => {
            let map = this.controls.get(element);
            if (!map) {
                map = new Map<object, DiagramElementControls>();
                this.controls.set(element, map);
            }
            if (controls) {
                map.set(key, controls);
            }
            else {
                map.delete(key);
                if (map.size === 0) {
                    this.controls.delete(element);
                }
            }
        }

        const updateHitTests = (element: DiagramElementNode, priority: number, key: {}, hitTest?: DiagramElementHitTest) => {
            let map = this.hitTests[priority];
            if (!map) {
                map = this.hitTests[priority] = new Map<DiagramElementNode, Map<object, DiagramElementHitTest>>();
            }
            let hitTestMap = map.get(element);
            if (!hitTestMap) {
                hitTestMap = new Map<object, DiagramElementHitTest>();
                map.set(element, hitTestMap);
            }
            if (hitTest) {
                hitTestMap.set(key, hitTest);
            }
            else {
                hitTestMap.delete(key);
                if (hitTestMap.size === 0) {
                    map.delete(element);
                }
            }
        }

        const updateIntersectionTests = (key: {}, intersectionTest?: DiagramElementIntersectionTest) => {
            if (intersectionTest) {
                this.intersectionTests.set(key, intersectionTest);
            }
            else {
                this.intersectionTests.delete(key);
            }
        }

        const updateActions = (key: {}, action?: DiagramElementAction<any>) => {
            if (action) {
                this.actions.set(key, action);
                let pendingActions = this.pendingActions.get(action.element);
                if (pendingActions) {
                    pendingActions = pendingActions.filter(x => {
                        if (x.action === action.action) {
                            try
                            {
                                action.callback(x.payload);
                                x.resolve();
                            }
                            catch (e) {
                                x.reject(e);
                            }
                            return false;
                        }
                        return true;
                    });
                    this.pendingActions.set(action.element, pendingActions);
                    if (!pendingActions.length) {
                        this.pendingActions.delete(action.element);
                    }
                }
            }
            else {
                this.actions.delete(key);
            }
        }

        const updateTransforms = (element: DiagramElementNode, key: {}, transform?: DiagramElementTransform) => {
            let transforms = this.transforms.get(element);
            if (!transforms) {
                transforms = {
                    result: new DOMMatrix(),
                    transformMap: new Map<object, DiagramElementTransform>()
                }
                this.transforms.set(element, transforms);
            }
            if (transform) {
                transforms.transformMap.set(key, transform);
                computeTransformResult(transforms);
            }
            else {
                transforms.transformMap.delete(key);
                computeTransformResult(transforms);
                if (transforms.transformMap.size === 0) {
                    this.transforms.delete(element);
                }
            }
        }

        return {
            getController: () => this,
            updateControls,
            updateHitTests,
            updateIntersectionTests,
            updateActions,
            updateTransforms
        }
    }

    private hasTransform(element: DiagramElementNode): boolean {
        return !!this.transforms.get(element);
    }

    getElementTransform(element: DiagramElementNode, parentTransform?: DOMMatrixReadOnly): DOMMatrix {
        const transforms = this.transforms.get(element);
        const localTransform = transforms ? transforms.result : new DOMMatrix();
        return parentTransform ? parentTransform.multiply(localTransform) : localTransform;
    }

    clientToDiagram(point: DOMPointReadOnly, element?: DiagramElementNode): DOMPointReadOnly {
        const transform = element ? this.getElementTransform(element, this.screenCTM) : this.screenCTM;
        return transform ? point.matrixTransform(transform.inverse()) : point;
    }

    diagramToClient(point: DOMPointReadOnly, element?: DiagramElementNode): DOMPointReadOnly {
        const transform = element ? this.getElementTransform(element, this.screenCTM) : this.screenCTM;
        return transform? point.matrixTransform(transform) : point;
    }

    elementToDiagram(point: DOMPointReadOnly, element: DiagramElementNode): DOMPointReadOnly {
        const transform = element ? this.getElementTransform(element) : null;
        return transform ? point.matrixTransform(transform) : point;
    }

    diagramToElement(point: DOMPointReadOnly, element: DiagramElementNode): DOMPointReadOnly {
        const transform = element ? this.getElementTransform(element) : null;
        return transform ? point.matrixTransform(transform.inverse()) : point;
    }

    isSelected(element: DiagramElementNode) {
        return this.selectedElements.has(element);
    }

    getSelectedElements() {
        return [...this.selectedElements];
    }

    select(element: DiagramElementNode): void;
    select(elements: DiagramElementNode[]): void;
    select(elements: DiagramElementNode | DiagramElementNode[]) {
        if (!Array.isArray(elements)) {
            elements = [elements];
        }
        this.selectedElements = new Set(elements);
        this.dispatchEvent<SelectEventArgs>(SELECT_EVENT, { selectedElements: elements });
    }

    renderControls(transform: DOMMatrixReadOnly): JSX.Element {
        return [...this.controls]
            .filter(x => this.isSelected(x[0]))
            .map(x => {
                const key = x[0].key;
                const controls = [...x[1].values()];
                return createElement(
                    Fragment,
                    { children: controls.map(x => x.callback(this.getElementTransform(x.element, transform), x.element)) },
                    key
                );
            });
    }

    private transformBounds(element: DiagramElementNode, bounds: Rect): Rect {
        return this.hasTransform(element)
            ? polygonBounds(rectPoints(bounds).map(p => new DOMPoint(p.x, p.y).matrixTransform(this.getElementTransform(element))))!
            : bounds;
    }

    hitTest(e: MouseEvent): HitInfo | undefined {
        const point = new DOMPoint(e.clientX, e.clientY);
        if (hasHitTestProps(e)) {
            const elementPoint = this.clientToDiagram(point, e.__hitTest.element);
            return {
                ...e.__hitTest,
                screenX: point.x,
                screenY: point.y,
                elementX: elementPoint.x,
                elementY: elementPoint.y,
            }
        }
        if (e.target && hasHitTestProps(e.target)) {
            const elementPoint = this.clientToDiagram(point, e.target.__hitTest.element);
            addHitTestProps(e, e.target.__hitTest.hitArea, e.target.__hitTest.element);
            return {
                ...e.target.__hitTest,
                screenX: point.x,
                screenY: point.y,
                elementX: elementPoint.x,
                elementY: elementPoint.y,
            }
        }
        else {
            const priorities = Object.keys(this.hitTests).map(x => parseInt(x)).reverse();
            const sortedElements = this.diagram.getElements().slice().reverse();
            let elementPoint: DOMPointReadOnly | undefined;
            for (let priority of priorities) {
                let hit: DiagramElementHitTest | undefined;
                for (let element of sortedElements) {
                    const list = [...(this.hitTests[priority]?.get(element)?.values() || [])];
                    elementPoint = this.clientToDiagram(point, element);
                    hit = list.find(x => {
                        const tolerance = x.tolerance / (this.screenCTM?.a || 1);
                        return elementPoint && (
                            (!x.bounds || pointInRect(elementPoint, inflateRect(x.bounds, tolerance))) && // Broad phase
                            x.callback(elementPoint, tolerance)  // Narrow phase
                        );
                    });
                    if (hit) break;
                }
                if (hit && elementPoint) {
                    addHitTestProps(e, hit.hitArea, hit.element);
                    return {
                        element: hit.element,
                        screenX: point.x,
                        screenY: point.y,
                        elementX: elementPoint.x,
                        elementY: elementPoint.y,
                        hitArea: hit.hitArea
                    }
                }
            }
        }
    }

    private selectionRectCollider(element: DiagramElementNode, rect: Rect) {
        return this.hasTransform(element)
            ? PolygonCollider(rectPoints(rect).map(p => transformPoint(p, this.getElementTransform(element).inverse())))
            : RectCollider(rect)
    }

    rectIntersectionTest(rect: Rect): DiagramElementNode[] {
        // Broad phase
        const tests = [...this.intersectionTests.values()]
            .filter(test => !test.bounds || intersectRect(this.transformBounds(test.element, test.bounds), rect));
        // Narrow phase
        return tests
            .filter(test => test.callback(this.selectionRectCollider(test.element, rect)))
            .map(test => test.element);
    }

    dispatchAction<T>(elements: DiagramElementNode[], action: string, payload: T): Promise<void> {
        const actions = [...this.actions.values()];
        const results: Promise<void>[] = [];
        elements.forEach(element => {
            if (!element.parent) {  // Newly added element, never rendered
                const promise = new Promise<void>((resolve, reject) => {
                    let pendingActions = this.pendingActions.get(element);
                    if (!pendingActions) {
                        pendingActions = [];
                        this.pendingActions.set(element, pendingActions);
                    }
                    pendingActions.push({ action, payload, resolve, reject });
                });
                results.push(promise);
            }
            else {
                const callbacks = actions
                    .filter(x => x.element === element && x.action === action)
                    .map(x => x.callback);
                if (callbacks) {
                    callbacks.forEach(cb => cb(payload));
                }
            }
        });

        return Promise.all(results).then(() => {});
    }

    dispatchEvent<T>(eventType: string, eventArgs: T) {
        this.channel.publish(eventType, eventArgs);
    }

    addEventListener<T>(eventType: string, listener: (args: T) => void) {
        this.channel.subscribe(eventType, listener);
    }

    removeEventListener<T>(eventType: string, listener: (args: T) => void) {
        this.channel.unsubscribe(eventType, listener);
    }
}