/** @jsxImportSource @emotion/react */
import React, { useCallback, useEffect, useState } from 'react';
import { Diagram, DiagramElementNode } from '@carnelian-diagram/core';
import DiagramPalette from './components/DiagramPalette';
import DiagramToolbar from './components/DiagramToolbar';
import DiagramViewer from './components/DiagramViewer';
import { InteractionController, isPaperService, SelectEventArgs, SELECT_EVENT } from '@carnelian-diagram/interactivity';
import { Accordion, AccordionDetails, AccordionSummary, createTheme, ThemeProvider, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LayoutSidebar from './components/LayoutSidebar';
import LayoutToolbar from './components/LayoutToolbar';
import DiagramPropertiesPanel, { ElementStyle } from './components/DiagramPropertiesPanel';
import { ClosedFigureStyleProps, DEFAULT_FONT_FAMILY, LineFigureStyleProps, RawImageProps, TextStyleProps } from '@carnelian-diagram/shapes';
import { DiagramPaletteElement } from './diagram/palette';
import { getShapeMetadata, ShapeMetadata } from './diagram/shape-metadata';
import DiagramContextMenu from './components/DiagramContexMenu';

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

function hasFillProps(element: DiagramElementNode): boolean {
    return !!getShapeMetadata(element.type)?.hasFill;
}

function hasStrokeProps(element: DiagramElementNode): boolean {
    return !!getShapeMetadata(element.type)?.hasStroke;
}

function hasTextProps(element: DiagramElementNode): boolean {
    return !!getShapeMetadata(element.type)?.hasText;
}

function hasLineCapProps(element: DiagramElementNode): boolean {
    return !!getShapeMetadata(element.type)?.hasLineCaps;
}

function hasImageProps(element: DiagramElementNode): boolean {
    return !!getShapeMetadata(element.type)?.hasImage;
}

function getHasFill(selectedElements: DiagramElementNode[]) {
    const element = selectedElements.find(x => hasFillProps(x));
    return element ? (element.props as ClosedFigureStyleProps).style?.fill !== "none" : true;
}

function getFillColor(selectedElements: DiagramElementNode[]) {
    const defaultFillColor = "#ffffff";
    const element = selectedElements.find(x => hasFillProps(x));
    const result = element ? (element.props as ClosedFigureStyleProps).style?.fill || defaultFillColor : defaultFillColor;
    return result !== "none" ? result : defaultFillColor;
}

function getHasStroke(selectedElements: DiagramElementNode[]) {
    const element = selectedElements.find(x => hasStrokeProps(x));
    return element ? (element.props as ClosedFigureStyleProps).style?.stroke !== "none" : true;
}

function getStrokeColor(selectedElements: DiagramElementNode[]) {
    const defaultStrokeColor = "#000000";
    const element = selectedElements.find(x => hasStrokeProps(x));
    const result = element ? (element.props as ClosedFigureStyleProps).style?.stroke || defaultStrokeColor : defaultStrokeColor;
    return result !== "none" ? result : defaultStrokeColor;
}

function getStrokeWidth(selectedElements: DiagramElementNode[], unitMultiplier: number) {
    const defaultStrokeWidth = 0.25;
    const element = selectedElements.find(x => hasStrokeProps(x));
    return element ? (parseFloat((element.props as ClosedFigureStyleProps).style?.strokeWidth?.toString() || "") || 0) * unitMultiplier || defaultStrokeWidth : "";
}

function getStrokeDasharray(selectedElements: DiagramElementNode[]) {
    const element = selectedElements.find(x => hasStrokeProps(x));
    return element ? (element.props as ClosedFigureStyleProps).style?.strokeDasharray || undefined : undefined;
}

function getStartLineCap(selectedElements: DiagramElementNode[]) {
    const element = selectedElements.find(x => hasLineCapProps(x));
    return element ? (element.props as LineFigureStyleProps).startLineCap?.kind || "" : "";
}

function getEndLineCap(selectedElements: DiagramElementNode[]) {
    const element = selectedElements.find(x => hasLineCapProps(x));
    return element ? (element.props as LineFigureStyleProps).endLineCap?.kind || "" : "";
}

function getHasText(selectedElements: DiagramElementNode[]) {
    const element = selectedElements.find(x => hasTextProps(x));
    return element ? (element.props as TextStyleProps).textStyle?.fill !== "none" : true;
}

function getTextColor(selectedElements: DiagramElementNode[]) {
    const defaultFontColor = "#000000";
    const element = selectedElements.find(x => hasTextProps(x));
    const result = element ? (element.props as TextStyleProps).textStyle?.fill || defaultFontColor : defaultFontColor;
    return result !== "none" ? result : defaultFontColor;
}

function getFontFamily(selectedElements: DiagramElementNode[]) {
    const element = selectedElements.find(x => hasTextProps(x));
    return element ? (element.props as TextStyleProps).textStyle?.fontFamily || DEFAULT_FONT_FAMILY : DEFAULT_FONT_FAMILY;
}

function getFontBold(selectedElements: DiagramElementNode[]): boolean {
    const element = selectedElements.find(x => hasTextProps(x));
    return element ? (element.props as TextStyleProps).textStyle?.fontWeight === "bold" : false;
}

function getFontItalic(selectedElements: DiagramElementNode[]): boolean {
    const element = selectedElements.find(x => hasTextProps(x));
    return element ? (element.props as TextStyleProps).textStyle?.fontStyle === "italic" : false;
}

function getFontUnderline(selectedElements: DiagramElementNode[]): boolean {
    const element = selectedElements.find(x => hasTextProps(x));
    return element ? (element.props as TextStyleProps).textStyle?.textDecoration === "underline" : false;
}

function getFontSize(selectedElements: DiagramElementNode[], unitMultiplier: number) {
    const defaultFontSize = 1;
    const element = selectedElements.find(x => hasTextProps(x));
    return element ? (parseFloat((element.props as TextStyleProps).textStyle?.fontSize?.toString() || "") || 0) * unitMultiplier || defaultFontSize : "";
}

function getTextAlign(selectedElements: DiagramElementNode[]) {
    const defaultTextAlign = "center";
    const element = selectedElements.find(x => hasTextProps(x));
    return element ? (element.props as TextStyleProps).textStyle?.textAlign || defaultTextAlign : "";
}

function getTextVAlign(selectedElements: DiagramElementNode[]) {
    const defaultTextVAlign = "middle";
    const element = selectedElements.find(x => hasTextProps(x));
    return element ? (element.props as TextStyleProps).textStyle?.verticalAlign || defaultTextVAlign : "";
}

function getHasImage(selectedElements: DiagramElementNode[]) {
    const element = selectedElements.find(x => hasImageProps(x));
    return element ? !!(element.props as RawImageProps).href : false;
}

function getImageUrl(selectedElements: DiagramElementNode[]) {
    const element = selectedElements.find(x => hasImageProps(x));
    return element ? (element.props as RawImageProps).href || "" : "";
}

function getImageAlign(selectedElements: DiagramElementNode[]) {
    const defaultImageAlign = "xMidYMid";
    const element = selectedElements.find(x => hasImageProps(x));
    return element ? (element.props as RawImageProps).preserveAspectRatio?.split(" ")?.[0] || defaultImageAlign : defaultImageAlign;
}

function App(props: AppProps) {
    const { controller, diagram, palette } = props;
    const [scale, setScale] = useState(100);
    const [paper, setPaper] = useState(controller.getService(isPaperService)?.paper);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [elementStyle, setElementStyle] = useState<ElementStyle | null>(null);
    const [elementMetadata, setElementMetadata] = useState<ShapeMetadata | null>(null);
    const [contextMenu, setContextMenu] = React.useState<DOMPoint | null>(null);

    const unitMultiplier = 0.1;
    const sidebarWidth = 270;

    function handleContextMenu(event: React.MouseEvent) {
        event.preventDefault();

        setContextMenu(!contextMenu
            ? new DOMPoint(
                event.clientX + 2,
                event.clientY - 6,
            )
            : null,  
        );
    }

    function closeContextMenu() {
        setContextMenu(null);
    };

    const selectionChangeHandler = useCallback((e: SelectEventArgs) => {
        if (e.selectedElements.length) {
            setElementStyle({
                hasFill: getHasFill(e.selectedElements),
                fillColor: getFillColor(e.selectedElements),
                hasStroke: getHasStroke(e.selectedElements),
                strokeColor: getStrokeColor(e.selectedElements),
                strokeWidth: getStrokeWidth(e.selectedElements, unitMultiplier).toString(),
                strokeDasharray: getStrokeDasharray(e.selectedElements),
                startLineCap: getStartLineCap(e.selectedElements),
                endLineCap: getEndLineCap(e.selectedElements),
                hasText: getHasText(e.selectedElements),
                textColor: getTextColor(e.selectedElements),
                fontFamily: getFontFamily(e.selectedElements),
                fontSize: getFontSize(e.selectedElements, unitMultiplier).toString(),
                fontBold: getFontBold(e.selectedElements),
                fontItalic: getFontItalic(e.selectedElements),
                fontUnderline: getFontUnderline(e.selectedElements),
                textAlign: getTextAlign(e.selectedElements),
                textVAlign: getTextVAlign(e.selectedElements),
                hasImage: getHasImage(e.selectedElements),
                imageUrl: getImageUrl(e.selectedElements),
                imageAlign: getImageAlign(e.selectedElements)
            });
            setElementMetadata({
                hasFill: e.selectedElements.some(x => getShapeMetadata(x.type).hasFill),
                hasStroke: e.selectedElements.some(x => getShapeMetadata(x.type).hasStroke),
                hasText: e.selectedElements.some(x => getShapeMetadata(x.type).hasText),
                hasLineCaps: e.selectedElements.some(x => getShapeMetadata(x.type).hasLineCaps),
                hasImage: e.selectedElements.some(x => getShapeMetadata(x.type).hasImage),
            });
        }
        else {
            setElementStyle(null);
            setElementMetadata(null);
        }
    }, []);

    function updateElementStyle(value: ElementStyle, propName: keyof ElementStyle) {
        const LINE_CAP_SIZE = 20;
        const IMAGE_MEET_OR_SLICE = "meet";
        setElementStyle(value);
        controller.getSelectedElements().forEach(element => {
            let newProps = {...element.props};
            let shouldUpdate = false;
            switch (propName) {
                case "fillColor": 
                    shouldUpdate = hasFillProps(element);
                    newProps = {
                        ...element.props, 
                        style: {
                            ...element.props.style,
                            fill: value.hasFill ? value.fillColor : "none"
                        }
                    };
                    break;
                case "strokeColor":
                    shouldUpdate = hasStrokeProps(element);
                    newProps = {
                        ...element.props, 
                        style: {
                            ...element.props.style,
                            stroke: value.hasStroke ? value.strokeColor : "none"
                        }
                    };
                    break;
                case "strokeWidth":
                    shouldUpdate = hasStrokeProps(element);
                    let strokeWidth = parseFloat(value.strokeWidth || "");
                    strokeWidth = isNaN(strokeWidth) ? 0 : strokeWidth / unitMultiplier;
                    newProps = {
                        ...element.props, 
                        style: {
                            ...element.props.style,
                            strokeWidth
                        }
                    };
                    break;
                case "strokeDasharray":
                    shouldUpdate = hasStrokeProps(element);
                    newProps = {
                        ...element.props, 
                        style: {
                            ...element.props.style,
                            strokeDasharray: value.strokeDasharray
                        }
                    };
                    break;
                case "textColor":
                    shouldUpdate = hasTextProps(element);
                    newProps = {
                        ...element.props, 
                        textStyle: {
                            ...element.props.textStyle,
                            fill: value.hasText ? value.textColor : "none"
                        }
                    };
                    break;
                case "fontFamily":
                    shouldUpdate = hasTextProps(element);
                    newProps = {
                        ...element.props, 
                        textStyle: {
                            ...element.props.textStyle,
                            fontFamily: value.fontFamily
                        }
                    };
                    break;
                case "fontSize":
                    shouldUpdate = hasTextProps(element);
                    let fontSize = parseFloat(value.fontSize || "");
                    fontSize = isNaN(fontSize) ? 0 : fontSize / unitMultiplier;
                    newProps = {
                        ...element.props, 
                        textStyle: {
                            ...element.props.textStyle,
                            fontSize
                        }
                    };
                    break;
                case "fontBold":
                    shouldUpdate = hasTextProps(element);
                    newProps = {
                        ...element.props, 
                        textStyle: {
                            ...element.props.textStyle,
                            fontWeight: value.fontBold ? "bold" : undefined
                        }
                    };
                    break;
                case "fontItalic":
                    shouldUpdate = hasTextProps(element);
                    newProps = {
                        ...element.props, 
                        textStyle: {
                            ...element.props.textStyle,
                            fontStyle: value.fontItalic ? "italic" : undefined
                        }
                    };
                    break;
                case "fontUnderline":
                    shouldUpdate = hasTextProps(element);
                    newProps = {
                        ...element.props, 
                        textStyle: {
                            ...element.props.textStyle,
                            textDecoration: value.fontUnderline ? "underline" : undefined
                        }
                    };
                    break;
                case "textAlign":
                    shouldUpdate = hasTextProps(element);
                    newProps = {
                        ...element.props, 
                        textStyle: {
                            ...element.props.textStyle,
                            textAlign: value.textAlign
                        }
                    };
                    break;
                case "textVAlign":
                    shouldUpdate = hasTextProps(element);
                    newProps = {
                        ...element.props, 
                        textStyle: {
                            ...element.props.textStyle,
                            verticalAlign: value.textVAlign
                        }
                    };
                    break;
                case "startLineCap":
                    shouldUpdate = hasLineCapProps(element);
                    newProps = {
                        ...element.props, 
                        startLineCap: {
                            ...element.props.startLineCap,
                            kind: value.startLineCap ? value.startLineCap : undefined,
                            size: LINE_CAP_SIZE
                        }
                    };
                    break;
                case "endLineCap":
                    shouldUpdate = hasLineCapProps(element);
                    newProps = {
                        ...element.props, 
                        endLineCap: {
                            ...element.props.endLineCap,
                            kind: value.endLineCap ? value.endLineCap : undefined,
                            size: LINE_CAP_SIZE
                        }
                    };
                    break;
                case "imageUrl":
                    shouldUpdate = hasImageProps(element);
                    newProps = {
                        ...element.props, 
                        href: value.hasImage ? value.imageUrl : undefined
                    };
                    break;
                case "imageAlign":
                    shouldUpdate = hasImageProps(element);
                    newProps = {
                        ...element.props, 
                        preserveAspectRatio: `${value.imageAlign} ${IMAGE_MEET_OR_SLICE}`
                    };
                    break;
            }

            shouldUpdate && diagram.update(element, newProps);
        });
    }

    useEffect(() => {
        controller.addEventListener(SELECT_EVENT, selectionChangeHandler);

        return () => {
            controller.removeEventListener(SELECT_EVENT, selectionChangeHandler);
        }
    }, [controller, selectionChangeHandler]);

    return (
        <ThemeProvider theme={theme}>
            <div css={{display: "flex", flexDirection: "column", height: "100vh", backgroundColor: theme.palette.background.default}}>
                <LayoutToolbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}>
                    <DiagramToolbar diagram={diagram} controller={controller} scale={scale} onScaleChange={setScale} unit="mm" unitMultiplier={0.1} />
                </LayoutToolbar>
                <div css={{flex: 1, display: "flex", alignItems: "stretch", overflow: "hidden"}}>
                    <LayoutSidebar width={sidebarWidth} mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(!sidebarOpen)}>
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
                                <Typography>Advanced Shapes</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <DiagramPalette 
                                    iconWidth={48} 
                                    iconHeight={32} 
                                    palette={palette.filter(x => x.category === "advanced")}
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
                    </LayoutSidebar>
                    <DiagramViewer
                        css={{flex: 1, backgroundColor: "#ddd"}}
                        diagram={diagram} controller={controller}
                        diagramSize={{width: paper?.width || 0, height: paper?.height || 0}} 
                        scale={scale} unit="mm" unitMultiplier={unitMultiplier} 
                        onContextMenu={handleContextMenu}
                    />
                    <DiagramContextMenu
                        open={!!contextMenu} 
                        onClose={closeContextMenu}
                        onSelect={closeContextMenu}
                        anchorReference="anchorPosition"
                        anchorPosition={
                            contextMenu
                              ? { left: contextMenu.x, top: contextMenu.y }
                              : undefined
                          }
                        diagram={diagram}
                        controller={controller}
                    />
                    <LayoutSidebar width={sidebarWidth}>
                        <DiagramPropertiesPanel
                            diagram={diagram}
                            controller={controller} 
                            unitMultiplier={unitMultiplier}
                            elementStyle={elementStyle}
                            elementMetadata={elementMetadata}
                            onElementChange={updateElementStyle}
                            onPaperChange={setPaper} 
                        />
                    </LayoutSidebar>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default App;
