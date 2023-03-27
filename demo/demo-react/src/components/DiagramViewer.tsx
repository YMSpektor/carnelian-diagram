/** @jsxImportSource @emotion/react */
import { HTMLAttributes, useLayoutEffect, useRef } from "react";
import { Diagram } from "carnelian-diagram";
import { InteractionController } from "carnelian-diagram/interaction";

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

    unit = unit || "px";
    unitMultiplier = unitMultiplier || 1;
    const width = `${diagramSize.width * (scale / 100) * unitMultiplier}${unit}`;
    const height = `${diagramSize.height * (scale / 100) * unitMultiplier}${unit}`;

    useLayoutEffect(() => {
        if (root.current && container.current && !diagram.isAttached()) {
            diagram.attach(root.current);
            controller?.attach(container.current);

            return () => {
                diagram.detach();
                controller?.detach();
            }
        }
    }, [diagram, controller]);

    return (
        <div css={{display: "flex", overflow: "auto"}} {...divProps}>
            <div ref={container} css={{display: "flex", flex: "1 0 auto", minHeight: "100%"}}>
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