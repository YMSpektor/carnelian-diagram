import { Diagram, DiagramElementNode } from "@carnelian/diagram";
import { createElement, Fragment, JSX } from "@carnelian/diagram/jsx-runtime";
import { Event } from "@carnelian/diagram/utils/events";
import { AddParameters, MutableRefObject } from "@carnelian/diagram/utils/types";
import { ControlsContextType, InteractionContextType } from "./context";
import { CreateHitTestProps, DiagramElementHitTest, hasHitTestProps, HitTestCollection, HitInfo } from "./hit-tests";
import { renderEdgeDefault, renderHandleDefault } from "./controls";
import { DiagramElementIntersectionTest } from "./intersection-tests";
import { intersectRect, Rect } from "./geometry";
import { ACT_DRAW_POINT_CANCEL, ACT_DRAW_POINT_CANCEL_Payload, ACT_DRAW_POINT_MOVE, ACT_DRAW_POINT_MOVE_Payload, ACT_DRAW_POINT_PLACE, ACT_DRAW_POINT_PLACE_Payload, ACT_MOVE, DraggingActionPayload } from "./actions";

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
    majorGridSize?: number;
    majorGridColor?: string;
    minorGridSize?: number;
    minorGridColor?: string;
}

export type DrawingModeElementFactory = (diagram: Diagram, x: number, y: number) => DiagramElementNode;

export interface InteractionControllerOptions {
    dispatchAction?: <T>(
        controller: InteractionController, 
        elements: DiagramElementNode[], 
        action: string, 
        payload: T,
        isPendingAction: boolean,
        dispatch: DispatchActionCallback<T>,
        defaultDispatcher: DispatchActionCallback<T>
    ) => void;
    renderHandleControl?: AddParameters<RenderHandleCallback, [RenderHandleCallback]>;
    renderEdgeControl?: AddParameters<RenderEdgeCallback, [RenderEdgeCallback]>;
    paper?: PaperOptions;
    snapGridSize?: number | null;
    snapAngle?: number | null;
}

export class InteractionController {
    private diagram: Diagram | null = null;
    private controls = new Map<DiagramElementNode, Map<object, DiagramElementControls>>();
    private hitTests: HitTestCollection = {};
    private intersectionTests = new Map<object, DiagramElementIntersectionTest>;
    private actions = new Map<object, DiagramElementAction<any>>();
    private pendingActions = new Map<DiagramElementNode, PendingAction<any>[]>();
    private dragging = false;
    private selecting = false;
    private drawing = false;
    private selectedElements = new Set<DiagramElementNode>();
    private paper?: PaperOptions;
    private drawingModeFactory: DrawingModeElementFactory | null = null;
    elements: DiagramElementNode[] = [];
    screenCTM?: DOMMatrixReadOnly;
    interactionContext: InteractionContextType;
    controlsContext: ControlsContextType;
    snapGridSize: number | null = null;
    snapAngle: number | null = null;

    onSelect = new Event<SelectEventArgs>();
    onDelete = new Event<DeleteEventArg>();
    onRectSelection = new Event<RectSelectionEventArgs>();
    onPaperChange = new Event<PaperChangeEventArgs>();

    constructor(private options?: InteractionControllerOptions) {
        this.interactionContext = this.createInteractionContext();
        this.controlsContext = this.createControlsContext();
        this.paper = options?.paper;
        this.snapGridSize = options?.snapGridSize || null;
        this.snapAngle = options?.snapAngle || null;
    }

    attach(diagram: Diagram, root: HTMLElement) {
        this.diagram = diagram;
        this.detach();
       
        const mouseDownHandler = (e: PointerEvent) => this.mouseDownHandler(root, e);
        const mouseMoveHandler = (e: PointerEvent) => this.mouseMoveHandler(root, e);
        const keyDownHandler = (e: KeyboardEvent) => this.keyDownHandler(root, e);
        root.addEventListener("pointerdown", mouseDownHandler);
        root.addEventListener("pointermove", mouseMoveHandler);
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
        return point.matrixTransform(this.screenCTM?.inverse());
    }

    diagramToClient(point: DOMPointReadOnly): DOMPointReadOnly {
        return point.matrixTransform(this.screenCTM);
    }

    snapToGrid(value: number, snapGridSize?: number | null): number;
    snapToGrid(point: DOMPointReadOnly, snapGridSize?: number | null): DOMPointReadOnly;
    snapToGrid(value: DOMPointReadOnly | number, snapGridSize?: number | null): DOMPointReadOnly | number {
        snapGridSize = snapGridSize !== undefined ? snapGridSize : this.snapGridSize;
        if (typeof value === "number") {
            return snapGridSize ? Math.round(value / snapGridSize) * snapGridSize : value
        }
        else {
            return snapGridSize ? new DOMPoint(this.snapToGrid(value.x, snapGridSize), this.snapToGrid(value.y, snapGridSize)) : value;
        }
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
        if (this.dragging || this.selecting || this.drawing || e.button !== 0) return;

        if (this.drawingModeFactory && this.diagram) {
            this.beginDraw(root, e, this.diagram, this.drawingModeFactory);
        }
        else {
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
    }

    private mouseMoveHandler(root: HTMLElement, e: PointerEvent) {
        if (!this.dragging && !this.selecting && !this.drawing) {
            if (this.drawingModeFactory) {
                root.style.cursor = "copy";
            }
            else {
                const hitInfo = this.hitTest(e);
                const isSelected = hitInfo && this.selectedElements.has(hitInfo.element);

                root.style.cursor = isSelected ? hitInfo?.hitArea.cursor || "" : "";
            }
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

        const startPoint = this.clientToDiagram(new DOMPoint(e.clientX, e.clientY));

        const mouseMoveHandler = (e: PointerEvent) => {
            const point = this.clientToDiagram(new DOMPoint(e.clientX, e.clientY));

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
            const point = this.clientToDiagram(new DOMPoint(e.clientX, e.clientY));

            if (startPoint.x !== point.x || startPoint.y !== point.y) {
                const selectionRect = {
                    x: Math.min(startPoint.x, point.x),
                    y: Math.min(startPoint.y, point.y),
                    width: Math.max(startPoint.x, point.x) - Math.min(startPoint.x, point.x),
                    height: Math.max(startPoint.y, point.y) - Math.min(startPoint.y, point.y),
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

            this.selecting = false;
            root.releasePointerCapture(e.pointerId);

            root.removeEventListener("pointermove", mouseMoveHandler);
            root.removeEventListener("pointerup", mouseUpHandler);
        }

        root.addEventListener("pointermove", mouseMoveHandler);
        root.addEventListener("pointerup", mouseUpHandler);
    }

    private beginDrag(root: HTMLElement, e: PointerEvent, hitInfo: HitInfo) {
        this.dragging = true;
        root.setPointerCapture(e.pointerId);

        let lastPoint = this.clientToDiagram(new DOMPoint(e.clientX, e.clientY));

        if (hitInfo.hitArea.action) {
            const mouseMoveHandler = (e: PointerEvent) => {
                const point = new DOMPoint(e.clientX, e.clientY);
                const snapGridSize = !e.altKey ? this.snapGridSize : null;
                const elementPoint = this.clientToDiagram(point);
                const snappedElementPoint = this.snapToGrid(elementPoint, snapGridSize);

                this.dispatch<DraggingActionPayload>(
                    [hitInfo.element],
                    hitInfo.hitArea.action,
                    {
                        position: snappedElementPoint,
                        deltaX: this.snapToGrid(snappedElementPoint.x - lastPoint.x, snapGridSize),
                        deltaY: this.snapToGrid(snappedElementPoint.y - lastPoint.y, snapGridSize),
                        rawPosition: elementPoint,
                        rawDeltaX: elementPoint.x - lastPoint.x,
                        rawDeltaY: elementPoint.y - lastPoint.y,
                        hitArea: hitInfo.hitArea,
                        snapGridSize,
                        snapAngle: !e.altKey ? this.snapAngle : null,
                        snapToGrid: this.snapToGrid.bind(this)
                    });

                lastPoint = elementPoint;
            }

            const mouseUpHandler = (e: PointerEvent) => {
                this.dragging = false;
                root.releasePointerCapture(e.pointerId);

                root.removeEventListener("pointermove", mouseMoveHandler);
                root.removeEventListener("pointerup", mouseUpHandler);
            }

            root.addEventListener("pointermove", mouseMoveHandler);
            root.addEventListener("pointerup", mouseUpHandler);
        }
    }

    private beginDraw(root: HTMLElement, e: PointerEvent, diagram: Diagram, factory: DrawingModeElementFactory) {
        this.drawing = true;
        root.setPointerCapture(e.pointerId);
        root.style.cursor = "";

        const point = new DOMPoint(e.clientX, e.clientY);
        const snapGridSize = !e.altKey ? this.snapGridSize : null;
        const elementPoint = this.clientToDiagram(point);
        const snappedElementPoint = this.snapToGrid(elementPoint, snapGridSize);
        const element = factory(diagram, snappedElementPoint.x, snappedElementPoint.y);
        this.select(element);

        const endDraw = () => {
            this.drawing = false;
            root.releasePointerCapture(e.pointerId);

            root.removeEventListener("pointermove", mouseMoveHandler);
            root.removeEventListener("pointerdown", mouseDownHandler);
            root.removeEventListener("keydown", keyDownHandler);
        }

        let pointIndex = 0;
        const result: MutableRefObject<boolean> = { current: false };
        const drawPoint = (e: PointerEvent, dispatchPending: boolean) => {
            const point = new DOMPoint(e.clientX, e.clientY);
            const snapGridSize = !e.altKey ? this.snapGridSize : null;
            const elementPoint = this.clientToDiagram(point);
            const snappedElementPoint = this.snapToGrid(elementPoint, snapGridSize);

            this.dispatch<ACT_DRAW_POINT_PLACE_Payload>([element], ACT_DRAW_POINT_PLACE, {
                position: snappedElementPoint,
                rawPosition: elementPoint,
                snapGridSize,
                snapAngle: !e.altKey ? this.snapAngle : null,
                snapToGrid: this.snapToGrid.bind(this),
                pointIndex,
                result
            }, dispatchPending);
            pointIndex++;

            if (result.current) {
                endDraw();
            }
        }

        const mouseMoveHandler = (e: PointerEvent) => {
            const point = new DOMPoint(e.clientX, e.clientY);
            const snapGridSize = !e.altKey ? this.snapGridSize : null;
            const elementPoint = this.clientToDiagram(point);
            const snappedElementPoint = this.snapToGrid(elementPoint, snapGridSize);

            this.dispatch<ACT_DRAW_POINT_MOVE_Payload>([element], ACT_DRAW_POINT_MOVE, {
                position: snappedElementPoint,
                rawPosition: elementPoint,
                snapGridSize,
                snapAngle: !e.altKey ? this.snapAngle : null,
                snapToGrid: this.snapToGrid.bind(this),
                pointIndex
            });
        }

        const mouseDownHandler = (e: PointerEvent) => {
            if (e.button === 0) {
                drawPoint(e, false);
            }
            else if (e.button === 2) {
                this.dispatch<ACT_DRAW_POINT_CANCEL_Payload>([element], ACT_DRAW_POINT_CANCEL, {});
                endDraw();
            }            
        }

        const keyDownHandler = (e: KeyboardEvent) => {
            // Firefox 36 and earlier uses "Esc" instead of "Escape" for the Esc key
            // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
            if (e.key === "Escape" || e.key === "Esc") {
                this.dispatch<ACT_DRAW_POINT_CANCEL_Payload>([element], ACT_DRAW_POINT_CANCEL, {});
                endDraw();
            }
        }

        root.addEventListener("pointermove", mouseMoveHandler);
        root.addEventListener("pointerdown", mouseDownHandler);
        root.addEventListener("keydown", keyDownHandler);

        drawPoint(e, true);
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

    hitTest(e: MouseEvent) {
        if (this.screenCTM) {
            const transform = this.screenCTM.inverse();
            const point = new DOMPoint(e.clientX, e.clientY);
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

    switchDrawingMode(elementFactory: DrawingModeElementFactory | null) {
        this.drawingModeFactory = elementFactory;
    }

    private dispatchInternal<T>(elements: DiagramElementNode[], action: string, payload: T, isPendingAction = false) {
        if (isPendingAction) {
            elements.forEach(element => {
                let pendingActions = this.pendingActions.get(element);
                if (!pendingActions) {
                    pendingActions = [];
                    this.pendingActions.set(element, pendingActions);
                }
                pendingActions.push({ action, payload });
            });
        }
        else {
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
    }

    private dispatchDefault<T>(elements: DiagramElementNode[], action: string, payload: T, isPendingAction = false) {
        if (action === ACT_MOVE) {
            this.dispatchInternal([...this.selectedElements], action, payload, isPendingAction);
        }
        else {
            this.dispatchInternal(elements, action, payload, isPendingAction);
        }
    }

    dispatch<T>(elements: DiagramElementNode[], action: string, payload: T, isPendingAction = false) {
        if (this.options?.dispatchAction) {
            this.options.dispatchAction(this, elements, action, payload, isPendingAction, this.dispatchInternal, this.dispatchDefault);
        }
        else {
            this.dispatchDefault(elements, action, payload, isPendingAction);
        }
    }

    getPaper(): PaperOptions | undefined {
        return this.paper;
    }

    updatePaper(paper: PaperOptions | undefined) {
        this.paper = paper;
        this.onPaperChange.emit({paper});
    }
}