import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import doc from "./diagram-document";

interface DiagramViewerProps {
    documentSize: {width: number, height: number};
}

function App(props: DiagramViewerProps) {
    const container = useRef<HTMLDivElement>(null);
    const root = useRef<SVGGElement>(null);
    const controls = useRef<SVGGElement>(null);

    const [controlsTransform, setControlsTransform] = useState<DOMMatrix | undefined>(undefined);
    const [resizeObserver] = useState(new ResizeObserver(() => handleResize()));

    useLayoutEffect(() => {
        const containerElement = container.current!;
        root.current && doc.render(root.current);
        resizeObserver.observe(container.current!);

        return () => resizeObserver.unobserve(containerElement);
    }, [resizeObserver]);

    useEffect(() => {
        controls.current && controlsTransform && doc.renderControls(controls.current, controlsTransform.inverse());
    }, [controlsTransform]);

    function handleResize() {
        if (controls.current && root.current) {
            const transform = root.current.getScreenCTM()!.inverse();
            setControlsTransform(transform);
        }
    }

    function handleClick(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
        const pt = new DOMPoint(e.clientX, e.clientY);
        const transform = e.currentTarget.getScreenCTM()?.inverse();
        const hit = doc.hitTest(transform!, pt, 2);
        console.log(hit);
    }

    return (
        <div ref={container}>
            <svg xmlns="http://www.w3.org/2000/svg"
                    viewBox={[0, 0, props.documentSize.width, props.documentSize.height].join(' ')}  
                    onClick={handleClick}>
                <g ref={root} />
                <g ref={controls} transform={controlsTransform ? `matrix(${controlsTransform.a} ${controlsTransform.b} ${controlsTransform.c} ${controlsTransform.d} ${controlsTransform.e} ${controlsTransform.f})` : undefined} />
            </svg>
        </div>
    );
}

export default App;
