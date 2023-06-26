import { useLayoutEffect, useState } from "react";
import { InteractionController, isGridSnappingService, isPaperService, Paper } from "@carnelian-diagram/interaction";
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, FormControl, FormControlLabel, FormLabel, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select, Tab, Tabs, TextField, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TabPanel from "./TabPanel";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import { Diagram, DiagramElementNode, DiagramElementProps } from "@carnelian-diagram/core";
import ColorInput from "./ColorInput";
import { ClosedFigureStyleProps, TextStyleProps } from "@carnelian-diagram/shapes";

export interface DiagramPropertiesPanelProps {
    diagram: Diagram;
    controller: InteractionController;
    unitMultiplier: number;
    selectedElements: DiagramElementNode[];
    onPaperChange: (paper: Paper) => void;
}

interface PageSize {
    name: string;
    width: number;
    height: number;
}

const PAGE_SIZES: PageSize[] = [
    { name: "A0", width: 841, height: 1189 },
    { name: "A1", width: 594, height: 841 },
    { name: "A2", width: 420, height: 594 },
    { name: "A3", width: 297, height: 420 },
    { name: "A4", width: 210, height: 297 },
    { name: "A5", width: 148, height: 210 },
];

interface StrokeStyle {
    name: string;
    dasharray: string | undefined;
}

const SOLID_STROKE_STYLE = "Solid";
const STROKE_STYLES: StrokeStyle[] = [
    { name: SOLID_STROKE_STYLE, dasharray: undefined },
    { name: "Dashed", dasharray: "20 10"},
    { name: "Dotted", dasharray: "5 5"},
    { name: "Dashdot", dasharray: "20 5 5 5"}
];
const DEFAULT_FONT_FAMILY = "[Default]";
const FONT_FAMILIES: string[] = ["Arial", "Comic Sans MS", "Courier New", "Garamond", "Lucida Console", "Tahoma", "Times New Roman"];
const TEXT_ALIGNS: string[] = ["Left", "Center", "Right"];
const TEXT_V_ALIGNS: string[] = ["Top", "Middle", "Bottom"];

const DiagramPropertiesTab = (props: DiagramPropertiesPanelProps) => {
    const paperService = props.controller.getService(isPaperService);
    const gridSnappingService = props.controller.getService(isGridSnappingService);

    const [pageOrientation, setPageOrientation] = useState(getPageOrientation());
    const [pageSize, setPageSize] = useState(PAGE_SIZES.find(x => 
        getPaperWidth(x) === paperService?.paper?.width && 
        getPaperHeight(x) === paperService?.paper?.height));
    const [displayGrid, setDisplayGrid] = useState(!!paperService?.paper?.majorGridSize || !!paperService?.paper?.minorGridSize);
    const [majorGridSize, setMajorGridSize] = useState<string>(((paperService?.paper?.majorGridSize || 0) * props.unitMultiplier).toString());
    const [minorGridSize, setMinorGridSize] = useState<string>(((paperService?.paper?.minorGridSize || 0) * props.unitMultiplier).toString());
    const [snapToGrid, setSnapToGrid] = useState(!!gridSnappingService?.snapGridSize || !!gridSnappingService?.snapAngle);
    const [snapGridSize, setSnapGridSize] = useState<string>(((gridSnappingService?.snapGridSize || 0) * props.unitMultiplier).toString());
    const [snapAngle, setSnapAngle] = useState<string>((gridSnappingService?.snapAngle || 0).toString());

    function getPageOrientation(): string {
        return paperService?.paper && paperService.paper.width > paperService.paper.height ? "landscape" : "portrait";
    }

    function updatePageOrientation(pageOrientation: string) {
        if (paperService?.paper && pageSize) {
            setPageOrientation(pageOrientation);
            paperService.paper = {...paperService.paper, width: getPaperWidth(pageSize, pageOrientation), height: getPaperHeight(pageSize, pageOrientation)};
            props.onPaperChange(paperService.paper);
        }
    }

    function getPaperWidth(pageSize: PageSize, orientation?: string): number {
        orientation = orientation || pageOrientation;
        const width = orientation === "portrait" ? pageSize.width : pageSize.height;
        return width / props.unitMultiplier;
    }

    function getPaperHeight(pageSize: PageSize, orientation?: string): number {
        orientation = orientation || pageOrientation;
        const height = orientation === "portrait" ? pageSize.height : pageSize.width;
        return height / props.unitMultiplier;
    }

    function changePageSize(value: string) {
        const newPageSize = PAGE_SIZES.find(x => x.name === value);
        if (newPageSize && paperService?.paper) {
            setPageSize(newPageSize);
            paperService.paper = {...paperService.paper, width: getPaperWidth(newPageSize), height: getPaperHeight(newPageSize)};
            props.onPaperChange(paperService.paper);
        }
    }

    function updateDisplayGrid(value: boolean) {
        if (paperService?.paper) {
            setDisplayGrid(value);
            paperService.paper = {
                ...paperService.paper, 
                majorGridSize: value ? parseFloat(majorGridSize) / props.unitMultiplier : undefined, 
                minorGridSize: value ? parseFloat(minorGridSize) / props.unitMultiplier : undefined 
            };
            props.onPaperChange(paperService.paper);
        }
    }

    function updateMinorGridSize(value: string) {
        setMinorGridSize(value);
        let gridSize = parseFloat(value);
        gridSize = isNaN(gridSize) ? 0 : gridSize / props.unitMultiplier;
        if (paperService?.paper) {
            paperService.paper = {
                ...paperService.paper, 
                minorGridSize: value ? gridSize : undefined, 
            };
            props.onPaperChange(paperService.paper);
        }
    }

    function updateMajorGridSize(value: string) {
        setMajorGridSize(value);
        let gridSize = parseFloat(value);
        gridSize = isNaN(gridSize) ? 0 : gridSize / props.unitMultiplier;
        if (paperService?.paper) {
            paperService.paper = {
                ...paperService.paper, 
                majorGridSize: value ? gridSize : undefined, 
            };
            props.onPaperChange(paperService.paper);
        }
    }

    function updateSnapToGrid(value: boolean) {
        if (gridSnappingService) {
            setSnapToGrid(value);
            gridSnappingService.snapGridSize = value ? parseFloat(snapGridSize) / props.unitMultiplier : undefined;
            gridSnappingService.snapAngle = value ? parseFloat(snapAngle) : undefined;
        }
    }

    function updateSnapGridSize(value: string) {
        setSnapGridSize(value);
        let gridSize = parseFloat(value);
        gridSize = isNaN(gridSize) ? 0 : gridSize / props.unitMultiplier;
        if (gridSnappingService) {
            gridSnappingService.snapGridSize = value ? gridSize : undefined;
        }
    }

    function updateSnapAngle(value: string) {
        setSnapAngle(value);
        let gridSize = parseFloat(value);
        gridSize = isNaN(gridSize) ? 0 : gridSize;
        if (gridSnappingService) {
            gridSnappingService.snapAngle = value ? gridSize : undefined;
        }
    }

    return (
        <>
            <Accordion disableGutters={true} defaultExpanded={true}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Page</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormControl fullWidth variant="outlined" size="small" margin="dense" sx={{backgroundColor: "background.default"}}>
                        <InputLabel id="page-size-label">Page size</InputLabel>
                        <Select
                            labelId="page-size-label"
                            label="Page size"
                            value={pageSize?.name}
                            onChange={(e) => changePageSize(e.target.value)}
                        >
                            {PAGE_SIZES.map(ps => (
                                <MenuItem key={ps.name} value={ps.name}>{ps.name} ({ps.width} mm x {ps.height} mm)</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth variant="outlined" size="small">
                        <FormLabel id="page-orientation-label">Orientation</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="page-orientation-label"
                            name="page-orientation-radio-buttons-group"
                            value={pageOrientation}
                            onChange={(e) => updatePageOrientation(e.target.value)}
                        >
                            <FormControlLabel value="portrait" control={<Radio />} label="Portrait" />
                            <FormControlLabel value="landscape" control={<Radio />} label="Landscape" />
                        </RadioGroup>
                    </FormControl>
                </AccordionDetails>
            </Accordion>
            <Accordion disableGutters={true} defaultExpanded={true}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Grid & Snapping</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox checked={displayGrid} onChange={(e, checked) => updateDisplayGrid(checked)} />} label="Display grid" />
                        <TextField 
                            fullWidth variant="outlined" size="small" margin="dense" disabled={!displayGrid}
                            label="Minor grid size"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">mm</InputAdornment>  
                            }}
                            value={minorGridSize}
                            onChange={(e) => updateMinorGridSize(e.target.value)}
                            sx={{backgroundColor: displayGrid ? "background.default" : "background.paper"}}
                        />
                        <TextField 
                            fullWidth variant="outlined" size="small" margin="dense" disabled={!displayGrid}
                            label="Major grid size"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">mm</InputAdornment>  
                            }}
                            value={majorGridSize}
                            onChange={(e) => updateMajorGridSize(e.target.value)}
                            sx={{backgroundColor: displayGrid ? "background.default" : "background.paper"}}
                        />
                        <FormControlLabel control={<Checkbox checked={snapToGrid} onChange={(e, checked) => updateSnapToGrid(checked)} />} label="Snap to grid" />
                        <TextField 
                            fullWidth variant="outlined" size="small" margin="dense" disabled={!snapToGrid}
                            label="Snap grid"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">mm</InputAdornment>  
                            }}
                            value={snapGridSize}
                            onChange={(e) => updateSnapGridSize(e.target.value)}
                            sx={{backgroundColor: snapToGrid ? "background.default" : "background.paper"}}
                        />
                        <TextField 
                            fullWidth variant="outlined" size="small" margin="dense" disabled={!snapToGrid}
                            label="Snap angle"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">deg.</InputAdornment>  
                            }}
                            value={snapAngle}
                            onChange={(e) => updateSnapAngle(e.target.value)}
                            sx={{backgroundColor: snapToGrid ? "background.default" : "background.paper"}}
                        />
                    </FormGroup>
                </AccordionDetails>
            </Accordion>
        </>
    );
}

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

function getStrokeStyle(selectedElements: DiagramElementNode[]) {
    const value = selectedElements.length ? (selectedElements[0].props as ClosedFigureStyleProps).style?.strokeDasharray || undefined : undefined;
    return STROKE_STYLES.find(x => x.dasharray === value)?.name || SOLID_STROKE_STYLE;
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

const ElementsPropertiesTab = (props: DiagramPropertiesPanelProps) => {
    const [hasFill, setHasFill] = useState(getHasFill(props.selectedElements));
    const [fillColor, setFillColor] = useState(getFillColor(props.selectedElements));
    const [hasStroke, setHasStroke] = useState(getHasStroke(props.selectedElements));
    const [strokeColor, setStrokeColor] = useState(getStrokeColor(props.selectedElements));
    const [strokeWidth, setStrokeWidth] = useState(getStrokeWidth(props.selectedElements, props.unitMultiplier));
    const [strokeStyle, setStrokeStyle] = useState(getStrokeStyle(props.selectedElements));
    const [textColor, setTextColor] = useState(getTextColor(props.selectedElements));
    const [hasText, setHasText] = useState(getHasText(props.selectedElements));
    const [fontSize, setFontSize] = useState(getFontSize(props.selectedElements, props.unitMultiplier));
    const [fontFamily, setFontFamily] = useState(getFontFamily(props.selectedElements));
    const [fontBold, setFontBold] = useState(getFontBold(props.selectedElements));
    const [fontItalic, setFontItalic] = useState(getFontItalic(props.selectedElements));
    const [fontUnderline, setFontUnderline] = useState(getFontUnderline(props.selectedElements));
    const [textAlign, setTextAlign] = useState(getTextAlign(props.selectedElements));
    const [textVAlign, setTextVAlign] = useState(getTextVAlign(props.selectedElements));

    useLayoutEffect(() => {
        if (props.selectedElements.length) {
            setFillColor(getFillColor(props.selectedElements));
            setStrokeColor(getStrokeColor(props.selectedElements));
            setStrokeWidth(getStrokeWidth(props.selectedElements, props.unitMultiplier));
            setStrokeStyle(getStrokeStyle(props.selectedElements));
            setTextColor(getTextColor(props.selectedElements));
            setFontSize(getFontSize(props.selectedElements, props.unitMultiplier));
            setFontFamily(getFontFamily(props.selectedElements));
            setFontBold(getFontBold(props.selectedElements));
            setFontItalic(getFontItalic(props.selectedElements));
            setFontUnderline(getFontUnderline(props.selectedElements));
            setTextAlign(getTextAlign(props.selectedElements));
            setTextVAlign(getTextVAlign(props.selectedElements));
        }
    }, [props.selectedElements, props.unitMultiplier]);

    function updateElement<T>(element: DiagramElementNode<T>, elementProps: DiagramElementProps<T>) {
        props.diagram.update(element, elementProps);
    }

    function updateHasFill(value: boolean) {
        setHasFill(value);
        const color = fillColor !== "none" ? fillColor : "#ffffff";
        setFillColor(color);
        props.selectedElements.forEach(element => {
            updateElement<ClosedFigureStyleProps>(element, { ...element.props, style: { ...element.props.style, fill: value ? color : "none" } });
        });
    }

    function updateFillColor(value: string) {
        setFillColor(value);
        props.selectedElements.forEach(element => {
            updateElement<ClosedFigureStyleProps>(element, { ...element.props, style: { ...element.props.style, fill: value } });
        });
    }

    function updateHasStroke(value: boolean) {
        setHasStroke(value);
        const color = strokeColor !== "none" ? strokeColor : "#000000";
        setStrokeColor(color);
        props.selectedElements.forEach(element => {
            updateElement<ClosedFigureStyleProps>(element, { ...element.props, style: { ...element.props.style, stroke: value ? color : "none" } });
        });
    }

    function updateStrokeColor(value: string) {
        setStrokeColor(value);
        props.selectedElements.forEach(element => {
            updateElement<ClosedFigureStyleProps>(element, { ...element.props, style: { ...element.props.style, stroke: value } });
        });
    }

    function updateStrokeWidth(value: string) {
        setStrokeWidth(value);
        let strokeWidth = parseFloat(value);
        strokeWidth = isNaN(strokeWidth) ? 0 : strokeWidth / props.unitMultiplier;
        props.selectedElements.forEach(element => {
            updateElement<ClosedFigureStyleProps>(element, { ...element.props, style: { ...element.props.style, strokeWidth: strokeWidth } });
        });
    }

    function updateStrokeStyle(value: string) {
        setStrokeStyle(value);
        const strokeStyle = STROKE_STYLES.find(x => x.name === value);
        if (strokeStyle) {
            props.selectedElements.forEach(element => {
                updateElement<ClosedFigureStyleProps>(element, { ...element.props, style: { ...element.props.style, strokeDasharray: strokeStyle.dasharray } });
            });
        }
    }

    function updateHasText(value: boolean) {
        setHasText(value);
        const color = textColor !== "none" ? textColor : "#000000";
        setTextColor(color);
        props.selectedElements.forEach(element => {
            updateElement<TextStyleProps>(element, { ...element.props, textStyle: { ...element.props.textStyle, fill: value ? color : "none" } });
        });
    }

    function updateFontFamily(value: string) {
        setFontFamily(value);
        const fontFamily = value === DEFAULT_FONT_FAMILY ? undefined : value;
        props.selectedElements.forEach(element => {
            updateElement<TextStyleProps>(element, { ...element.props, textStyle: { ...element.props.textStyle, fontFamily: fontFamily } });
        });
    }

    function updateFontBold(value: boolean) {
        setFontBold(value);
        props.selectedElements.forEach(element => {
            updateElement<TextStyleProps>(element, { ...element.props, textStyle: { ...element.props.textStyle, fontWeight: value ? "bold" : undefined } });
        });
    }

    function updateFontItalic(value: boolean) {
        setFontItalic(value);
        props.selectedElements.forEach(element => {
            updateElement<TextStyleProps>(element, { ...element.props, textStyle: { ...element.props.textStyle, fontStyle: value ? "italic" : undefined } });
        });
    }

    function updateFontUnderline(value: boolean) {
        setFontUnderline(value);
        props.selectedElements.forEach(element => {
            updateElement<TextStyleProps>(element, { ...element.props, textStyle: { ...element.props.textStyle, textDecoration: value ? "underline" : undefined } });
        });
    }

    function updateTextColor(value: string) {
        setTextColor(value);
        props.selectedElements.forEach(element => {
            updateElement<TextStyleProps>(element, { ...element.props, textStyle: { ...element.props.textStyle, fill: value } });
        });
    }

    function updateFontSize(value: string) {
        setFontSize(value);
        let fontSize = parseFloat(value);
        fontSize = isNaN(fontSize) ? 0 : fontSize / props.unitMultiplier;
        props.selectedElements.forEach(element => {
            updateElement<TextStyleProps>(element, { ...element.props, textStyle: { ...element.props.textStyle, fontSize: fontSize } });
        });
    }

    function updateTextAligh(value: string) {
        setTextAlign(value);
        props.selectedElements.forEach(element => {
            updateElement<TextStyleProps>(element, { ...element.props, textStyle: { ...element.props.textStyle, textAlign: value } });
        });
    }

    function updateTextVAligh(value: string) {
        setTextVAlign(value);
        props.selectedElements.forEach(element => {
            updateElement<TextStyleProps>(element, { ...element.props, textStyle: { ...element.props.textStyle, verticalAlign: value } });
        });
    }

    return (
        <>
            {props.selectedElements.length ? <>
                <Accordion disableGutters={true} defaultExpanded={true}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <FormControlLabel onClick={e => e.stopPropagation()} control={<Checkbox checked={hasFill} onChange={(e, checked) => updateHasFill(checked)} />} label="Fill" />
                    </AccordionSummary>
                    <AccordionDetails>
                        <ColorInput 
                            fullWidth variant="outlined" size="small" margin="dense"
                            label="Fill color"
                            disabled={!hasFill}
                            value={fillColor}
                            onChange={updateFillColor}
                        />
                    </AccordionDetails>
                </Accordion>
                <Accordion disableGutters={true}  defaultExpanded={true}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <FormControlLabel onClick={e => e.stopPropagation()} control={<Checkbox checked={hasStroke} onChange={(e, checked) => updateHasStroke(checked)} />} label="Line" />
                    </AccordionSummary>
                    <AccordionDetails>
                        <ColorInput 
                            fullWidth variant="outlined" size="small" margin="dense"
                            label="Line color"
                            disabled={!hasStroke}
                            value={strokeColor}
                            onChange={updateStrokeColor}
                        />
                        <TextField 
                            fullWidth variant="outlined" size="small" margin="dense"
                            label="Line width"
                            disabled={!hasStroke}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">mm</InputAdornment>  
                            }}
                            value={strokeWidth}
                            onChange={(e) => updateStrokeWidth(e.target.value)}
                            sx={{backgroundColor: "background.default"}}
                        />
                        <FormControl fullWidth variant="outlined" size="small" margin="dense" disabled={!hasStroke} sx={{backgroundColor: "background.default"}}>
                            <InputLabel id="line-style-label">Line Style</InputLabel>
                            <Select
                                labelId="line-style-label"
                                label="Line style"
                                value={strokeStyle}
                                onChange={(e) => updateStrokeStyle(e.target.value)}
                            >
                                {STROKE_STYLES.map(strokeStyle => (
                                    <MenuItem key={strokeStyle.name} value={strokeStyle.name}>{strokeStyle.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </AccordionDetails>
                </Accordion>
                <Accordion disableGutters={true}  defaultExpanded={true}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <FormControlLabel onClick={e => e.stopPropagation()} control={<Checkbox checked={hasText} onChange={(e, checked) => updateHasText(checked)} />} label="Text" />
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormControl fullWidth variant="outlined" size="small" margin="dense" disabled={!hasText} sx={{backgroundColor: "background.default"}}>
                            <InputLabel id="font-family-label">Font family</InputLabel>
                            <Select
                                labelId="font-family-label"
                                label="Font family"
                                value={fontFamily}
                                onChange={(e) => updateFontFamily(e.target.value)}
                            >
                                <MenuItem value={DEFAULT_FONT_FAMILY}>{DEFAULT_FONT_FAMILY}</MenuItem>
                                <Divider />
                                {FONT_FAMILIES.map(fontFamily => (
                                    <MenuItem key={fontFamily} value={fontFamily} style={{fontFamily: fontFamily}}>{fontFamily}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormGroup>
                            <FormControlLabel disabled={!hasText} control={<Checkbox checked={fontBold} onChange={(e, checked) => updateFontBold(checked)} />} label="Bold" />
                            <FormControlLabel disabled={!hasText} control={<Checkbox checked={fontItalic} onChange={(e, checked) => updateFontItalic(checked)} />} label="Italic" />
                            <FormControlLabel disabled={!hasText} control={<Checkbox checked={fontUnderline} onChange={(e, checked) => updateFontUnderline(checked)} />} label="Underline" />
                        </FormGroup>
                        <TextField 
                            fullWidth variant="outlined" size="small" margin="dense"
                            label="Font size"
                            disabled={!hasText}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">mm</InputAdornment>  
                            }}
                            value={fontSize}
                            onChange={(e) => updateFontSize(e.target.value)}
                            sx={{backgroundColor: "background.default"}}
                        />
                        <FormControl fullWidth variant="outlined" size="small" margin="dense" disabled={!hasText} sx={{backgroundColor: "background.default"}}>
                            <InputLabel id="text-align-label">Text alignment</InputLabel>
                            <Select
                                labelId="text-align-label"
                                label="Text alignment"
                                value={textAlign}
                                onChange={(e) => updateTextAligh(e.target.value)}
                            >
                                {TEXT_ALIGNS.map(textAlign => (
                                    <MenuItem key={textAlign} value={textAlign.toLowerCase()}>{textAlign}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth variant="outlined" size="small" margin="dense" disabled={!hasText} sx={{backgroundColor: "background.default"}}>
                            <InputLabel id="text-valign-label">Vertical alignment</InputLabel>
                            <Select
                                labelId="text-valign-label"
                                label="Vertical alignment"
                                value={textVAlign}
                                onChange={(e) => updateTextVAligh(e.target.value)}
                            >
                                {TEXT_V_ALIGNS.map(textVAlign => (
                                    <MenuItem key={textVAlign} value={textVAlign.toLowerCase()}>{textVAlign}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <ColorInput 
                            fullWidth variant="outlined" size="small" margin="dense"
                            label="Text color"
                            disabled={!hasText}
                            value={textColor}
                            onChange={updateTextColor}
                        />
                    </AccordionDetails>
                </Accordion>
            </>
            : <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="subtitle2">Please select elements to edit their properties</Typography>
            </Box>}
        </>
    );
}

const DiagramPropertiesPanel = (props: DiagramPropertiesPanelProps) => {
    const [ currentTab, setCurrentTab ] = useState(0);

    return (
        <>
            <Tabs value={currentTab} onChange={(e, value) => setCurrentTab(value)}>
                <Tab label="Elements"></Tab>
                <Tab label="Diagram"></Tab>
            </Tabs>
            <TabPanel value={currentTab} index={0}>
                <ElementsPropertiesTab {...props} />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
                <DiagramPropertiesTab {...props} />
            </TabPanel>
        </>
    );
}

export default DiagramPropertiesPanel;