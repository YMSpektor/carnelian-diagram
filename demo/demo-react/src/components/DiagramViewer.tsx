/** @jsxImportSource @emotion/react */
import { HTMLAttributes, useContext, useLayoutEffect, useRef, useState } from "react";
import { Diagram, DiagramRoot } from "@carnelian/diagram";
import { InteractionController, withInteractiveRoot } from "@carnelian/interaction";
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
    const [diagramRoot, setDiagramRoot] = useState<Diagram.Root | null>(null);

    unit = unit || "px";
    unitMultiplier = unitMultiplier || 1;
    const width = `${diagramSize.width * (scale / 100) * unitMultiplier}${unit}`;
    const height = `${diagramSize.height * (scale / 100) * unitMultiplier}${unit}`;

    useLayoutEffect(() => {
        const rootComponent = controller 
            ? withInteractiveRoot(DiagramRoot, controller, {"stroke-width": 2.5})
            : DiagramRoot;
            
        if (root.current && container.current) {
            const diagramRoot = diagram.createRoot(root.current, rootComponent);
            setDiagramRoot(diagramRoot);
            diagramRoot.attach();
            controller?.attach(diagram, container.current);

            return () => {
                diagramRoot.detach(true);
                controller?.detach();
            }
        }
    }, [diagram, controller]);

    useLayoutEffect(() => {
        // Render synchronously to avoid diagram control glitches when scale is changed
        diagramRoot?.render(true);
    }, [diagramRoot, scale]);

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
            const point = controller.clientToDiagram(new DOMPoint(e.nativeEvent.offsetX, e.nativeEvent.offsetY));
            const props = draggedElement.factory(point, draggedElement.elementProps);
            const element = diagram.add(draggedElement.elementType, props);
            controller.select(element);

            container.current?.focus();
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
                <DiagramSvg
                    viewBox={[0, 0, diagramSize.width, diagramSize.height].join(' ')}
                    {...{width, height}}
                    css={{flex: "1 0 auto", margin: "auto", overflow: "visible"}}
                >
                    <g>
                        <rect 
                            x={0} y={0} width={diagramSize.width} height={diagramSize.height}
                            css={{fill: "white", stroke: "black"}}
                        />
                    </g>
                    <g ref={root} />
                </DiagramSvg>
            </div>
        </div>
    );
};

export default DiagramViewer;