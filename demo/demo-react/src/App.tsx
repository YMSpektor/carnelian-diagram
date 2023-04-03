/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { Diagram } from '@carnelian/diagram';
import DiagramPalette, { DiagramPaletteElement } from './components/DiagramPalette';
import DiagramToolbar from './components/DiagramToolbar';
import DiagramViewer from './components/DiagramViewer';
import { InteractionController } from '@carnelian/interaction';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
            <DiagramToolbar diagram={diagram} controller={controller} scale={scale} onScaleChange={setScale} />
            <div css={{flex: 1, display: "flex", alignItems: "stretch", overflow: "hidden", backgroundColor: "#42a5f560"}}>
                <div css={{flex: "0 0 auto", overflow: "auto"}}>
                    <Accordion defaultExpanded={true} css={{backgroundColor: "inherit"}}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Basic Shapes</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <DiagramPalette iconWidth={64} iconHeight={48} palette={palette} css={{width: 280}} />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion css={{backgroundColor: "inherit"}}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Examples</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        </AccordionDetails>
                    </Accordion>
                </div>
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
