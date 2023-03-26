/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import DiagramPalette from './components/DiagramPalette';
import DiagramToolbar from './components/DiagramToolbar';
import DiagramViewer from './components/DiagramViewer';
import { controller, diagram } from "./diagram-document";

function App() {
    const [scale, setScale] = useState(100);

    return (
        <div css={{display: "flex", flexDirection: "column", height: "100vh"}}>
            <DiagramToolbar scale={scale} onScaleChange={setScale} />
            <div css={{flex: 1, display: "flex", alignItems: "stretch", overflow: "hidden"}}>
                <DiagramPalette css={{flex: "0 0 300px"}} />
                <DiagramViewer
                    css={{flex: 1, backgroundColor: "#c5c5ff"}}
                    diagram={diagram} controller={controller}
                    diagramSize={{width: 2100, height: 2970}} 
                    scale={scale} unit="mm" unitMultiplier={0.1} 
                />
            </div>
        </div>
    )
}

export default App;
