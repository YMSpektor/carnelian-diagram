import { Diagram } from "@carnelian-diagram/core";
import { InteractionServive } from ".";
import { Rect } from "../geometry";
import { InteractionController } from "../interaction-controller";

export interface SelectionService extends InteractionServive {
    type: "selection_service";
}

export function isSelectionService(service: InteractionServive): service is SelectionService {
    return service.type === "selection_service";
}

export const RECT_SELECTION_EVENT = "rect_selection";
export interface RectSelectionEventArgs {
    selectionRect: Rect | null;
}

export class DefaultSelectionService implements SelectionService {
    type: "selection_service" = "selection_service";
    deactivate?: () => void;

    constructor(private controller: InteractionController) {}
    
    activate(diagram: Diagram, root: HTMLElement) {
        const mouseDownHandler = (e: PointerEvent) => this.mouseDownHandler(root, e);
        root.addEventListener("pointerdown", mouseDownHandler);

        this.deactivate = () => {
            this.deactivate = undefined;
            root.removeEventListener("pointerdown", mouseDownHandler);
        }
    }

    private beginSelect(root: HTMLElement, e: PointerEvent) {
        root.setPointerCapture(e.pointerId);
        this.controller.setInputCapture(this);

        const startPoint = this.controller.clientToDiagram(new DOMPoint(e.clientX, e.clientY));

        const mouseMoveHandler = (e: PointerEvent) => {
            const point = this.controller.clientToDiagram(new DOMPoint(e.clientX, e.clientY));

            const selectionRect = {
                x: Math.min(startPoint.x, point.x),
                y: Math.min(startPoint.y, point.y),
                width: Math.max(startPoint.x, point.x) - Math.min(startPoint.x, point.x),
                height: Math.max(startPoint.y, point.y) - Math.min(startPoint.y, point.y),
            };

            this.controller.dispatchEvent<RectSelectionEventArgs>(RECT_SELECTION_EVENT, {selectionRect});
        }

        const mouseUpHandler = (e: PointerEvent) => {
            this.controller.dispatchEvent<RectSelectionEventArgs>(RECT_SELECTION_EVENT, {selectionRect: null});
            const point = this.controller.clientToDiagram(new DOMPoint(e.clientX, e.clientY));

            if (startPoint.x !== point.x || startPoint.y !== point.y) {
                const selectionRect = {
                    x: Math.min(startPoint.x, point.x),
                    y: Math.min(startPoint.y, point.y),
                    width: Math.max(startPoint.x, point.x) - Math.min(startPoint.x, point.x),
                    height: Math.max(startPoint.y, point.y) - Math.min(startPoint.y, point.y),
                };

                this.controller.select(this.controller.rectIntersectionTest(selectionRect));
            }

            root.releasePointerCapture(e.pointerId);
            this.controller.releaseInputCapture(root, this);

            root.removeEventListener("pointermove", mouseMoveHandler);
            root.removeEventListener("pointerup", mouseUpHandler);
        }

        root.addEventListener("pointermove", mouseMoveHandler);
        root.addEventListener("pointerup", mouseUpHandler);
    }

    private mouseDownHandler(root: HTMLElement, e: PointerEvent) {
        if (e.button === 0) {
            const hitInfo = this.controller.hitTest(e);
            if (hitInfo) {
                const isSelected = this.controller.isSelected(hitInfo.element);
                if (e.shiftKey) {
                    if (isSelected) {
                        this.controller.select(this.controller.getSelectedElements().filter(x => x !== hitInfo.element));
                    }
                    else {
                        this.controller.select(this.controller.getSelectedElements().concat(hitInfo.element));
                    }
                }
                else {
                    if (!isSelected) {
                        this.controller.select(hitInfo.element);
                    }
                }
            }
            else {
                if (this.controller.getSelectedElements().length) {
                    this.controller.select([]);
                }
                this.beginSelect(root, e);
            }
        }
    }
}