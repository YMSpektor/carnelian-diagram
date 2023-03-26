/** @jsxImportSource @emotion/react */
import { forwardRef, HTMLAttributes, useLayoutEffect, useRef } from "react";
import { Diagram } from "carnelian-diagram";

interface DiagramViewerProps {
    diagram: Diagram | null;
    diagramSize: {width: number, height: number};
    scale: number;
    unit?: string;
    unitMultiplier?: number;
}

const DiagramViewer = forwardRef<HTMLDivElement, DiagramViewerProps & HTMLAttributes<HTMLDivElement>>(function(props, ref) {
    let {diagram, diagramSize, scale, unit, unitMultiplier, ...divProps} = props;
    const root = useRef<SVGSVGElement>(null);

    unit = unit || "px";
    unitMultiplier = unitMultiplier || 1;
    const width = `${diagramSize.width * (scale / 100) * unitMultiplier}${unit}`;
    const height = `${diagramSize.height * (scale / 100) * unitMultiplier}${unit}`;

    useLayoutEffect(() => {
        if (root.current && diagram && !diagram.isAttached()) {
            diagram.attach(root.current);

            return () => {
                diagram?.detach();
            }
        }
    }, [diagram]);

    return (
        <div ref={ref} css={{display: "flex", overflow: "auto"}} {...divProps}>
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
    );
});

export default DiagramViewer;