import { createContext, DiagramElementNode } from "..";
import { DiagramElementHitTest, hasHitTestProps, HitArea, HitAreaCollection, HitInfo } from "./hit-tests";
import { intersectRect, Rect } from "../geometry";
import { JSXElement } from "../jsx-runtime";

export type RenderControlsCallback = (transform: DOMMatrixReadOnly, element: DiagramElementNode) => JSXElement;

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

export interface InteractionControllerType {
    updateTransform(transform?: DOMMatrixReadOnly): void;
    updateControls(controls?: DiagramElementControls, prevControls?: DiagramElementControls): void;
    renderControls(transform: DOMMatrixReadOnly): JSXElement;
    updateHitTests(hitTests?: DiagramElementHitTest, prevHitTests?: DiagramElementHitTest): void;
    hitTest(e: MouseEvent): HitInfo | undefined;
    updateActions(action?: DiagramElementAction<any>, prevAction?: DiagramElementAction<any>): void;
    dispatch<T>(elements: DiagramElementNode[], action: string, payload: T): void;
    updateBounds(bounds?: DiagramElementBounds, prevBounds?: DiagramElementBounds): void;

    onSelect?: (elements: DiagramElementNode[]) => void;
    onRectSelection?: (selection?: Rect) => void;
}

export const InteractionContext = createContext<InteractionControllerType | undefined>(undefined);
export const SelectionContext = createContext<DiagramElementNode[]>([]);

export interface MovementActionPayload {
    position: DOMPointReadOnly;
    deltaX: number;
    deltaY: number;
    hitArea: HitArea;
}

export class InteractionController implements InteractionControllerType {
    private controls: DiagramElementControls[] = [];
    private hitAreas: HitAreaCollection = {};
    private actions = new Map<DiagramElementNode, DiagramElementAction<any>[]>();
    private bounds = new Map<DiagramElementNode, DiagramElementBounds>();
    private selectedElements = new Set<DiagramElementNode>();
    private dragging = false;
    private selecting = false;
    elements: DiagramElementNode[] = [];

    constructor(private svg: SVGGraphicsElement, private transform?: DOMMatrixReadOnly) {}

    updateTransform(transform?: DOMMatrixReadOnly) {
        this.transform = transform;
        this.svg.onpointerdown = (e) => this.mouseDownHandler(e);
        this.svg.onpointermove = (e) => this.mouseMoveHandler(e);
        this.svg.onpointerup = (e) => this.mouseUpHandler(e);
    }

    private select(elements: DiagramElementNode[]) {
        this.selectedElements = new Set(elements);
        this.onSelect?.(elements);
    }

    private mouseDownHandler(e: PointerEvent) {
        if (this.dragging || this.selecting) return;

        const hitInfo = this.hitTest(e);
        if (hitInfo) {
            const isSelected = this.selectedElements.has(hitInfo.element);

            if (e.shiftKey) {
                if (isSelected) {
                    this.selectedElements.delete(hitInfo.element);
                    this.svg.style.cursor = "";
                }
                else {
                    this.selectedElements.add(hitInfo.element);
                    this.svg.style.cursor = hitInfo.hitArea.cursor || "";
                }
                this.onSelect?.([...this.selectedElements]);
            } 
            else {
                if (!isSelected) {
                    this.svg.style.cursor = hitInfo.hitArea.cursor || "";
                    this.select([hitInfo.element]);
                }
                else {
                    this.beginDrag(e, hitInfo);
                }
            }
        }
        else {
            if (this.selectedElements.size > 0) {
                this.svg.style.cursor = "";
                this.select([]);
            }
            this.beginSelect(e);
        }
    }

    private mouseMoveHandler(e: PointerEvent) {
        if (!this.dragging && !this.selecting) {
            const hitInfo = this.hitTest(e);
            const isSelected = hitInfo && this.selectedElements.has(hitInfo.element);

            this.svg.style.cursor = isSelected ? hitInfo?.hitArea.cursor || "" : "";
        }
    }

    private mouseUpHandler(e: PointerEvent) {
        if (this.dragging) {
            this.endDrag(e);
        }
        if (this.selecting) {
            this.endSelect(e);
        }
    }

    private beginSelect(e: PointerEvent) {
        this.selecting = true;
        this.svg.setPointerCapture(e.pointerId);

        const startPoint = new DOMPoint(e.clientX, e.clientY);

        const mouseMoveHandler = (e: PointerEvent) => {
            const point = new DOMPoint(e.clientX, e.clientY)

            const selectionRect = {
                x: Math.min(startPoint.x, point.x),
                y: Math.min(startPoint.y, point.y),
                width: Math.max(startPoint.x, point.x) - Math.min(startPoint.x, point.x),
                height: Math.max(startPoint.y, point.y) - Math.min(startPoint.y, point.y),
            };

            this.onRectSelection?.(selectionRect);
        }

        const mouseUpHandler = (e: PointerEvent) => {
            this.onRectSelection?.(undefined);

            const p1 = startPoint.matrixTransform(this.transform);
            const p2 = new DOMPoint(e.clientX, e.clientY).matrixTransform(this.transform);
            const selectionRect = {
                x: Math.min(p1.x, p2.x),
                y: Math.min(p1.y, p2.y),
                width: Math.max(p1.x, p2.x) - Math.min(p1.x, p2.x),
                height: Math.max(p1.y, p2.y) - Math.min(p1.y, p2.y),
            };
            this.select([...this.bounds]
                .filter(x => intersectRect(selectionRect, x[1].bounds))
                .map(x => x[0]));

            this.svg.removeEventListener("pointermove", mouseMoveHandler);
            this.svg.removeEventListener("pointerup", mouseUpHandler);
        }

        this.svg.addEventListener("pointermove", mouseMoveHandler);
        this.svg.addEventListener("pointerup", mouseUpHandler);
    }

    private endSelect(e: PointerEvent) {
        this.selecting = false;
        this.svg.releasePointerCapture(e.pointerId);
    }

    private beginDrag(e: PointerEvent, hitInfo: HitInfo) {
        this.dragging = true;
        this.svg.setPointerCapture(e.pointerId);

        let lastPoint = new DOMPoint(e.clientX, e.clientY).matrixTransform(this.transform);

        if (hitInfo.hitArea.action) {
            const mouseMoveHandler = (e: PointerEvent) => {
                const point = new DOMPoint(e.clientX, e.clientY);
                const elementPoint = point.matrixTransform(this.transform);

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
                this.svg.removeEventListener("pointermove", mouseMoveHandler);
                this.svg.removeEventListener("pointerup", mouseUpHandler);
            }

            this.svg.addEventListener("pointermove", mouseMoveHandler);
            this.svg.addEventListener("pointerup", mouseUpHandler);
        }
    }

    private endDrag(e: PointerEvent) {
        this.dragging = false;
        this.svg.releasePointerCapture(e.pointerId);
    }

    isSelected(element: DiagramElementNode) {
        return this.selectedElements.has(element);
    }

    updateControls(newControls?: DiagramElementControls, prevControls?: DiagramElementControls) {
        let newValue = prevControls ? this.controls.filter(x => x !== prevControls) : this.controls;
        newValue = newControls ? newValue.concat(newControls) : newValue;
        this.controls = newValue;
    }

    renderControls(transform: DOMMatrixReadOnly): JSXElement {
        return this.controls
            .filter(x => this.isSelected(x.element))
            .map(x => x.callback(transform, x.element));
    }

    updateHitTests(newHitTests?: DiagramElementHitTest, prevHitTests?: DiagramElementHitTest) {
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

    hitTest(e: MouseEvent) {
        if (this.transform) {
            const transform = this.transform;
            const point = new DOMPoint(e.clientX, e.clientY);
            if (e.target && hasHitTestProps(e.target)) {
                const elementPoint = point.matrixTransform(transform);
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
                        const elementPoint = point.matrixTransform(transform);
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

    updateActions(newAction?: DiagramElementAction<any>, prevAction?: DiagramElementAction<any>) {
        if (prevAction) {
            this.actions.set(prevAction.element, this.actions.get(prevAction.element)?.filter(x => x !== prevAction) || []);
        }
        if (newAction) {
            this.actions.set(newAction.element, (this.actions.get(newAction.element) || []).concat(newAction));
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

    updateBounds(newBounds?: DiagramElementBounds, prevBounds?: DiagramElementBounds) {
        if (prevBounds) {
            this.bounds.delete(prevBounds.element);
        }
        if (newBounds) {
            this.bounds.set(newBounds.element, newBounds);
        }
    }

    onSelect?: (elements: DiagramElementNode[]) => void;
    onRectSelection?: (selection?: Rect) => void;
}