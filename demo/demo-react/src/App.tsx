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
            elementProps: {x: 20, y: 20, width: 300, height: 300, stroke: "black", fill: "white"},
            viewBox: "0 0 340 340",
            title: "Rectangle",
            factory: (point, props) => ({
                ...props,
                x: point.x - props.width / 2,
                y: point.y - props.height / 2
            })
        },
        {
            elementType: Rect,
            elementProps: {x: 20, y: 20, width: 300, height: 300, stroke: "black", fill: "blue"},
            viewBox: "0 0 340 340",
            title: "Rectangle",
            factory: (point, props) => ({
                ...props,
                x: point.x - props.width / 2,
                y: point.y - props.height / 2
            })
        }
    ];

    return (
        <div css={{display: "flex", flexDirection: "column", height: "100vh"}}>
            <DiagramToolbar scale={scale} onScaleChange={setScale} />
            <div css={{flex: 1, display: "flex", alignItems: "stretch", overflow: "hidden"}}>
                <DiagramPalette iconWidth={64} iconHeight={64} palette={palette} css={{flex: "0 0 300px"}} />
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
