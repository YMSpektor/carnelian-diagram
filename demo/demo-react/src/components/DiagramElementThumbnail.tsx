import { SVGAttributes, useLayoutEffect, useRef, useState } from "react";
import { Diagram, DiagramElement, DiagramRoot } from "carnelian-diagram";

interface DiagramElementThumbnailProps<T extends object> {
    elementType: DiagramElement<T>;
    elementProps: T;
}

function DiagramElementThumbnail<T extends object>(props: DiagramElementThumbnailProps<T> & SVGAttributes<SVGSVGElement>) {
    const {elementType, elementProps, ...svgProps} = props;
    const [diagram] = useState(createDiagram());
    const svg = useRef<SVGSVGElement>(null);

    function createDiagram() {
        const diagram = new Diagram(DiagramRoot);
        diagram.add(props.elementType, props.elementProps);
        return diagram;
    }
    
    useLayoutEffect(() => {
        if (svg.current) {
            const root = svg.current;
            diagram.update(root, true);
        }
    }, [diagram]);

    return (
        <svg xmlns="http://www.w3.org/2000/svg" 
            ref={svg}
            {...svgProps}
        />
    )
}

export default DiagramElementThumbnail;