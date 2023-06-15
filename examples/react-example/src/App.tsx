/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { Diagram } from '@carnelian-diagram/core';
import DiagramPalette, { DiagramPaletteElement } from './components/DiagramPalette';
import DiagramToolbar from './components/DiagramToolbar';
import DiagramViewer from './components/DiagramViewer';
import { InteractionController, isPaperService } from '@carnelian-diagram/interaction';
import { Accordion, AccordionDetails, AccordionSummary, createTheme, ThemeProvider, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LayoutSidebar from './components/LayoutSidebar';
import LayoutToolbar from './components/LayoutToolbar';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#b11e1e',
        },
        secondary: {
            main: '#2b2b2b',
        },
        background: {
            default: '#eeeeee',
            paper: '#eeeeee',
        },
    }
});

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
        <ThemeProvider theme={theme}>
            <div css={{display: "flex", flexDirection: "column", height: "100vh", backgroundColor: theme.palette.background.default}}>
                <LayoutToolbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}>
                    <DiagramToolbar diagram={diagram} controller={controller} scale={scale} onScaleChange={setScale} unit="mm" unitMultiplier={0.1} />
                </LayoutToolbar>
                <div css={{flex: 1, display: "flex", alignItems: "stretch"}}>
                    <LayoutSidebar width={330} mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(!sidebarOpen)}>
                        <Accordion defaultExpanded={true} disableGutters={true}>
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
                        <Accordion disableGutters={true}>
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
                        css={{flex: 1, backgroundColor: "#ddd"}}
                        diagram={diagram} controller={controller}
                        diagramSize={{width: paper?.width || 0, height: paper?.height || 0}} 
                        scale={scale} unit="mm" unitMultiplier={0.1} 
                    />
                </div>
            </div>
        </ThemeProvider>
    )
}

export default App;
