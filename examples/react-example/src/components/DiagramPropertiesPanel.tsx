import { useState } from "react";
import { InteractionController, isGridSnappingService, isPaperService, Paper } from "@carnelian-diagram/interactivity";
import { allLineCapNames } from "@carnelian-diagram/shapes/line-caps";
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, FormControl, FormControlLabel, FormLabel, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select, Tab, Tabs, TextField, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TabPanel from "./TabPanel";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import { Diagram } from "@carnelian-diagram/core";
import ColorInput from "./ColorInput";
import { DEFAULT_FONT_FAMILY } from "@carnelian-diagram/shapes";
import { ShapeMetadata } from "../diagram/shape-metadata";

export interface ElementStyle {
    hasFill?: boolean;
    fillColor?: string;
    hasStroke?: boolean;
    strokeColor?: string;
    strokeWidth?: string;
    strokeDasharray?: string;
    startLineCap?: string;
    endLineCap?: string;
    hasText?: boolean;
    textColor?: string;
    fontFamily?: string;
    fontSize?: string;
    fontBold?: boolean;
    fontItalic?: boolean;
    fontUnderline?: boolean;
    textAlign?: string;
    textVAlign?: string; 
}

export interface DiagramPropertiesPanelProps {
    diagram: Diagram;
    controller: InteractionController;
    unitMultiplier: number;
    elementStyle: ElementStyle | null;
    elementMetadata: ShapeMetadata | null;
    onElementChange: (elementStyle: ElementStyle) => void;
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
const FONT_FAMILIES: string[] = ["Arial", "Comic Sans MS", "Courier New", "Garamond", "Lucida Console", "Tahoma", "Times New Roman"];
const TEXT_ALIGNS: string[] = ["Left", "Center", "Right"];
const TEXT_V_ALIGNS: string[] = ["Top", "Middle", "Bottom"];

interface LineCap {
    name: string;
    value: string;
}

const NONE_LINE_CAP = "None";
const LINE_CAPS: LineCap[] = [{name: NONE_LINE_CAP, value: ""}].concat(allLineCapNames().map(x => ({
    name: x.charAt(0).toUpperCase() + x.slice(1),
    value: x
})));

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

const ElementsPropertiesTab = (props: DiagramPropertiesPanelProps) => {
    function getStrokeStyle() {
        return STROKE_STYLES.find(x => x.dasharray === props.elementStyle?.strokeDasharray)?.name || SOLID_STROKE_STYLE;
    }

    function getStartLineCap() {
        return LINE_CAPS.find(x => x.value === props.elementStyle?.startLineCap)?.name || NONE_LINE_CAP;
    }

    function getEndLineCap() {
        return LINE_CAPS.find(x => x.value === props.elementStyle?.endLineCap)?.name || NONE_LINE_CAP;
    }

    function updateHasFill(value: boolean) {
        props.onElementChange({
            ...props.elementStyle,
            hasFill: value,
            fillColor: props.elementStyle?.fillColor !== "none" ? props.elementStyle?.fillColor : "#ffffff"
        });
    }

    function updateFillColor(value: string) {
        props.onElementChange({
            ...props.elementStyle,
            fillColor: value
        });
    }

    function updateHasStroke(value: boolean) {
        props.onElementChange({
            ...props.elementStyle,
            hasStroke: value,
            strokeColor: props.elementStyle?.strokeColor !== "none" ? props.elementStyle?.strokeColor : "#000000"
        });
    }

    function updateStrokeColor(value: string) {
        props.onElementChange({
            ...props.elementStyle,
            strokeColor: value
        });
    }

    function updateStrokeWidth(value: string) {
        props.onElementChange({
            ...props.elementStyle,
            strokeWidth: value
        });
    }

    function updateStrokeStyle(value: string) {
        const strokeStyle = STROKE_STYLES.find(x => x.name === value);
        props.onElementChange({
            ...props.elementStyle,
            strokeDasharray: strokeStyle?.dasharray
        });
    }

    function updateStartLineCap(value: string) {
        const lineCap = LINE_CAPS.find(x => x.name === value);
        props.onElementChange({
            ...props.elementStyle,
            startLineCap: lineCap?.value
        });
    }

    function updateEndLineCap(value: string) {
        const lineCap = LINE_CAPS.find(x => x.name === value);
        props.onElementChange({
            ...props.elementStyle,
            endLineCap: lineCap?.value
        });
    }

    function updateHasText(value: boolean) {
        props.onElementChange({
            ...props.elementStyle,
            hasText: value,
            strokeColor: props.elementStyle?.textColor !== "none" ? props.elementStyle?.textColor : "#000000"
        });
    }

    function updateFontFamily(value: string) {
        props.onElementChange({
            ...props.elementStyle,
            fontFamily: value === DEFAULT_FONT_FAMILY ? undefined : value
        });
    }

    function updateFontBold(value: boolean) {
        props.onElementChange({
            ...props.elementStyle,
            fontBold: value
        });
    }

    function updateFontItalic(value: boolean) {
        props.onElementChange({
            ...props.elementStyle,
            fontItalic: value
        });
    }

    function updateFontUnderline(value: boolean) {
        props.onElementChange({
            ...props.elementStyle,
            fontUnderline: value
        });
    }

    function updateTextColor(value: string) {
        props.onElementChange({
            ...props.elementStyle,
            textColor: value
        });
    }

    function updateFontSize(value: string) {
        props.onElementChange({
            ...props.elementStyle,
            fontSize: value
        });
    }

    function updateTextAligh(value: string) {
        props.onElementChange({
            ...props.elementStyle,
            textAlign: value
        });
    }

    function updateTextVAligh(value: string) {
        props.onElementChange({
            ...props.elementStyle,
            textVAlign: value
        });
    }

    return (
        <>
            {props.elementStyle ? <>
                {props.elementMetadata?.hasFill && <Accordion disableGutters={true} defaultExpanded={true}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <FormControlLabel onClick={e => e.stopPropagation()} control={<Checkbox checked={props.elementStyle.hasFill} onChange={(e, checked) => updateHasFill(checked)} />} label="Fill" />
                    </AccordionSummary>
                    <AccordionDetails>
                        <ColorInput 
                            fullWidth variant="outlined" size="small" margin="dense"
                            label="Fill color"
                            disabled={!props.elementStyle.hasFill}
                            value={props.elementStyle.fillColor}
                            onChange={updateFillColor}
                        />
                    </AccordionDetails>
                </Accordion>}
                {props.elementMetadata?.hasStroke && <Accordion disableGutters={true}  defaultExpanded={true}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <FormControlLabel onClick={e => e.stopPropagation()} control={<Checkbox checked={props.elementStyle.hasStroke} onChange={(e, checked) => updateHasStroke(checked)} />} label="Line" />
                    </AccordionSummary>
                    <AccordionDetails>
                        <ColorInput 
                            fullWidth variant="outlined" size="small" margin="dense"
                            label="Line color"
                            disabled={!props.elementStyle.hasStroke}
                            value={props.elementStyle.strokeColor}
                            onChange={updateStrokeColor}
                        />
                        <TextField 
                            fullWidth variant="outlined" size="small" margin="dense"
                            label="Line width"
                            disabled={!props.elementStyle.hasStroke}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">mm</InputAdornment>  
                            }}
                            value={props.elementStyle.strokeWidth}
                            onChange={(e) => updateStrokeWidth(e.target.value)}
                            sx={{backgroundColor: "background.default"}}
                        />
                        <FormControl fullWidth variant="outlined" size="small" margin="dense" disabled={!props.elementStyle.hasStroke} sx={{backgroundColor: "background.default"}}>
                            <InputLabel id="line-style-label">Line style</InputLabel>
                            <Select
                                labelId="line-style-label"
                                label="Line style"
                                value={getStrokeStyle()}
                                onChange={(e) => updateStrokeStyle(e.target.value)}
                            >
                                {STROKE_STYLES.map(strokeStyle => (
                                    <MenuItem key={strokeStyle.name} value={strokeStyle.name}>{strokeStyle.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {props.elementMetadata?.hasLineCaps && <>
                            <FormControl fullWidth variant="outlined" size="small" margin="dense" disabled={!props.elementStyle.hasStroke} sx={{backgroundColor: "background.default"}}>
                                <InputLabel id="start-line-cap-label">Start line cap</InputLabel>
                                <Select
                                    labelId="start-line-cap-label"
                                    label="Start line cap"
                                    value={getStartLineCap()}
                                    onChange={(e) => updateStartLineCap(e.target.value)}
                                >
                                    {LINE_CAPS.map(lineCap => (
                                        <MenuItem key={lineCap.name} value={lineCap.name}>{lineCap.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth variant="outlined" size="small" margin="dense" disabled={!props.elementStyle.hasStroke} sx={{backgroundColor: "background.default"}}>
                                <InputLabel id="end-line-cap-label">End line cap</InputLabel>
                                <Select
                                    labelId="end-line-cap-label"
                                    label="End line cap"
                                    value={getEndLineCap()}
                                    onChange={(e) => updateEndLineCap(e.target.value)}
                                >
                                    {LINE_CAPS.map(lineCap => (
                                        <MenuItem key={lineCap.name} value={lineCap.name}>{lineCap.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </>}
                    </AccordionDetails>
                </Accordion>}
                {props.elementMetadata?.hasText && <Accordion disableGutters={true}  defaultExpanded={true}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <FormControlLabel onClick={e => e.stopPropagation()} control={<Checkbox checked={props.elementStyle.hasText} onChange={(e, checked) => updateHasText(checked)} />} label="Text" />
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormControl fullWidth variant="outlined" size="small" margin="dense" disabled={!props.elementStyle.hasText} sx={{backgroundColor: "background.default"}}>
                            <InputLabel id="font-family-label">Font family</InputLabel>
                            <Select
                                labelId="font-family-label"
                                label="Font family"
                                value={props.elementStyle.fontFamily || DEFAULT_FONT_FAMILY}
                                onChange={(e) => updateFontFamily(e.target.value)}
                            >
                                <MenuItem value={DEFAULT_FONT_FAMILY}>[Default]</MenuItem>
                                <Divider />
                                {FONT_FAMILIES.map(fontFamily => (
                                    <MenuItem key={fontFamily} value={fontFamily} style={{fontFamily: fontFamily}}>{fontFamily}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormGroup>
                            <FormControlLabel disabled={!props.elementStyle.hasText} control={<Checkbox checked={props.elementStyle.fontBold} onChange={(e, checked) => updateFontBold(checked)} />} label="Bold" />
                            <FormControlLabel disabled={!props.elementStyle.hasText} control={<Checkbox checked={props.elementStyle.fontItalic} onChange={(e, checked) => updateFontItalic(checked)} />} label="Italic" />
                            <FormControlLabel disabled={!props.elementStyle.hasText} control={<Checkbox checked={props.elementStyle.fontUnderline} onChange={(e, checked) => updateFontUnderline(checked)} />} label="Underline" />
                        </FormGroup>
                        <TextField 
                            fullWidth variant="outlined" size="small" margin="dense"
                            label="Font size"
                            disabled={!props.elementStyle.hasText}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">mm</InputAdornment>  
                            }}
                            value={props.elementStyle.fontSize}
                            onChange={(e) => updateFontSize(e.target.value)}
                            sx={{backgroundColor: "background.default"}}
                        />
                        <FormControl fullWidth variant="outlined" size="small" margin="dense" disabled={!props.elementStyle.hasText} sx={{backgroundColor: "background.default"}}>
                            <InputLabel id="text-align-label">Text alignment</InputLabel>
                            <Select
                                labelId="text-align-label"
                                label="Text alignment"
                                value={props.elementStyle.textAlign}
                                onChange={(e) => updateTextAligh(e.target.value)}
                            >
                                {TEXT_ALIGNS.map(textAlign => (
                                    <MenuItem key={textAlign} value={textAlign.toLowerCase()}>{textAlign}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth variant="outlined" size="small" margin="dense" disabled={!props.elementStyle.hasText} sx={{backgroundColor: "background.default"}}>
                            <InputLabel id="text-valign-label">Vertical alignment</InputLabel>
                            <Select
                                labelId="text-valign-label"
                                label="Vertical alignment"
                                value={props.elementStyle.textVAlign}
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
                            disabled={!props.elementStyle.hasText}
                            value={props.elementStyle.textColor}
                            onChange={updateTextColor}
                        />
                    </AccordionDetails>
                </Accordion>}
            </>
            : <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="subtitle1">No elements selected</Typography>
            </Box>}
        </>
    );
}

const DiagramPropertiesPanel = (props: DiagramPropertiesPanelProps) => {
    const [ currentTab, setCurrentTab ] = useState(0);

    return (
        <>
            <Tabs value={currentTab} onChange={(e, value) => setCurrentTab(value)} sx={{paddingLeft: 1}}>
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