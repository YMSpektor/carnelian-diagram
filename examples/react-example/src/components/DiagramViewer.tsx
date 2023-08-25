/** @jsxImportSource @emotion/react */
import { HTMLAttributes, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Diagram, DiagramDOM, DiagramRoot, DiagramRootRenderer } from "@carnelian-diagram/core";
import { InteractionController, isGridSnappingService, isPaperService, withInteractivity } from "@carnelian-diagram/interactivity";
import { DragDropContext } from "../context/DragDropContext";
import DiagramSvg from "./DiagramSvg";

interface DiagramViewerProps {
    diagram: Diagram;
    controller?: InteractionController;
    diagramSize: {width: number, height: number};
    scale: number;
    unit?: string;
    unitMultiplier?: number;
}

function DiagramViewer(props: DiagramViewerProps & HTMLAttributes<HTMLDivElement>) {
    let {diagram, controller, diagramSize, scale, unit, unitMultiplier, ...divProps} = props;
    const root = useRef<SVGSVGElement>(null);
    const container = useRef<HTMLDivElement>(null);
    const dragDropContext = useContext(DragDropContext);
    const [diagramRoot, setDiagramRoot] = useState<DiagramRootRenderer | null>(null);

    unit = unit || "px";
    unitMultiplier = unitMultiplier || 1;
    const width = `${diagramSize.width * (scale / 100) * unitMultiplier}${unit}`;
    const height = `${diagramSize.height * (scale / 100) * unitMultiplier}${unit}`;

    useLayoutEffect(() => {
        const rootComponent = controller 
            ? withInteractivity(DiagramRoot, controller, { elementsRootProps: { "stroke-width": 2.5 } })
            : DiagramRoot;
            
        if (root.current && container.current) {
            const diagramRoot = DiagramDOM.createRoot(diagram, root.current, rootComponent);
            setDiagramRoot(diagramRoot);
            diagramRoot.attach();
            controller?.attach(container.current);

            return () => {
                diagramRoot.detach(true);
                controller?.detach();
            }
        }
    }, [diagram, controller]);

    useLayoutEffect(() => {
        // Render synchronously to avoid diagram control glitches when scale is changed
        diagramRoot?.isAttached() && diagramRoot.render(true);
    }, [diagramRoot, scale]);

    useEffect(() => {
        if (controller) {
            const service = controller.getService(isPaperService);
            service && (service.paper = {
                ...service.paper,
                x: service.paper?.x || 0,
                y: service.paper?.y || 0,
                width: diagramSize.width,
                height: diagramSize.height
            });
        }
    }, [controller, diagramSize.width, diagramSize.height]);

    function dragOverHandler(e: React.DragEvent) {
        if (controller && dragDropContext.draggedElement) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
        }
    }

    function dropHandler(e: React.DragEvent) {
        if (controller && dragDropContext.draggedElement) {
            e.preventDefault();
            
            const draggedElement = dragDropContext.draggedElement;
            const service = controller.getService(isGridSnappingService);
            let point = controller.clientToDiagram(new DOMPoint(e.clientX, e.clientY));
            point = service ? service.snapToGrid(point) : point;
            const props = draggedElement.factory(point, draggedElement.elementProps);
            const element = diagram.add(draggedElement.elementType, props);
            controller.select(element);

            container.current?.focus({preventScroll: true});
        }
    }

    return (
        <div css={{display: "flex", overflow: "auto"}} {...divProps}>
            <div 
                ref={container} 
                css={{display: "flex", flex: "1 0 auto", minHeight: "100%"}}
                onDragOver={dragOverHandler}
                onDrop={dropHandler}
            >
                <DiagramSvg ref={root}
                    viewBox={[0, 0, diagramSize.width, diagramSize.height].join(' ')}
                    {...{width, height}}
                    css={{flex: "1 0 auto", margin: "auto", overflow: "visible"}}
                />
            </div>
        </div>
    );
};

export default DiagramViewer;