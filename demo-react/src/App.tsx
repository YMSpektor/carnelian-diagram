import React, { useLayoutEffect, useRef } from 'react';
import doc from "./diagram-document";

interface DiagramViewerProps {
    documentSize: {width: number, height: number};
}

function App(props: DiagramViewerProps) {
    const root = useRef<SVGGElement>(null);

    useLayoutEffect(() => {
        root.current && doc.render(root.current);
    }, []);

    function handleClick(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
        const pt = new DOMPoint(e.clientX, e.clientY);
        const transform = e.currentTarget.getScreenCTM()?.inverse();
        const hit = doc.hitTest(transform!, pt);
        console.log(hit);
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg"
                viewBox={[0, 0, props.documentSize.width, props.documentSize.height].join(' ')}  
                onClick={handleClick}>
            <g ref={root}>
            </g>
        </svg>
    );
}

export default App;
