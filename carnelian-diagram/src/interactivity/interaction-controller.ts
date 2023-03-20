import { createContext, DiagramNode, renderContext } from "..";
import { DiagramElementHitTest, hasHitTestProps, HitAreaCollection, HitInfo } from "./hit-tests";

export type RenderControlsCallback = (transform: DOMMatrixReadOnly, element: DiagramNode) => JSX.Element;

export interface DiagramElementControls {
    element: DiagramNode;
    callback: RenderControlsCallback;
}

export type BehaviourCallback<T> = (payload: T) => void;

export interface DiagramElementBehaviour<T> {
    action: string;
    element: DiagramNode;
    callback: BehaviourCallback<T>;
}

export interface BehaviourCollection {
    [action: string]: DiagramElementBehaviour<any>[];
}

export interface InteractionControllerType {
    init(transform?: DOMMatrixReadOnly): void;
    isSelected(element: DiagramNode): boolean;
    updateControls(controls?: DiagramElementControls, prevControls?: DiagramElementControls): void;
    renderControls(transform: DOMMatrixReadOnly): JSX.Element;
    updateHitTests(hitTests?: DiagramElementHitTest, prevHitTests?: DiagramElementHitTest): void;
    hitTest(e: MouseEvent): HitInfo<unknown> | undefined;
    updateBehaviours(behaviour?: DiagramElementBehaviour<any>, prevBehaviour?: DiagramElementBehaviour<any>): void;
    dispatch<T>(elements: DiagramNode[], action: string, payload: T): void;

    onSelect?: (elements: DiagramNode[]) => void;
}

export const InteractionContext = createContext<InteractionControllerType | undefined>(undefined);

export interface MovementActionPayload {
    position: DOMPointReadOnly;
    deltaX: number;
    deltaY: number;
}

export class InteractionController implements InteractionControllerType {
    private controls: DiagramElementControls[] = [];
    private hitAreas: HitAreaCollection = {};
    private behaviours: BehaviourCollection = {};
    private selectedElements = new Set<DiagramNode>();
    private transform?: DOMMatrixReadOnly;

    constructor(private svg: SVGGraphicsElement) {}

    init(transform?: DOMMatrixReadOnly) {
        this.transform = transform;
        this.svg.onmousedown = (e) => this.mouseDownHandler(e);
        this.svg.onmousemove = (e) => this.mouseMoveHandler(e);
    }

    private mouseDownHandler(e: MouseEvent) {
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

    private mouseMoveHandler(e: MouseEvent) {
        const hitInfo = this.hitTest(e);
        const isSelected = hitInfo && this.selectedElements.has(hitInfo.element);

        this.svg.style.cursor = isSelected ? hitInfo?.hitArea.cursor || "" : "";
    }

    private beginDrag<P>(e: MouseEvent, hitInfo: HitInfo<P>) {
        const startPoint = new DOMPoint(e.clientX, e.clientY).matrixTransform(this.transform);
        let lastPoint = startPoint;

        if (hitInfo.hitArea.onDrag) {
            const dragHandler = hitInfo.hitArea.onDrag;

            const mouseMoveHandler = (e: MouseEvent) => {
                const point = new DOMPoint(e.clientX, e.clientY);
                const elementPoint = point.matrixTransform(this.transform);

                dragHandler(elementPoint, lastPoint, startPoint, (props) => {
                    renderContext.effects.push(() => {
                        hitInfo.element.props = props;
                        renderContext.currentDiagram?.invalidate();
                    });
                });

                this.dispatch<MovementActionPayload>(
                    [hitInfo.element],
                    hitInfo.hitArea.action,
                    {
                        position: elementPoint,
                        deltaX: elementPoint.x - startPoint.x,
                        deltaY: elementPoint.y - startPoint.y
                    });

                lastPoint = elementPoint;
            }

            const mouseUpHandler = (e: MouseEvent) => {
                window.removeEventListener("mousemove", mouseMoveHandler);
                window.removeEventListener("mouseup", mouseUpHandler);
            }

            window.addEventListener("mousemove", mouseMoveHandler);
            window.addEventListener("mouseup", mouseUpHandler);
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
            this.hitAreas[prevHitTests.priority] = this.hitAreas[prevHitTests.priority].filter(x => x !== prevHitTests);
        }
        if (newHitTests) {
            this.hitAreas[newHitTests.priority] = (this.hitAreas[newHitTests.priority] || []).concat(newHitTests);
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
                for (let priority of priorities) {
                    const hit = this.hitAreas[priority].find(x => x.callback(point, transform));
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

    updateBehaviours(newBehaviour?: DiagramElementBehaviour<any>, prevBehaviour?: DiagramElementBehaviour<any>) {
        if (prevBehaviour) {
            this.behaviours[prevBehaviour.action] = this.behaviours[prevBehaviour.action].filter(x => x !== prevBehaviour);
        }
        if (newBehaviour) {
            this.behaviours[newBehaviour.action] = (this.behaviours[newBehaviour.action] || []).concat(newBehaviour);
        }
    }

    dispatch<T>(elements: DiagramNode[], action: string, payload: T) {
        elements.forEach(element => {
            const callbacks = this.behaviours[action]
                ?.filter(x => x.element === element)
                ?.map(x => x.callback);
            if (callbacks) {
                callbacks.forEach(cb => cb(payload));
            }
        });
    }

    onSelect?: (elements: DiagramNode[]) => void;
}