/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { Diagram } from 'carnelian-diagram';
import DiagramPalette, { DiagramPaletteElement } from './components/DiagramPalette';
import DiagramToolbar from './components/DiagramToolbar';
import DiagramViewer from './components/DiagramViewer';
import { InteractionController } from 'carnelian-diagram/interaction';

interface AppProps {
    diagram: Diagram;
    controller: InteractionController;
    palette: DiagramPaletteElement<any>[];
}

function App(props: AppProps) {
    const { controller, diagram, palette } = props;
    const [scale, setScale] = useState(100);

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
