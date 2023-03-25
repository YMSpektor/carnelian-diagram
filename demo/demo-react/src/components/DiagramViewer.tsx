import { useLayoutEffect, useRef } from "react";
import { Diagram } from "carnelian-diagram";

interface DiagramViewerProps {
    diagram: Diagram;
    diagramSize: {width: number, height: number};
}

function DiagramViewer(props: DiagramViewerProps) {
    const root = useRef<SVGSVGElement>(null);

    useLayoutEffect(() => {
        root.current && props.diagram.attach(root.current);

        return () => {
            props.diagram.detach();
        }
    }, [props.diagram]);

    return (
        <svg xmlns="http://www.w3.org/2000/svg"
                viewBox={[0, 0, props.diagramSize.width, props.diagramSize.height].join(' ')}  
                ref={root}>
        </svg>
    );
}

export default DiagramViewer;