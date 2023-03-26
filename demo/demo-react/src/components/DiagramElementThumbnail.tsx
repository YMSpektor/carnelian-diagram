import { SVGAttributes, useLayoutEffect, useRef } from "react";
import { Diagram, DiagramElement, DiagramRoot } from "carnelian-diagram";

interface DiagramElementThumbnailProps<T extends object> {
    elementType: DiagramElement<T>;
    elementProps: T;
}

function DiagramElementThumbnail<T extends object>(props: DiagramElementThumbnailProps<T> & SVGAttributes<SVGSVGElement>) {
    const {elementType, elementProps, ...svgProps} = props;
    const svg = useRef<SVGSVGElement>(null);
    
    useLayoutEffect(() => {
        if (svg.current) {
            const root = svg.current;
            const diagram = new Diagram(DiagramRoot);
            diagram.add(props.elementType, props.elementProps);
            diagram.update(root, true);

            return () => {
                diagram.clear();
                diagram.update(root, true);
            }
        }
    }, [props.elementType, props.elementProps]);

    return (
        <svg xmlns="http://www.w3.org/2000/svg" 
            ref={svg}
            {...svgProps}
        />
    )
}

export default DiagramElementThumbnail;