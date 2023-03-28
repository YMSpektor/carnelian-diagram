/** @jsxImportSource @emotion/react */
import { HTMLAttributes, useContext, useLayoutEffect, useRef } from "react";
import { Diagram } from "carnelian-diagram";
import { InteractionController } from "carnelian-diagram/interaction";
import { DragDropContext } from "../context/DragDropContext";

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

    unit = unit || "px";
    unitMultiplier = unitMultiplier || 1;
    const width = `${diagramSize.width * (scale / 100) * unitMultiplier}${unit}`;
    const height = `${diagramSize.height * (scale / 100) * unitMultiplier}${unit}`;

    useLayoutEffect(() => {
        if (root.current && container.current && !diagram.isAttached()) {
            diagram.attach(root.current);
            controller?.attach(diagram, container.current);

            return () => {
                diagram.detach();
                controller?.detach();
            }
        }
    }, [diagram, controller]);

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
            const point = controller.clientToDiagram(new DOMPoint(e.clientX, e.clientY));
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
                <svg xmlns="http://www.w3.org/2000/svg"
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
                </svg>
            </div>
        </div>
    );
};

export default DiagramViewer;