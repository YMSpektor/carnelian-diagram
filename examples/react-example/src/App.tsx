/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { Diagram, DiagramElementNode } from '@carnelian-diagram/core';
import DiagramPalette, { DiagramPaletteElement } from './components/DiagramPalette';
import DiagramToolbar from './components/DiagramToolbar';
import DiagramViewer from './components/DiagramViewer';
import { InteractionController, isPaperService, SelectEventArgs, SELECT_EVENT } from '@carnelian-diagram/interaction';
import { Accordion, AccordionDetails, AccordionSummary, createTheme, Divider, ThemeProvider, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LayoutSidebar from './components/LayoutSidebar';
import LayoutToolbar from './components/LayoutToolbar';
import DiagramPropertiesPanel, { ElementStyle } from './components/DiagramPropertiesPanel';
import { ClosedFigureStyleProps, DEFAULT_FONT_FAMILY, TextStyleProps } from '@carnelian-diagram/shapes';

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
    const [paper, setPaper] = useState(controller.getService(isPaperService)?.paper);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [elementStyle, setElementStyle] = useState<ElementStyle | null>(null);

    const unitMultiplier = 0.1;

    function getHasFill(selectedElements: DiagramElementNode[]) {
        return selectedElements.length ? (selectedElements[0].props as ClosedFigureStyleProps).style?.fill !== "none" : true;
    }
    
    function getFillColor(selectedElements: DiagramElementNode[]) {
        const defaultFillColor = "#ffffff";
        const result = selectedElements.length ? (selectedElements[0].props as ClosedFigureStyleProps).style?.fill || defaultFillColor : defaultFillColor;
        return result !== "none" ? result : defaultFillColor;
    }
    
    function getHasStroke(selectedElements: DiagramElementNode[]) {
        return selectedElements.length ? (selectedElements[0].props as ClosedFigureStyleProps).style?.stroke !== "none" : true;
    }
    
    function getStrokeColor(selectedElements: DiagramElementNode[]) {
        const defaultStrokeColor = "#000000";
        const result = selectedElements.length ? (selectedElements[0].props as ClosedFigureStyleProps).style?.stroke || defaultStrokeColor : defaultStrokeColor;
        return result !== "none" ? result : defaultStrokeColor;
    }
    
    function getStrokeWidth(selectedElements: DiagramElementNode[], unitMultiplier: number) {
        const defaultStrokeWidth = 0.25;
        return selectedElements.length ? (parseFloat((selectedElements[0].props as ClosedFigureStyleProps).style?.strokeWidth?.toString() || "") || 0) * unitMultiplier || defaultStrokeWidth : "";
    }
    
    function getStrokeDasharray(selectedElements: DiagramElementNode[]) {
        return selectedElements.length ? (selectedElements[0].props as ClosedFigureStyleProps).style?.strokeDasharray || undefined : undefined;
    }
    
    function getHasText(selectedElements: DiagramElementNode[]) {
        return selectedElements.length ? (selectedElements[0].props as TextStyleProps).textStyle?.fill !== "none" : true;
    }
    
    function getTextColor(selectedElements: DiagramElementNode[]) {
        const defaultFontColor = "#000000";
        const result = selectedElements.length ? (selectedElements[0].props as TextStyleProps).textStyle?.fill || defaultFontColor : defaultFontColor;
        return result !== "none" ? result : defaultFontColor;
    }
    
    function getFontFamily(selectedElements: DiagramElementNode[]) {
        return selectedElements.length ? (selectedElements[0].props as TextStyleProps).textStyle?.fontFamily || DEFAULT_FONT_FAMILY : DEFAULT_FONT_FAMILY;
    }
    
    function getFontBold(selectedElements: DiagramElementNode[]): boolean {
        return selectedElements.length ? (selectedElements[0].props as TextStyleProps).textStyle?.fontWeight === "bold" : false;
    }
    
    function getFontItalic(selectedElements: DiagramElementNode[]): boolean {
        return selectedElements.length ? (selectedElements[0].props as TextStyleProps).textStyle?.fontStyle === "italic" : false;
    }
    
    function getFontUnderline(selectedElements: DiagramElementNode[]): boolean {
        return selectedElements.length ? (selectedElements[0].props as TextStyleProps).textStyle?.textDecoration === "underline" : false;
    }
    
    function getFontSize(selectedElements: DiagramElementNode[], unitMultiplier: number) {
        const defaultFontSize = 1;
        return selectedElements.length ? (parseFloat((selectedElements[0].props as TextStyleProps).textStyle?.fontSize?.toString() || "") || 0) * unitMultiplier || defaultFontSize : "";
    }
    
    function getTextAlign(selectedElements: DiagramElementNode[]) {
        const defaultTextAlign = "center";
        return selectedElements.length ? (selectedElements[0].props as TextStyleProps).textStyle?.textAlign || defaultTextAlign : "";
    }
    
    function getTextVAlign(selectedElements: DiagramElementNode[]) {
        const defaultTextVAlign = "middle";
        return selectedElements.length ? (selectedElements[0].props as TextStyleProps).textStyle?.verticalAlign || defaultTextVAlign : "";
    }

    function selectionChangeHandler(e: SelectEventArgs) {
        if (e.selectedElements.length) {
            setElementStyle({
                hasFill: getHasFill(e.selectedElements),
                fillColor: getFillColor(e.selectedElements),
                hasStroke: getHasStroke(e.selectedElements),
                strokeColor: getStrokeColor(e.selectedElements),
                strokeWidth: getStrokeWidth(e.selectedElements, unitMultiplier).toString(),
                strokeDasharray: getStrokeDasharray(e.selectedElements),
                hasText: getHasText(e.selectedElements),
                textColor: getTextColor(e.selectedElements),
                fontFamily: getFontFamily(e.selectedElements),
                fontSize: getFontSize(e.selectedElements, unitMultiplier).toString(),
                fontBold: getFontBold(e.selectedElements),
                fontItalic: getFontItalic(e.selectedElements),
                fontUnderline: getFontUnderline(e.selectedElements),
                textAlign: getTextAlign(e.selectedElements),
                textVAlign: getTextVAlign(e.selectedElements)
            });
        }
        else {
            setElementStyle(null);
        }
    }

    function updateElementStyle(value: ElementStyle) {
        setElementStyle(value);
        controller.getSelectedElements().forEach(element => {
            let strokeWidth = parseFloat(value.strokeWidth || "");
            strokeWidth = isNaN(strokeWidth) ? 0 : strokeWidth / unitMultiplier;
            let fontSize = parseFloat(value.fontSize || "");
            fontSize = isNaN(fontSize) ? 0 : fontSize / unitMultiplier;
            diagram.update(element, {
                ...element.props,
                style: {
                    ...element.props.style,
                    fill: value.hasFill ? value.fillColor : "none",
                    stroke: value.hasStroke ? value.strokeColor : "none",
                    strokeWidth: strokeWidth,
                    strokeDasharray: value.strokeDasharray
                },
                textStyle: {
                    ...element.props.textStyle,
                    fill: value.hasText ? value.textColor : "none",
                    fontFamily: value.fontFamily,
                    fontSize: fontSize,
                    fontWeight: value.fontBold ? "bold" : undefined,
                    fontStyle: value.fontItalic ? "italic" : undefined,
                    textDecoration: value.fontUnderline ? "underline" : undefined,
                    textAlign: value.textAlign,
                    verticalAlign: value.textVAlign
                }
            })
        });
    }

    useEffect(() => {
        controller.addEventListener(SELECT_EVENT, selectionChangeHandler);

        return () => {
            controller.removeEventListener(SELECT_EVENT, selectionChangeHandler);
        }
    }, [controller]);

    return (
        <ThemeProvider theme={theme}>
            <div css={{display: "flex", flexDirection: "column", height: "100vh", backgroundColor: theme.palette.background.default}}>
                <LayoutToolbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}>
                    <DiagramToolbar diagram={diagram} controller={controller} scale={scale} onScaleChange={setScale} unit="mm" unitMultiplier={0.1} />
                </LayoutToolbar>
                <div css={{flex: 1, display: "flex", alignItems: "stretch", overflow: "hidden"}}>
                    <LayoutSidebar width={340} mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(!sidebarOpen)}>
                        <div css={{flex: "1 1 50%", overflow: "auto"}}>
                            <Accordion defaultExpanded={true} disableGutters={true}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>Basic Shapes</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <DiagramPalette 
                                        iconWidth={48} 
                                        iconHeight={32} 
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
                                        iconWidth={48} 
                                        iconHeight={32} 
                                        palette={palette.filter(x => x.category === "examples")}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        <Divider />
                        <div css={{flex: "1 1 50%", overflow: "auto"}}>
                            <DiagramPropertiesPanel
                                diagram={diagram}
                                controller={controller} 
                                unitMultiplier={unitMultiplier}
                                elementStyle={elementStyle}
                                onElementChange={updateElementStyle}
                                onPaperChange={setPaper} 
                            />
                        </div>
                    </LayoutSidebar>
                    <DiagramViewer
                        css={{flex: 1, backgroundColor: "#ddd"}}
                        diagram={diagram} controller={controller}
                        diagramSize={{width: paper?.width || 0, height: paper?.height || 0}} 
                        scale={scale} unit="mm" unitMultiplier={unitMultiplier} 
                    />
                </div>
            </div>
        </ThemeProvider>
    )
}

export default App;
