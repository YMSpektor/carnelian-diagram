import React, { useState } from 'react';
import DiagramToolbar from './components/DiagramToolbar';
import DiagramViewer from './components/DiagramViewer';
import doc from "./diagram-document";

function App() {
    const [scale, setScale] = useState(100);

    return (
        <>
            <DiagramToolbar scale={scale} onScaleChange={setScale} />
            <DiagramViewer diagram={doc} diagramSize={{width: 800, height: 600}} scale={scale} />
        </>
    )
}

export default App;
