/** @jsxImportSource @emotion/react */
import { HTMLAttributes, useLayoutEffect, useRef } from "react";
import { Diagram } from "carnelian-diagram";

interface DiagramViewerProps {
    diagram: Diagram;
    diagramSize: {width: number, height: number};
    scale: number;
    unit?: string;
    unitMultiplier?: number;
}

function DiagramViewer(props: DiagramViewerProps & HTMLAttributes<HTMLDivElement>) {
    let {diagram, diagramSize, scale, unit, unitMultiplier, ...divProps} = props;
    const container = useRef<HTMLDivElement>(null);
    const root = useRef<SVGSVGElement>(null);

    unit = unit || "px";
    unitMultiplier = unitMultiplier || 1;
    const width = `${diagramSize.width * (scale / 100) * unitMultiplier}${unit}`;
    const height = `${diagramSize.height * (scale / 100) * unitMultiplier}${unit}`;

    useLayoutEffect(() => {
        root.current && diagram.attach(root.current);

        return () => {
            diagram.detach();
        }
    }, [diagram]);

    return (
        <div ref={container} css={{display: "flex", overflow: "auto"}} {...divProps}>
            <svg xmlns="http://www.w3.org/2000/svg"
                viewBox={[0, 0, diagramSize.width, diagramSize.height].join(' ')}
                style={{width, height}} css={{flex: "1 0 auto"}}
                ref={root}>
            </svg>
        </div>
    );
}

export default DiagramViewer;