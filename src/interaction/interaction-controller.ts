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
    elements: DiagramElementNode[];
    transform?: DOMMatrixReadOnly;

    attach(root: HTMLElement): void;
    detach?: () => void;
    updateControls(controls?: DiagramElementControls, prevControls?: DiagramElementControls): void;
    renderControls(transform: DOMMatrixReadOnly): JSXElement;
    updateHitTests(hitTests?: DiagramElementHitTest, prevHitTests?: DiagramElementHitTest): void;
    updateActions(action?: DiagramElementAction<any>, prevAction?: DiagramElementAction<any>): void;
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
    transform?: DOMMatrixReadOnly;

    constructor(root?: HTMLElement) {
        root && this.attach(root);
    }

    attach(root: HTMLElement) {
        this.detach?.();
       
        const mouseDownHandler = (e: PointerEvent) => this.mouseDownHandler(root, e);
        const mouseMoveHandler = (e: PointerEvent) => this.mouseMoveHandler(root, e);
        const mouseUpHandler = (e: PointerEvent) => this.mouseUpHandler(root, e);
        root.addEventListener("pointerdown", mouseDownHandler);
        root.addEventListener("pointermove", mouseMoveHandler);
        root.addEventListener("pointerup", mouseUpHandler);

        this.detach = () => {
            this.detach = undefined;
            root.removeEventListener("pointerdown", mouseDownHandler);
            root.removeEventListener("pointermove", mouseMoveHandler);
            root.removeEventListener("pointerup", mouseUpHandler);
        }
    }

    detach?: () => void;

    private select(elements: DiagramElementNode[]) {
        this.selectedElements = new Set(elements);
        this.onSelect?.(elements);
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
                this.onSelect?.([...this.selectedElements]);
            } 
            else {
                if (!isSelected) {
                    root.style.cursor = hitInfo.hitArea.cursor || "";
                    this.select([hitInfo.element]);
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