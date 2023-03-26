/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState } from 'react';
import { Diagram } from 'carnelian-diagram';
import { InteractionController } from 'carnelian-diagram/interaction';
import DiagramToolbar from './components/DiagramToolbar';
import DiagramViewer from './components/DiagramViewer';
import { createDiagram } from "./diagram-document";

function App() {
    const [scale, setScale] = useState(100);
    const [diagram, setDiagram] = useState<Diagram | null>(null)
    const viewerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (viewerRef.current && !diagram) {
            const controller = new InteractionController(viewerRef.current);
            setDiagram(createDiagram(controller));
        }
    }, [diagram]);

    return (
        <div css={{display: "flex", flexDirection: "column", height: "100vh"}}>
            <DiagramToolbar scale={scale} onScaleChange={setScale} />
            <DiagramViewer
                ref={viewerRef}
                css={{flex: 1, backgroundColor: "#c5c5ff"}}
                diagram={diagram} 
                diagramSize={{width: 2100, height: 2970}} 
                scale={scale} unit="mm" unitMultiplier={0.1} 
            />
        </div>
    )
}

export default App;
