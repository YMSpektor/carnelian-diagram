import { forwardRef, SVGAttributes } from "react";

const DiagramSvg = forwardRef<SVGSVGElement, SVGAttributes<SVGSVGElement>>(function(props, ref) {
    return (
        <svg ref={ref} 
            xmlns="http://www.w3.org/2000/svg"
            {...props} 
        />
    );
});

export default DiagramSvg;