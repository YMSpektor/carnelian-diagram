import { Diagram, DiagramElementNode } from "@carnelian/diagram";
import { MutableRefObject } from "@carnelian/diagram/utils/types";
import { GridSnappingService, InteractionServive, isGridSnappingService, setElementCursor } from ".";
import { ACT_DRAW_POINT_PLACE_Payload, ACT_DRAW_POINT_PLACE, ACT_DRAW_POINT_MOVE_Payload, ACT_DRAW_POINT_MOVE, ACT_DRAW_POINT_CANCEL_Payload, ACT_DRAW_POINT_CANCEL } from "../actions";
import { InteractionController } from "../interaction-controller";

export interface ElementDrawingService extends InteractionServive {
    type: "element_drawing_service";
    switchDrawingMode(elementFactory: DrawingModeElementFactory | null): void;
}

export function isElementDrawingService(service: InteractionServive): service is ElementDrawingService {
    return service.type === "element_drawing_service";
}

export type DrawingModeElementFactory = (diagram: Diagram, x: number, y: number) => DiagramElementNode;

export class DefaultElementDrawingService implements ElementDrawingService {
    private drawing = false;
    private diagram?: Diagram;
    private root?: HTMLElement;
    private gridSnappingService?: GridSnappingService;
    type: "element_drawing_service" = "element_drawing_service";
    release?: () => void;

    constructor(private controller: InteractionController, private drawingModeFactory: DrawingModeElementFactory | null = null) {}
    
    init(diagram: Diagram, root: HTMLElement) {
        this.diagram = diagram;
        this.root = root;
        this.gridSnappingService = this.controller.getService(isGridSnappingService);
        this.updateControllerInputCapture();

        const mouseDownHandler = (e: PointerEvent) => this.mouseDownHandler(root, e);
        root.addEventListener("pointerdown", mouseDownHandler);

        this.release = () => {
            this.release = undefined;
            root.removeEventListener("pointerdown", mouseDownHandler);
        }
    }

    private updateControllerInputCapture() {
        if (this.diagram && this.root) {
            if (this.drawingModeFactory) {
                this.controller.setInputCapture(this);
                setElementCursor(this.root, "copy");
            }
            else {
                this.controller.releaseInputCapture(this.root, this);
                setElementCursor(this.root, null);
            }
        }
    }

    switchDrawingMode(elementFactory: DrawingModeElementFactory | null) {
        this.drawingModeFactory = elementFactory;
        this.updateControllerInputCapture();
    }

    private beginDraw(root: HTMLElement, e: PointerEvent, diagram: Diagram, factory: DrawingModeElementFactory) {
        this.drawing = true;
        root.setPointerCapture(e.pointerId);

        const point = new DOMPoint(e.clientX, e.clientY);
        const snapGridSize = !e.altKey && this.gridSnappingService ? this.gridSnappingService.snapGridSize : null;
        const elementPoint = this.controller.clientToDiagram(point);
        const snappedElementPoint = this.gridSnappingService?.snapToGrid(elementPoint, snapGridSize) || elementPoint;
        const element = factory(diagram, snappedElementPoint.x, snappedElementPoint.y);
        this.controller.select(element);

        const endDraw = (element: DiagramElementNode, result: boolean) => {
            this.drawing = false;
            root.releasePointerCapture(e.pointerId);
            
            if (!result) {
                this.diagram?.delete(element);
                setElementCursor(root, null);
            }
            
            root.removeEventListener("pointermove", mouseMoveHandler);
            root.removeEventListener("pointerdown", mouseDownHandler);
            root.removeEventListener("keydown", keyDownHandler);
            
            this.controller.onDrawElement.emit({ element, result });
        }

        let pointIndex = 0;
        const result: MutableRefObject<boolean> = { current: false };
        const drawPoint = (e: PointerEvent) => {
            const point = new DOMPoint(e.clientX, e.clientY);
            const snapGridSize = !e.altKey && this.gridSnappingService ? this.gridSnappingService.snapGridSize : null;
            const elementPoint = this.controller.clientToDiagram(point);
            const snappedElementPoint = this.gridSnappingService?.snapToGrid(elementPoint, snapGridSize) || elementPoint;

            this.controller.dispatch<ACT_DRAW_POINT_PLACE_Payload>([element], ACT_DRAW_POINT_PLACE, {
                position: snappedElementPoint,
                rawPosition: elementPoint,
                snapGridSize,
                snapAngle: !e.altKey && this.gridSnappingService ? this.gridSnappingService.snapAngle : null,
                snapToGrid: this.gridSnappingService?.snapToGrid.bind(this.gridSnappingService),
                pointIndex,
                result
            });
            pointIndex++;

            if (result.current) {
                endDraw(element, true);
            }
        }

        const mouseMoveHandler = (e: PointerEvent) => {
            const point = new DOMPoint(e.clientX, e.clientY);
            const snapGridSize = !e.altKey && this.gridSnappingService ? this.gridSnappingService.snapGridSize : null;
            const elementPoint = this.controller.clientToDiagram(point);
            const snappedElementPoint = this.gridSnappingService?.snapToGrid(elementPoint, snapGridSize) || elementPoint;

            this.controller.dispatch<ACT_DRAW_POINT_MOVE_Payload>([element], ACT_DRAW_POINT_MOVE, {
                position: snappedElementPoint,
                rawPosition: elementPoint,
                snapGridSize,
                snapAngle: !e.altKey && this.gridSnappingService ? this.gridSnappingService.snapAngle : null,
                snapToGrid: this.gridSnappingService?.snapToGrid.bind(this.gridSnappingService),
                pointIndex
            });
        }

        const mouseDownHandler = (e: PointerEvent) => {
            if (e.button === 0) {
                drawPoint(e);
            }
            else if (e.button === 2) {
                const result: MutableRefObject<boolean> = { current: true };
                this.controller.dispatch<ACT_DRAW_POINT_CANCEL_Payload>([element], ACT_DRAW_POINT_CANCEL, { pointIndex, result });
                endDraw(element, result.current);
            }            
        }

        const keyDownHandler = (e: KeyboardEvent) => {
            // Firefox 36 and earlier uses "Esc" instead of "Escape" for the Esc key
            // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
            if (e.key === "Escape" || e.key === "Esc") {
                const result: MutableRefObject<boolean> = { current: true };
                this.controller.dispatch<ACT_DRAW_POINT_CANCEL_Payload>([element], ACT_DRAW_POINT_CANCEL, { pointIndex, result });
                endDraw(element, result.current);
            }
        }

        root.addEventListener("pointermove", mouseMoveHandler);
        root.addEventListener("pointerdown", mouseDownHandler);
        root.addEventListener("keydown", keyDownHandler);

        drawPoint(e);
    }

    private mouseDownHandler(root: HTMLElement, e: PointerEvent) {
        if (e.button === 0 && this.drawingModeFactory && this.diagram && !this.drawing) {
            this.beginDraw(root, e, this.diagram, this.drawingModeFactory);
        }
    }
}