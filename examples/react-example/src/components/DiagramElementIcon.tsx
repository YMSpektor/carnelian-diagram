import { SVGAttributes, useLayoutEffect, useRef, useState } from "react";
import { Diagram, DiagramDOM, DiagramElement, DiagramRoot } from "@carnelian-diagram/core";
import DiagramSvg from "./DiagramSvg";

interface DiagramElementIconProps<T extends object> {
    elementType: DiagramElement<T>;
    elementProps: T;
}

function DiagramElementIcon<T extends object>(props: DiagramElementIconProps<T> & SVGAttributes<SVGSVGElement>) {
    const {elementType, elementProps, ...svgProps} = props;
    const [diagram] = useState(createDiagram());
    const svg = useRef<SVGSVGElement>(null);

    function createDiagram() {
        const diagram = new Diagram();
        diagram.add(props.elementType, props.elementProps);
        return diagram;
    }
    
    useLayoutEffect(() => {
        if (svg.current) {
            const diagramRoot = DiagramDOM.createRoot(diagram, svg.current, DiagramRoot);
            diagramRoot.render();

            return () => {
                diagramRoot.clear();
            }
        }
    }, [diagram]);

    return (
        <DiagramSvg xmlns="http://www.w3.org/2000/svg" 
            ref={svg}
            {...svgProps}
        />
    )
}

export default DiagramElementIcon;