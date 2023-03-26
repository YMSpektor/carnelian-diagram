/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import DiagramToolbar from './components/DiagramToolbar';
import DiagramViewer from './components/DiagramViewer';
import doc from "./diagram-document";

function App() {
    const [scale, setScale] = useState(100);

    return (
        <div css={{display: "flex", flexDirection: "column", height: "100vh"}}>
            <DiagramToolbar scale={scale} onScaleChange={setScale} />
            <DiagramViewer
                css={{flex: 1}}
                diagram={doc} 
                diagramSize={{width: 2100, height: 2970}} 
                scale={scale} unit="mm" unitMultiplier={0.1} 
            />
        </div>
    )
}

export default App;
