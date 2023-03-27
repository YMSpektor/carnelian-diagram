/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import DiagramPalette, { DiagramPaletteElement } from './components/DiagramPalette';
import DiagramToolbar from './components/DiagramToolbar';
import DiagramViewer from './components/DiagramViewer';
import { controller, diagram } from "./diagram-document";
import { Rect } from './elements';

function App() {
    const [scale, setScale] = useState(100);

    const palette: DiagramPaletteElement<any>[] = [
        {
            elementType: Rect,
            elementProps: {x: 10, y: 10, width: 80, height: 80, stroke: "black", fill: "white"},
            viewBox: "0 0 100 100",
            title: "Rectangle"
        },
        {
            elementType: Rect,
            elementProps: {x: 10, y: 10, width: 80, height: 80, stroke: "black", fill: "blue"},
            viewBox: "0 0 100 100",
            title: "Rectangle"
        }
    ];

    return (
        <div css={{display: "flex", flexDirection: "column", height: "100vh"}}>
            <DiagramToolbar scale={scale} onScaleChange={setScale} />
            <div css={{flex: 1, display: "flex", alignItems: "stretch", overflow: "hidden"}}>
                <DiagramPalette thumbWidth={64} thumbHeight={64} palette={palette} css={{flex: "0 0 300px"}} />
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
