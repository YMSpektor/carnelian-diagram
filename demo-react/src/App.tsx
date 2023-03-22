import React, { useLayoutEffect, useRef } from 'react';
import doc from "./diagram-document";

interface DiagramViewerProps {
    documentSize: {width: number, height: number};
}

function App(props: DiagramViewerProps) {
    const root = useRef<SVGSVGElement>(null);

    useLayoutEffect(() => {
        root.current && doc.attach(root.current);

        return () => {
            doc.detach();
        }
    }, []);

    return (
        <svg xmlns="http://www.w3.org/2000/svg"
                viewBox={[0, 0, props.documentSize.width, props.documentSize.height].join(' ')}  
                ref={root}>
        </svg>
    );
}

export default App;
