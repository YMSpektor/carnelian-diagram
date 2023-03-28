import { createContext, Diagram, DiagramElementNode } from "..";
import { DiagramElementHitTest, hasHitTestProps, HitArea, HitAreaCollection, HitInfo } from "./hit-tests";
import { intersectRect, Rect } from "../geometry";
import { JSX } from "../jsx-runtime";
import { Event } from "../utils/events";

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

export interface DiagramElementBounds {
    element: DiagramElementNode;
    bounds: Rect;
}

export interface InteractionContextType {
    updateControls(controls?: DiagramElementControls, prevControls?: DiagramElementControls): void;
    updateHitTests(hitTests?: DiagramElementHitTest, prevHitTests?: DiagramElementHitTest): void;
    updateActions(action?: DiagramElementAction<any>, prevAction?: DiagramElementAction<any>): void;
    updateBounds(bounds?: DiagramElementBounds, prevBounds?: DiagramElementBounds): void;
}

export const InteractionContext = createContext<InteractionContextType | undefined>(undefined);
export const SelectionContext = createContext<DiagramElementNode[]>([]);

export interface MovementActionPayload {
    position: DOMPointReadOnly;
    deltaX: number;
    deltaY: number;
    hitArea: HitArea;
}

export class InteractionController {
    private controls: DiagramElementControls[] = [];
    private hitAreas: HitAreaCollection = {};
    private actions = new Map<DiagramElementNode, DiagramElementAction<any>[]>();
    private bounds = new Map<DiagramElementNode, DiagramElementBounds>();
    private contextValue: InteractionContextType;
    private dragging = false;
    private selecting = false;
    private selectedElements = new Set<DiagramElementNode>();
    elements: DiagramElementNode[] = [];
    transform?: DOMMatrixReadOnly;

    onSelect = new Event<DiagramElementNode[]>();
    onRectSelection = new Event<Rect | null>();

    constructor() {
        this.contextValue = this.createInteractionContextValue();
    }

    attach(diagram: Diagram, root: HTMLElement) {
        this.detach();
       
        const mouseDownHandler = (e: PointerEvent) => this.mouseDownHandler(root, e);
        const mouseMoveHandler = (e: PointerEvent) => this.mouseMoveHandler(root, e);
        const mouseUpHandler = (e: PointerEvent) => this.mouseUpHandler(root, e);
        const keyDownHandler = (e: KeyboardEvent) => this.keyDownHandler(diagram, root, e);
        root.addEventListener("pointerdown", mouseDownHandler);
        root.addEventListener("pointermove", mouseMoveHandler);
        root.addEventListener("pointerup", mouseUpHandler);
        root.addEventListener("keydown", keyDownHandler);

        const tabIndex = root.getAttribute("tabindex");
        if (!tabIndex || +tabIndex < 0) {
            root.setAttribute("tabindex", "0");
        }

        this.detach = () => {
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

    private createInteractionContextValue(): InteractionContextType {
        const updateControls = (newControls?: DiagramElementControls, prevControls?: DiagramElementControls) => {
            let newValue = prevControls ? this.controls.filter(x => x !== prevControls) : this.controls;
            newValue = newControls ? newValue.concat(newControls) : newValue;
            this.controls = newValue;
        }
    
        const updateHitTests = (newHitTests?: DiagramElementHitTest, prevHitTests?: DiagramElementHitTest) => {
            if (prevHitTests) {
                const map = this.hitAreas[prevHitTests.priority];
                let arr = map?.get(prevHitTests.element);
                arr = arr?.filter(x => x !== prevHitTests);
                if (arr && arr.length) {
                    map?.set(prevHitTests.element, arr);
                }
                else {
                    map?.delete(prevHitTests.element);
                }
            }
            if (newHitTests) {
                let map = this.hitAreas[newHitTests.priority];
                if (!map) {
                    map = new Map<DiagramElementNode, DiagramElementHitTest[]>();
                    this.hitAreas[newHitTests.priority] = map;
                }
                let arr = map.get(newHitTests.element) || [];
                arr = arr.concat(newHitTests);
                map.set(newHitTests.element, arr);
            }
        }
    
        const updateActions = (newAction?: DiagramElementAction<any>, prevAction?: DiagramElementAction<any>) => {
            if (prevAction) {
                this.actions.set(prevAction.element, this.actions.get(prevAction.element)?.filter(x => x !== prevAction) || []);
            }
            if (newAction) {
                this.actions.set(newAction.element, (this.actions.get(newAction.element) || []).concat(newAction));
            }
        }
    
        const updateBounds = (newBounds?: DiagramElementBounds, prevBounds?: DiagramElementBounds) => {
            if (prevBounds) {
                this.bounds.delete(prevBounds.element);
            }
            if (newBounds) {
                this.bounds.set(newBounds.element, newBounds);
            }
        }
    
        return {
            updateControls,
            updateHitTests,
            updateActions,
            updateBounds
        }
    }

    getContextValue(): InteractionContextType {
        return this.contextValue;
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
        this.onSelect.emit(elements);
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
                this.onSelect.emit([...this.selectedElements]);
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

    private keyDownHandler(diagram: Diagram, root: HTMLElement, e: KeyboardEvent) {
        // Firefox 36 and earlier uses "Del" instead of "Delete" for the Del key
        // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
        if ((e.key === "Delete" || e.key === "Del") && this.selectedElements.size > 0) {
            diagram.delete([...this.selectedElements]);
            root.style.cursor = "";
            this.select([]);
        }
    }

    private beginSelect(root: HTMLElement, e: PointerEvent) {
        this.selecting = true;
        root.setPointerCapture(e.pointerId);

        const startPoint = new DOMPoint(e.clientX, e.clientY);

        const mouseMoveHandler = (e: PointerEvent) => {
            const point = new DOMPoint(e.clientX, e.clientY)

            const selectionRect = {
                x: Math.min(startPoint.x, point.x),
                y: Math.min(startPoint.y, point.y),
                width: Math.max(startPoint.x, point.x) - Math.min(startPoint.x, point.x),
                height: Math.max(startPoint.y, point.y) - Math.min(startPoint.y, point.y),
            };

            this.onRectSelection.emit(selectionRect);
        }

        const mouseUpHandler = (e: PointerEvent) => {
            this.onRectSelection.emit(null);

            const p1 = this.clientToDiagram(startPoint);
            const p2 = this.clientToDiagram(new DOMPoint(e.clientX, e.clientY));
            const selectionRect = {
                x: Math.min(p1.x, p2.x),
                y: Math.min(p1.y, p2.y),
                width: Math.max(p1.x, p2.x) - Math.min(p1.x, p2.x),
                height: Math.max(p1.y, p2.y) - Math.min(p1.y, p2.y),
            };
            this.select([...this.bounds]
                .filter(x => intersectRect(selectionRect, x[1].bounds))
                .map(x => x[0]));

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

        let lastPoint = this.clientToDiagram(new DOMPoint(e.clientX, e.clientY));

        if (hitInfo.hitArea.action) {
            const mouseMoveHandler = (e: PointerEvent) => {
                const point = new DOMPoint(e.clientX, e.clientY);
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

    renderControls(transform: DOMMatrixReadOnly): JSX.Element {
        return this.controls
            .filter(x => this.isSelected(x.element))
            .map(x => x.callback(transform, x.element));
    }

    hitTest(e: MouseEvent) {
        if (this.transform) {
            const transform = this.transform;
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
                const priorities = Object.keys(this.hitAreas).map(x => parseInt(x)).reverse();
                const reversedElements = this.elements.slice().reverse();
                const sortedElements = reversedElements
                    .filter(x => this.isSelected(x))
                    .concat(reversedElements.filter(x => !this.isSelected(x)));  
                for (let priority of priorities) {
                    let hit: DiagramElementHitTest | undefined;
                    for (let element of sortedElements) {
                        hit = this.hitAreas[priority]
                            ?.get(element)
                            ?.find(x => x.callback(point, transform));
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

    dispatch<T>(elements: DiagramElementNode[], action: string, payload: T) {
        elements.forEach(element => {
            const callbacks = this.actions.get(element)
                ?.filter(x => x.action === action)
                ?.map(x => x.callback);
            if (callbacks) {
                callbacks.forEach(cb => cb(payload));
            }
        });
    }
}