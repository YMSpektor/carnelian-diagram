import { Diagram } from "@carnelian-diagram/core";
import { GridSnappingService, InteractionServive, isGridSnappingService, setElementCursor } from ".";
import { ACT_MOVE, ClickActionPayload, DragActionPayload } from "../actions";
import { HitInfo } from "../hit-tests";
import { InteractionController } from "../interaction-controller";

export interface ElementInteractionService extends InteractionServive {
    type: "element_interaction_service";
}

export function isElementInteractionService(service: InteractionServive): service is ElementInteractionService {
    return service.type === "element_interaction_service";
}

export class DefaultElementInteractionService implements ElementInteractionService {
    private dragging = false;
    private gridSnappingService?: GridSnappingService;
    type: "element_interaction_service" = "element_interaction_service";
    deactivate?: () => void;

    constructor(private controller: InteractionController) {}
    
    activate(diagram: Diagram, root: HTMLElement) {
        this.gridSnappingService = this.controller.getService(isGridSnappingService);

        const mouseDownHandler = (e: PointerEvent) => this.mouseDownHandler(root, e);
        const mouseMoveHandler = (e: PointerEvent) => this.mouseMoveHandler(root, e);
        const dblClickHandler = (e: MouseEvent) => this.dblClickHandler(root, e);
        root.addEventListener("pointerdown", mouseDownHandler);
        root.addEventListener("pointermove", mouseMoveHandler);
        root.addEventListener("dblclick", dblClickHandler);

        this.deactivate = () => {
            this.deactivate = undefined;
            root.removeEventListener("pointerdown", mouseDownHandler);
            root.removeEventListener("pointermove", mouseMoveHandler);
            root.removeEventListener("dblclick", dblClickHandler);
        }
    }

    private beginDrag(root: HTMLElement, e: PointerEvent, hitInfo: HitInfo) {
        this.dragging = true;
        const targetElement = e.target as HTMLElement;
        targetElement.setPointerCapture(e.pointerId);  // Set capture to target element to receive dblclick events for this target
        this.controller.setInputCapture(this);

        let lastPoint = new DOMPoint(e.clientX, e.clientY);
        const action = hitInfo.hitArea.action;

        if (action) {
            const mouseMoveHandler = (e: PointerEvent) => {
                const point = new DOMPoint(e.clientX, e.clientY);
                const snapGridSize = !e.altKey && this.gridSnappingService ? this.gridSnappingService.snapGridSize : null;
                const diagramPoint = this.controller.clientToDiagram(point);
                const snappedDiagramPoint = this.gridSnappingService?.snapToGrid(diagramPoint, snapGridSize) || diagramPoint;
                const lastDiagramPoint = this.controller.clientToDiagram(lastPoint);
                const elements = action === ACT_MOVE ? this.controller.getSelectedElements() : [hitInfo.element];
                
                elements.forEach(element => {
                    const lastElementPoint = this.controller.clientToDiagram(lastPoint, element);
                    const elementPoint = this.controller.clientToDiagram(point, element);
                    const snappedElementPoint = this.gridSnappingService?.snapToGrid(elementPoint, snapGridSize) || elementPoint;
                    const rawDeltaX = elementPoint.x - lastElementPoint.x;
                    const rawDeltaY = elementPoint.y - lastElementPoint.y;
                    let deltaX = rawDeltaX;
                    let deltaY = rawDeltaY;
                    if (this.gridSnappingService) {
                        const dx = this.gridSnappingService.snapToGrid(snappedDiagramPoint.x - lastDiagramPoint.x, snapGridSize);
                        const dy = this.gridSnappingService.snapToGrid(snappedDiagramPoint.y - lastDiagramPoint.y, snapGridSize);
                        const deltaPoint = this.controller.diagramToElement(new DOMPoint(lastDiagramPoint.x + dx, lastDiagramPoint.y + dy), element);
                        deltaX = deltaPoint.x - lastElementPoint.x;
                        deltaY = deltaPoint.y - lastElementPoint.y;
                    }

                    this.controller.dispatchAction<DragActionPayload>(
                        [element],
                        action,
                        {
                            controller: this.controller,
                            position: snappedElementPoint,
                            deltaX,
                            deltaY,
                            rawPosition: elementPoint,
                            rawDeltaX,
                            rawDeltaY,
                            hitArea: hitInfo.hitArea,
                            snapGridSize,
                            snapAngle: !e.altKey && this.gridSnappingService ? this.gridSnappingService.snapAngle : null,
                            snapToGrid: this.gridSnappingService?.snapToGrid.bind(this.gridSnappingService)
                        });
                });

                lastPoint = point;
            }

            const mouseUpHandler = (e: PointerEvent) => {
                this.dragging = false;
                targetElement.releasePointerCapture(e.pointerId);
                this.controller.releaseInputCapture(root, this);

                targetElement.removeEventListener("pointermove", mouseMoveHandler);
                targetElement.removeEventListener("pointerup", mouseUpHandler);
            }

            targetElement.addEventListener("pointermove", mouseMoveHandler);
            targetElement.addEventListener("pointerup", mouseUpHandler);
        }
    }

    private mouseDownHandler(root: HTMLElement, e: PointerEvent) {
        if (e.button === 0) {
            const hitInfo = this.controller.hitTest(e);
            const isSelected = hitInfo && this.controller.isSelected(hitInfo.element);
            if (hitInfo && isSelected) {
                setElementCursor(root, hitInfo.hitArea.cursor);
                this.beginDrag(root, e, hitInfo);
            }
        }
    }

    private mouseMoveHandler(root: HTMLElement, e: PointerEvent) {
        if (!this.dragging) {
            const hitInfo = this.controller.hitTest(e);
            const isSelected = hitInfo && this.controller.isSelected(hitInfo.element);
            setElementCursor(root, isSelected ? hitInfo?.hitArea.cursor : null);
        }
    }

    private dblClickHandler(root: HTMLElement, e: MouseEvent) {
        if (e.button === 0) {
            const hitInfo = this.controller.hitTest(e);
            if (hitInfo && hitInfo.hitArea.dblClickAction) {
                const point = new DOMPoint(e.clientX, e.clientY);
                const snapGridSize = !e.altKey && this.gridSnappingService ? this.gridSnappingService.snapGridSize : null;
                const elementPoint = this.controller.clientToDiagram(point, hitInfo.element);
                const snappedElementPoint = this.gridSnappingService?.snapToGrid(elementPoint, snapGridSize) || elementPoint;

                this.controller.dispatchAction<ClickActionPayload>(
                    [hitInfo.element],
                    hitInfo.hitArea.dblClickAction,
                    {
                        controller: this.controller,
                        position: snappedElementPoint,
                        rawPosition: elementPoint,
                        hitArea: hitInfo.hitArea,
                        snapGridSize,
                        snapAngle: !e.altKey && this.gridSnappingService ? this.gridSnappingService.snapAngle : null,
                        snapToGrid: this.gridSnappingService?.snapToGrid.bind(this.gridSnappingService)
                    });
            }
        }
    }
}