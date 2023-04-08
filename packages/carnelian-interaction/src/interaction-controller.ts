import { Diagram, DiagramElementNode } from "@carnelian/diagram";
import { JSX } from "@carnelian/diagram/jsx-runtime";
import { Event } from "@carnelian/diagram/utils/events";
import { AddParameters } from "@carnelian/diagram/utils/types";
import { ControlsContextType, InteractionContextType } from "./context";
import { CreateHitTestProps, DiagramElementHitTest, hasHitTestProps, HitArea, HitTestCollection, HitInfo } from "./hit-tests";
import { renderEdgeDefault, renderHandleDefault } from "./controls";
import { DiagramElementIntersectionTest } from "./intersection-tests";
import { intersectRect, Rect } from "./geometry";

export type RenderControlsCallback = (transform: DOMMatrixReadOnly, element: DiagramElementNode) => JSX.Element;

export interface DiagramElementControls {
    element: DiagramElementNode;
    callback: RenderControlsCallback;
}

export type ActionCallback<T> = (payload: T) => void;

export interface DiagramElementAction<T> {
    action: string;
    element: DiagramElementNode;
    callback: ActionCallback<T>;
}

export interface MovementActionPayload {
    position: DOMPointReadOnly;
    deltaX: number;
    deltaY: number;
    hitArea: HitArea;
}

export interface SelectEventArgs {
    selectedElements: DiagramElementNode[];
}

export interface DeleteEventArg {
    elements: DiagramElementNode[];
    requestConfirmation(promise: Promise<boolean>): void;
}

export interface RectSelectionEventArgs {
    selectionRect: Rect | null;
}

export interface PaperChangeEventArgs {
    paper: PaperOptions | undefined;
}

export type ControlProps = Partial<CreateHitTestProps> & {
    className: string;
}

export type RenderHandleCallback = (kind: string, x: number, y: number, otherProps: ControlProps) => JSX.Element;
export type RenderEdgeCallback = (kind: string, x1: number, y1: number, x2: number, y2: number, otherProps: ControlProps) => JSX.Element;
export type DispatchActionCallback<T> = (elements: DiagramElementNode[], action: string, payload: T) => void;

export interface PaperOptions {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface InteractionControllerOptions {
    dispatchAction?: <T>(
        controller: InteractionController, 
        elements: DiagramElementNode[], 
        action: string, 
        payload: T,
        dispatch: DispatchActionCallback<T>,
        defaultDispatcher: DispatchActionCallback<T>
    ) => void;
    renderHandleControl?: AddParameters<RenderHandleCallback, [RenderHandleCallback]>;
    renderEdgeControl?: AddParameters<RenderEdgeCallback, [RenderEdgeCallback]>;
    paper?: PaperOptions;
}

export class InteractionController {
    private diagram: Diagram | null = null;
    private controls = new Map<object, DiagramElementControls>();
    private hitTests: HitTestCollection = {};
    private intersectionTests = new Map<object, DiagramElementIntersectionTest>;
    private actions = new Map<object, DiagramElementAction<any>>();
    private dragging = false;
    private selecting = false;
    private selectedElements = new Set<DiagramElementNode>();
    private paper?: PaperOptions;
    elements: DiagramElementNode[] = [];
    transform?: DOMMatrixReadOnly;
    interactionContext: InteractionContextType;
    controlsContext: ControlsContextType;

    onSelect = new Event<SelectEventArgs>();
    onDelete = new Event<DeleteEventArg>();
    onRectSelection = new Event<RectSelectionEventArgs>();
    onPaperChange = new Event<PaperChangeEventArgs>();

    constructor(private options?: InteractionControllerOptions) {
        this.interactionContext = this.createInteractionContext();
        this.controlsContext = this.createControlsContext();
        this.paper = options?.paper;
    }

    attach(diagram: Diagram, root: HTMLElement) {
        this.diagram = diagram;
        this.detach();
       
        const mouseDownHandler = (e: PointerEvent) => this.mouseDownHandler(root, e);
        const mouseMoveHandler = (e: PointerEvent) => this.mouseMoveHandler(root, e);
        const mouseUpHandler = (e: PointerEvent) => this.mouseUpHandler(root, e);
        const keyDownHandler = (e: KeyboardEvent) => this.keyDownHandler(root, e);
        root.addEventListener("pointerdown", mouseDownHandler);
        root.addEventListener("pointermove", mouseMoveHandler);
        root.addEventListener("pointerup", mouseUpHandler);
        root.addEventListener("keydown", keyDownHandler);

        const tabIndex = root.getAttribute("tabindex");
        if (!tabIndex || +tabIndex < 0) {
            root.setAttribute("tabindex", "0");
        }

        this.detach = () => {
            this.diagram = null;
            this.detach = () => {};
            root.removeEventListener("pointerdown", mouseDownHandler);
            root.removeEventListener("pointermove", mouseMoveHandler);
            root.removeEventListener("pointerup", mouseUpHandler);
            root.removeEventListener("keydown", keyDownHandler);
            
            if (!tabIndex) {
                root.removeAttribute("tabindex");
            }
            else if (+tabIndex < 0) {
                root.setAttribute("tabindex", tabIndex);
            }
        }
    }

    detach() {};

    private createInteractionContext(): InteractionContextType {
        const updateControls = (key: {}, controls?: DiagramElementControls) => {
            if (controls) {
                this.controls.set(key, controls);
            }
            else {
                this.controls.delete(key);
            }
        }
    
        const updateHitTests = (key: {priority: number, element: DiagramElementNode}, hitTest?: DiagramElementHitTest) => {
            let map = this.hitTests[key.priority];
            if (!map) {
                map = this.hitTests[key.priority] = new Map<DiagramElementNode, Map<object, DiagramElementHitTest>>();
            }
            let hitTestMap = map.get(key.element);
            if (!hitTestMap) {
                hitTestMap = new Map<object, DiagramElementHitTest>();
                map.set(key.element, hitTestMap);
            }
            if (hitTest) {
                hitTestMap.set(key, hitTest);
            }
            else {
                hitTestMap.delete(key);
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

    private createControlsContext(): ControlsContextType {
        const renderHandle: RenderHandleCallback = (kind, x, y, otherProps) => {
            return this.options?.renderHandleControl 
                ? this.options.renderHandleControl(kind, x, y, otherProps, renderHandleDefault)
                : renderHandleDefault(kind, x, y, otherProps);
        }

        const renderEdge: RenderEdgeCallback = (kind, x1, y1, x2, y2, otherProps) => {
            return this.options?.renderEdgeControl 
                ? this.options.renderEdgeControl(kind, x1, y1, x2, y2, otherProps, renderEdgeDefault)
                : renderEdgeDefault(kind, x1, y1, x2, y2, otherProps);
        }

        return {
            renderHandle,
            renderEdge
        }
    }

    clientToDiagram(point: DOMPointReadOnly): DOMPointReadOnly {
        return point.matrixTransform(this.transform);
    }

    diagramToClient(point: DOMPointReadOnly): DOMPointReadOnly {
        return point.matrixTransform(this.transform?.inverse());
    }

    select(element: DiagramElementNode): void;
    select(elements: DiagramElementNode[]): void;
    select(elements: DiagramElementNode | DiagramElementNode[]) {
        if (!Array.isArray(elements)) {
            elements = [elements];
        }
        this.selectedElements = new Set(elements);
        this.onSelect.emit({selectedElements: elements});
    }

    private mouseDownHandler(root: HTMLElement, e: PointerEvent) {
         if (this.dragging || this.selecting) return;

        const hitInfo = this.hitTest(e);
        if (hitInfo) {
            const isSelected = this.selectedElements.has(hitInfo.element);

            if (e.shiftKey) {
                if (isSelected) {
                    this.selectedElements.delete(hitInfo.element);
                    root.style.cursor = "";
                }
                else {
                    this.selectedElements.add(hitInfo.element);
                    root.style.cursor = hitInfo.hitArea.cursor || "";
                }
                this.onSelect.emit({selectedElements: [...this.selectedElements]});
            } 
            else {
                if (!isSelected) {
                    root.style.cursor = hitInfo.hitArea.cursor || "";
                    this.select(hitInfo.element);
                }
                else {
                    this.beginDrag(root, e, hitInfo);
                }
            }
        }
        else {
            if (this.selectedElements.size > 0) {
                root.style.cursor = "";
                this.select([]);
            }
            this.beginSelect(root, e);
        }
    }

    private mouseMoveHandler(root: HTMLElement, e: PointerEvent) {
        if (!this.dragging && !this.selecting) {
            const hitInfo = this.hitTest(e);
            const isSelected = hitInfo && this.selectedElements.has(hitInfo.element);

            root.style.cursor = isSelected ? hitInfo?.hitArea.cursor || "" : "";
        }
    }

    private mouseUpHandler(root: HTMLElement, e: PointerEvent) {
        if (this.dragging) {
            this.endDrag(root, e);
        }
        if (this.selecting) {
            this.endSelect(root, e);
        }
    }

    private async keyDownHandler(root: HTMLElement, e: KeyboardEvent) {
        // Firefox 36 and earlier uses "Del" instead of "Delete" for the Del key
        // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
        if ((e.key === "Delete" || e.key === "Del") && this.selectedElements.size > 0) {
            const result = await this.delete([...this.selectedElements]);
            if (result) {
                root.style.cursor = "";
            }
        }
    }

    private beginSelect(root: HTMLElement, e: PointerEvent) {
        this.selecting = true;
        root.setPointerCapture(e.pointerId);

        const startPoint = new DOMPoint(e.offsetX, e.offsetY);

        const mouseMoveHandler = (e: PointerEvent) => {
            const point = new DOMPoint(e.offsetX, e.offsetY)

            const selectionRect = {
                x: Math.min(startPoint.x, point.x),
                y: Math.min(startPoint.y, point.y),
                width: Math.max(startPoint.x, point.x) - Math.min(startPoint.x, point.x),
                height: Math.max(startPoint.y, point.y) - Math.min(startPoint.y, point.y),
            };

            this.onRectSelection.emit({selectionRect});
        }

        const mouseUpHandler = (e: PointerEvent) => {
            this.onRectSelection.emit({selectionRect: null});

            if (startPoint.x !== e.offsetX || startPoint.y !== e.offsetY) {
                const p1 = this.clientToDiagram(startPoint);
                const p2 = this.clientToDiagram(new DOMPoint(e.offsetX, e.offsetY));
                const selectionRect = {
                    x: Math.min(p1.x, p2.x),
                    y: Math.min(p1.y, p2.y),
                    width: Math.max(p1.x, p2.x) - Math.min(p1.x, p2.x),
                    height: Math.max(p1.y, p2.y) - Math.min(p1.y, p2.y),
                };

                // Broad phase
                const tests = [...this.intersectionTests.values()]
                    .filter(test => !test.bounds || intersectRect(test.bounds, selectionRect));
                // Narrow phase
                this.select(tests
                    .filter(test => test.callback(selectionRect))
                    .map(test => test.element)
                );
            }

            root.removeEventListener("pointermove", mouseMoveHandler);
            root.removeEventListener("pointerup", mouseUpHandler);
        }

        root.addEventListener("pointermove", mouseMoveHandler);
        root.addEventListener("pointerup", mouseUpHandler);
    }

    private endSelect(root: HTMLElement, e: PointerEvent) {
        this.selecting = false;
        root.releasePointerCapture(e.pointerId);
    }

    private beginDrag(root: HTMLElement, e: PointerEvent, hitInfo: HitInfo) {
        this.dragging = true;
        root.setPointerCapture(e.pointerId);

        let lastPoint = this.clientToDiagram(new DOMPoint(e.offsetX, e.offsetY));

        if (hitInfo.hitArea.action) {
            const mouseMoveHandler = (e: PointerEvent) => {
                const point = new DOMPoint(e.offsetX, e.offsetY);
                const elementPoint = this.clientToDiagram(point);

                this.dispatch<MovementActionPayload>(
                    [hitInfo.element],
                    hitInfo.hitArea.action,
                    {
                        position: elementPoint,
                        deltaX: elementPoint.x - lastPoint.x,
                        deltaY: elementPoint.y - lastPoint.y,
                        hitArea: hitInfo.hitArea,
                    });

                lastPoint = elementPoint;
            }

            const mouseUpHandler = (e: PointerEvent) => {
                root.removeEventListener("pointermove", mouseMoveHandler);
                root.removeEventListener("pointerup", mouseUpHandler);
            }

            root.addEventListener("pointermove", mouseMoveHandler);
            root.addEventListener("pointerup", mouseUpHandler);
        }
    }

    private endDrag(root: HTMLElement, e: PointerEvent) {
        this.dragging = false;
        root.releasePointerCapture(e.pointerId);
    }

    isSelected(element: DiagramElementNode) {
        return this.selectedElements.has(element);
    }

    getSelectedElements() {
        return [...this.selectedElements];
    }

    async delete(elements: DiagramElementNode[]): Promise<boolean> {
        if (this.diagram) {
            const promises: Promise<boolean>[] = [];
            this.onDelete.emit({
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
        return [...this.controls.values()]
            .filter(x => this.isSelected(x.element))
            .map(x => x.callback(transform, x.element));
    }

    hitTest(e: MouseEvent) {
        if (this.transform) {
            const transform = this.transform;
            const point = new DOMPoint(e.offsetX, e.offsetY);
            if (e.target && hasHitTestProps(e.target)) {
                const elementPoint = this.clientToDiagram(point);
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
                const sortedElements = this.elements.slice().reverse();
                for (let priority of priorities) {
                    let hit: DiagramElementHitTest | undefined;
                    for (let element of sortedElements) {
                        const list = [...(this.hitTests[priority]?.get(element)?.values() || [])];
                        hit = list.find(x => x.callback(point, transform));
                        if (hit) break;
                    }
                    if (hit) {
                        const elementPoint = this.clientToDiagram(point);
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

    private dispatchInternal<T>(elements: DiagramElementNode[], action: string, payload: T) {
        const actions = [...this.actions.values()];
        elements.forEach(element => {
            const callbacks = actions
                .filter(x => x.element === element && x.action === action)
                .map(x => x.callback);
            if (callbacks) {
                callbacks.forEach(cb => cb(payload));
            }
        });
    }

    private dispatchDefault<T>(elements: DiagramElementNode[], action: string, payload: T) {
        if (action === "move") {
            this.dispatchInternal([...this.selectedElements], action, payload);
        }
        else {
            this.dispatchInternal(elements, action, payload);
        }
    }

    dispatch<T>(elements: DiagramElementNode[], action: string, payload: T) {
        if (this.options?.dispatchAction) {
            this.options.dispatchAction(this, elements, action, payload, this.dispatchInternal, this.dispatchDefault);
        }
        else {
            this.dispatchDefault(elements, action, payload);
        }
    }

    getPaperOptions(): PaperOptions | undefined {
        return this.paper;
    }

    updatePaper(paper: PaperOptions | undefined) {
        this.paper = paper;
        this.onPaperChange.emit({paper});
    }
}