import { createContext, DiagramElementNode, DiagramNode } from "..";
import { DiagramElementHitTest, hasHitTestProps, HitArea, HitAreaCollection, HitInfo } from "./hit-tests";

export type RenderControlsCallback = (transform: DOMMatrixReadOnly, element: DiagramNode) => JSX.Element;

export interface DiagramElementControls {
    element: DiagramNode;
    callback: RenderControlsCallback;
}

export type ActionCallback<T> = (payload: T) => void;

export interface DiagramElementAction<T> {
    action: string;
    element: DiagramNode;
    callback: ActionCallback<T>;
}

export interface InteractionControllerType {
    updateTransform(transform?: DOMMatrixReadOnly): void;
    isSelected(element: DiagramNode): boolean;
    updateControls(controls?: DiagramElementControls, prevControls?: DiagramElementControls): void;
    renderControls(transform: DOMMatrixReadOnly): JSX.Element;
    updateHitTests(hitTests?: DiagramElementHitTest, prevHitTests?: DiagramElementHitTest): void;
    hitTest(e: MouseEvent): HitInfo | undefined;
    updateActions(action?: DiagramElementAction<any>, prevAction?: DiagramElementAction<any>): void;
    dispatch<T>(elements: DiagramNode[], action: string, payload: T): void;

    onSelect?: (elements: DiagramNode[]) => void;
}

export const InteractionContext = createContext<InteractionControllerType | undefined>(undefined);

export interface MovementActionPayload {
    position: DOMPointReadOnly;
    deltaX: number;
    deltaY: number;
    hitArea: HitArea;
}

export class InteractionController implements InteractionControllerType {
    private controls: DiagramElementControls[] = [];
    private hitAreas: HitAreaCollection = {};
    private actions = new Map<DiagramNode, DiagramElementAction<any>[]>();
    private selectedElements = new Set<DiagramNode>();
    private dragging = false;
    elements: DiagramElementNode[] = [];

    constructor(private svg: SVGGraphicsElement, private transform?: DOMMatrixReadOnly) {}

    updateTransform(transform?: DOMMatrixReadOnly) {
        this.transform = transform;
        this.svg.onpointerdown = (e) => this.mouseDownHandler(e);
        this.svg.onpointermove = (e) => this.mouseMoveHandler(e);
    }

    private mouseDownHandler(e: PointerEvent) {
        if (this.dragging) return;

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
                    this.selectedElements = new Set([hitInfo.element]);
                    this.svg.style.cursor = hitInfo.hitArea.cursor || "";
                    this.onSelect?.([...this.selectedElements]);
                }
                else {
                    this.beginDrag(e, hitInfo);
                }
            }
        }
        else {
            this.selectedElements.clear();
            this.svg.style.cursor = "";
            this.onSelect?.([...this.selectedElements]);
        }
    }

    private mouseMoveHandler(e: PointerEvent) {
        if (!this.dragging) {
            const hitInfo = this.hitTest(e);
            const isSelected = hitInfo && this.selectedElements.has(hitInfo.element);

            this.svg.style.cursor = isSelected ? hitInfo?.hitArea.cursor || "" : "";
        }
    }

    private beginDrag(e: PointerEvent, hitInfo: HitInfo) {
        this.dragging = true;
        this.svg.style.cursor = hitInfo.hitArea.cursor || "";
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
                this.dragging = false;
                this.svg.style.cursor = "";
                this.svg.releasePointerCapture(e.pointerId);

                this.svg.removeEventListener("pointermove", mouseMoveHandler);
                this.svg.removeEventListener("pointerup", mouseUpHandler);
            }

            this.svg.addEventListener("pointermove", mouseMoveHandler);
            this.svg.addEventListener("pointerup", mouseUpHandler);
        }
    }

    isSelected(element: DiagramNode) {
        return this.selectedElements.has(element);
    }

    updateControls(newControls?: DiagramElementControls, prevControls?: DiagramElementControls) {
        let newValue = prevControls ? this.controls.filter(x => x !== prevControls) : this.controls;
        newValue = newControls ? newValue.concat(newControls) : newValue;
        this.controls = newValue;
    }

    renderControls(transform: DOMMatrixReadOnly): JSX.Element {
        return this.controls.map(x => x.callback(transform, x.element));
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
                map = new Map<DiagramNode, DiagramElementHitTest[]>();
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

    dispatch<T>(elements: DiagramNode[], action: string, payload: T) {
        elements.forEach(element => {
            const callbacks = this.actions.get(element)
                ?.filter(x => x.action === action)
                ?.map(x => x.callback);
            if (callbacks) {
                callbacks.forEach(cb => cb(payload));
            }
        });
    }

    onSelect?: (elements: DiagramNode[]) => void;
}