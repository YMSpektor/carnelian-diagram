import { forwardRef, SVGAttributes } from "react";

const DiagramSvg = forwardRef<SVGSVGElement, SVGAttributes<SVGSVGElement>>(function(props, ref) {
    return (
        <svg ref={ref}
            version="1.1" 
            xmlnsXlink="http://www.w3.org/1999/xlink" 
            xmlns="http://www.w3.org/2000/svg" 
            {...props} 
        />
    );
});

export default DiagramSvg;