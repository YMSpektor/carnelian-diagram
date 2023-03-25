/** @jsxImportSource @emotion/react */
import { useLayoutEffect, useRef } from "react";
import { Diagram } from "carnelian-diagram";

const containerStyles = {
    overflow: "auto",
    display: "flex"
};

const svgStyles = {
    margin: "auto",
    flex: "0 0 auto",
    overflow: "hidden"
}

interface DiagramViewerProps {
    diagram: Diagram;
    diagramSize: {width: number, height: number};
    scale: number;
    unit?: string;
    unitMultiplier?: number;
}

function DiagramViewer(props: DiagramViewerProps) {
    const container = useRef<HTMLDivElement>(null);
    const root = useRef<SVGSVGElement>(null);

    const unit = props.unit || "px";
    const unitMultiplier = props.unitMultiplier || 1;
    const width = `${props.diagramSize.width * (props.scale / 100) * unitMultiplier}${unit}`;
    const height = `${props.diagramSize.height * (props.scale / 100) * unitMultiplier}${unit}`;

    useLayoutEffect(() => {
        root.current && props.diagram.attach(root.current);

        return () => {
            props.diagram.detach();
        }
    }, [props.diagram]);

    return (
        <div ref={container} css={containerStyles}>
                <svg xmlns="http://www.w3.org/2000/svg"
                    viewBox={[0, 0, props.diagramSize.width, props.diagramSize.height].join(' ')} 
                    style={{width, height}} css={svgStyles}
                    ref={root}>
                </svg>
        </div>
    );
}

export default DiagramViewer;