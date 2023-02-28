import React, { useLayoutEffect, useRef, useState } from 'react';
import doc from "./diagram-document";

interface DiagramViewerProps {
    documentSize: {width: number, height: number};
}

function App(props: DiagramViewerProps) {
    const root = useRef<SVGGElement>(null);
    const controls = useRef<SVGGElement>(null);

    const [controlsTransform, setControlsTransform] = useState<string | undefined>(undefined);

    useLayoutEffect(() => {
        root.current && doc.render(root.current);
        if (controls.current) {
            const transform = controls.current.getScreenCTM()!.inverse();
            setControlsTransform(`matrix(${transform.a} ${transform.b} ${transform.c} ${transform.d} ${transform.e} ${transform.f})`);
            doc.renderControls(controls.current, transform.inverse());
        }
    }, []);

    function handleClick(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
        const pt = new DOMPoint(e.clientX, e.clientY);
        const transform = e.currentTarget.getScreenCTM()?.inverse();
        const hit = doc.hitTest(transform!, pt, 2);
        console.log(hit);
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg"
                viewBox={[0, 0, props.documentSize.width, props.documentSize.height].join(' ')}  
                onClick={handleClick}>
            <g ref={root} />
            <g ref={controls} transform={controlsTransform} />
        </svg>
    );
}

export default App;
