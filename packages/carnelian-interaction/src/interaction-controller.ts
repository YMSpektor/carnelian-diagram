import { Diagram, DiagramElementNode } from "@carnelian/diagram";
import { createElement, Fragment, JSX } from "@carnelian/diagram/jsx-runtime";
import { InteractionContextType } from "./context";
import { DiagramElementHitTest, hasHitTestProps, HitTestCollection, HitInfo, addHitTestProps } from "./hit-tests";
import { DiagramElementIntersectionTest } from "./intersection-tests";
import { intersectRect, Rect } from "./geometry";
import { DefaultControlRenderingService, DefaultDeletionService, DefaultElementDrawingService, DefaultElementInteractionService, DefaultGridSnappingService, DefaultPaperService, DefaultSelectionService, InteractionServive } from "./services";
import { Channel } from "type-pubsub";

export type RenderControlsCallback = (transform: DOMMatrixReadOnly, element: DiagramElementNode) => JSX.Element;

export interface DiagramElementControls {
    element: DiagramElementNode;
    callback: RenderControlsCallback;
}

interface PendingAction<T> {
    action: string;
    payload: T;
}

export type ActionCallback<T> = (payload: T) => void;

export interface DiagramElementAction<T> {
    action: string;
    element: DiagramElementNode;
    callback: ActionCallback<T>;
}

export const SELECT_EVENT = "select";
export const DELETE_EVENT = "delete";

export interface SelectEventArgs {
    selectedElements: DiagramElementNode[];
}

export interface DeleteEventArg {
    elements: DiagramElementNode[];
    requestConfirmation(promise: Promise<boolean>): void;
}

export interface Paper {
    x: number;
    y: number;
    width: number;
    height: number;
    majorGridSize?: number;
    majorGridColor?: string;
    minorGridSize?: number;
    minorGridColor?: string;
}

export class InteractionController {
    private diagram: Diagram | null = null;
    private controls = new Map<DiagramElementNode, Map<object, DiagramElementControls>>();
    private hitTests: HitTestCollection = {};
    private intersectionTests = new Map<object, DiagramElementIntersectionTest>;
    private actions = new Map<object, DiagramElementAction<any>>();
    private pendingActions = new Map<DiagramElementNode, PendingAction<any>[]>();
    private selectedElements = new Set<DiagramElementNode>();
    private services: InteractionServive[];
    private serviceCapture: InteractionServive | null = null;
    private channel = new Channel<string>;
    screenCTM?: DOMMatrixReadOnly;
    interactionContext: InteractionContextType;

    constructor(
        configureServices?: (services: InteractionServive[]) => void
    ) {
        this.interactionContext = this.createInteractionContext();
        this.services = [
            new DefaultPaperService(this),
            new DefaultGridSnappingService(),
            new DefaultSelectionService(this),
            new DefaultElementInteractionService(this),
            new DefaultDeletionService(this),
            new DefaultElementDrawingService(this),
            new DefaultControlRenderingService(),
        ];
        configureServices?.(this.services);
    }

    attach(diagram: Diagram, root: HTMLElement) {
        this.diagram = diagram;
        this.detach();

        this.services.forEach(s => s.init?.(diagram, root));

        const tabIndex = root.getAttribute("tabindex");
        if (!tabIndex || +tabIndex < 0) {
            root.setAttribute("tabindex", "0");
        }

        this.detach = () => {
            this.diagram = null;
            this.detach = () => { };

            this.services.forEach(s => s.release?.());

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
                    s.release?.();
                }
            });

            this.serviceCapture = service;
        }
    }

    releaseInputCapture(root: HTMLElement, service: InteractionServive) {
        if (this.serviceCapture === service) {
            this.serviceCapture = null;

            service.release?.(); // Release to initialize all services at the same order

            this.services.forEach(s => {
                this.diagram && s.init?.(this.diagram, root);
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
                            action.callback(x.payload);
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

        return {
            updateControls,
            updateHitTests,
            updateIntersectionTests,
            updateActions
        }
    }

    clientToDiagram(point: DOMPointReadOnly): DOMPointReadOnly {
        return point.matrixTransform(this.screenCTM?.inverse());
    }

    diagramToClient(point: DOMPointReadOnly): DOMPointReadOnly {
        return point.matrixTransform(this.screenCTM);
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

    async delete(elements: DiagramElementNode[]): Promise<boolean> {
        if (this.diagram) {
            const promises: Promise<boolean>[] = [];
            this.dispatchEvent<DeleteEventArg>(DELETE_EVENT, {
                elements,
                requestConfirmation: (promise) => {
                    promises.push(promise);
                }
            });

            let confirmations: boolean[];
            try {
                confirmations = await Promise.all(promises);
                if (confirmations.every(x => x)) {
                    this.diagram.delete(elements);
                    this.select([]);
                    return true;
                }
            }
            catch {
                // Rejecting confirmation requests is OK and should not delete the elements
            }
        }
        return false;
    }

    renderControls(transform: DOMMatrixReadOnly): JSX.Element {
        return [...this.controls]
            .filter(x => this.isSelected(x[0]))
            .map(x => {
                const key = x[0].key;
                const controls = [...x[1].values()];
                return createElement(
                    Fragment,
                    { children: controls.map(x => x.callback(transform, x.element)) },
                    key
                );
            });
    }

    hitTest(e: MouseEvent): HitInfo | undefined {
        if (this.diagram && this.screenCTM) {
            const transform = this.screenCTM.inverse();
            const point = new DOMPoint(e.clientX, e.clientY);
            const elementPoint = this.clientToDiagram(point);
            if (hasHitTestProps(e)) {
                return {
                    ...e.__hitTest,
                    screenX: point.x,
                    screenY: point.y,
                    elementX: elementPoint.x,
                    elementY: elementPoint.y,
                }
            }
            if (e.target && hasHitTestProps(e.target)) {
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
                for (let priority of priorities) {
                    let hit: DiagramElementHitTest | undefined;
                    for (let element of sortedElements) {
                        const list = [...(this.hitTests[priority]?.get(element)?.values() || [])];
                        hit = list.find(x => x.callback(point, transform));
                        if (hit) break;
                    }
                    if (hit) {
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
    }

    rectIntersectionTest(rect: Rect): DiagramElementNode[] {
        // Broad phase
        const tests = [...this.intersectionTests.values()]
            .filter(test => !test.bounds || intersectRect(test.bounds, rect));
        // Narrow phase
        return tests
            .filter(test => test.callback(rect))
            .map(test => test.element);
    }

    dispatchAction<T>(elements: DiagramElementNode[], action: string, payload: T) {
        const actions = [...this.actions.values()];
        elements.forEach(element => {
            if (!element.parent) {  // Newly added element, never rendered
                let pendingActions = this.pendingActions.get(element);
                if (!pendingActions) {
                    pendingActions = [];
                    this.pendingActions.set(element, pendingActions);
                }
                pendingActions.push({ action, payload });
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