/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { Diagram } from '@carnelian-diagram/core';
import DiagramPalette, { DiagramPaletteElement } from './components/DiagramPalette';
import DiagramToolbar from './components/DiagramToolbar';
import DiagramViewer from './components/DiagramViewer';
import { InteractionController, isPaperService } from '@carnelian-diagram/interaction';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LayoutSidebar from './components/LayoutSidebar';
import LayoutToolbar from './components/LayoutToolbar';

interface AppProps {
    diagram: Diagram;
    controller: InteractionController;
    palette: DiagramPaletteElement<any>[];
}

function App(props: AppProps) {
    const { controller, diagram, palette } = props;
    const [scale, setScale] = useState(100);
    const paper = controller.getService(isPaperService)?.paper;

    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    return (
        <div css={{display: "flex", flexDirection: "column", height: "100vh"}}>
            <LayoutToolbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}>
                <DiagramToolbar diagram={diagram} controller={controller} scale={scale} onScaleChange={setScale} unit="mm" unitMultiplier={0.1} />
            </LayoutToolbar>
            <div css={{flex: 1, display: "flex", alignItems: "stretch"}}>
                <LayoutSidebar width={330} mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(!sidebarOpen)}>
                    <Accordion defaultExpanded={true} disableGutters={true} css={{backgroundColor: "inherit"}}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Basic Shapes</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <DiagramPalette 
                                iconWidth={64} 
                                iconHeight={48} 
                                palette={palette.filter(x => x.category === "basic")} 
                            />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion disableGutters={true} css={{backgroundColor: "inherit"}}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Examples</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <DiagramPalette 
                                iconWidth={64} 
                                iconHeight={48} 
                                palette={palette.filter(x => x.category === "examples")} 
                                css={{width: 280}} 
                            />
                        </AccordionDetails>
                    </Accordion>
                </LayoutSidebar>
                <DiagramViewer
                    css={{flex: 1, backgroundColor: "#c5c5ff"}}
                    diagram={diagram} controller={controller}
                    diagramSize={{width: paper?.width || 0, height: paper?.height || 0}} 
                    scale={scale} unit="mm" unitMultiplier={0.1} 
                />
            </div>
        </div>
    )
}

export default App;
