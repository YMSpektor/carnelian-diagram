import { useState } from "react";
import { InteractionController, isGridSnappingService, isPaperService, Paper } from "@carnelian-diagram/interaction";
import { Accordion, AccordionDetails, AccordionSummary, Box, FormControl, FormControlLabel, FormLabel, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select, Tab, Tabs, TextField, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TabPanel from "./TabPanel";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";

export interface DiagramPropertiesPanelProps {
    controller: InteractionController;
    unitMultiplier: number;
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

const DiagramPropertiesPanel = (props: DiagramPropertiesPanelProps) => {
    const paperService = props.controller.getService(isPaperService);
    const gridSnappingService = props.controller.getService(isGridSnappingService);

    const [ currentTab, setCurrentTab ] = useState(0);
    const [ pageOrientation, setPageOrientation ] = useState(getPageOrientation());
    const [ pageSize, setPageSize ] = useState(PAGE_SIZES.find(x => 
        getPaperWidth(x) === paperService?.paper?.width && 
        getPaperHeight(x) === paperService?.paper?.height));
    const [ displayGrid, setDisplayGrid ] = useState(!!paperService?.paper?.majorGridSize || !!paperService?.paper?.minorGridSize);
    const [ majorGridSize, setMajorGridSize ] = useState<string>(((paperService?.paper?.majorGridSize || 0) * props.unitMultiplier).toString());
    const [ minorGridSize, setMinorGridSize ] = useState<string>(((paperService?.paper?.minorGridSize || 0) * props.unitMultiplier).toString());
    const [ snapToGrid, setSnapToGrid ] = useState(!!gridSnappingService?.snapGridSize || !!gridSnappingService?.snapAngle);
    const [ snapGridSize, setSnapGridSize ] = useState<string>(((gridSnappingService?.snapGridSize || 0) * props.unitMultiplier).toString());
    const [ snapAngle, setSnapAngle ] = useState<string>((gridSnappingService?.snapAngle || 0).toString());


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
        gridSize = isNaN(gridSize) ? 0 : gridSize;
        if (paperService?.paper) {
            paperService.paper = {
                ...paperService.paper, 
                minorGridSize: value ? gridSize / props.unitMultiplier : undefined, 
            };
            props.onPaperChange(paperService.paper);
        }
    }

    function updateMajorGridSize(value: string) {
        setMajorGridSize(value);
        let gridSize = parseFloat(value);
        gridSize = isNaN(gridSize) ? 0 : gridSize;
        if (paperService?.paper) {
            paperService.paper = {
                ...paperService.paper, 
                majorGridSize: value ? gridSize / props.unitMultiplier : undefined, 
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
        gridSize = isNaN(gridSize) ? 0 : gridSize;
        if (gridSnappingService) {
            gridSnappingService.snapGridSize = value ? gridSize / props.unitMultiplier : undefined;
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
            <Tabs value={currentTab} onChange={(e, value) => setCurrentTab(value)}>
                <Tab label="Elements"></Tab>
                <Tab label="Diagram"></Tab>
            </Tabs>
            <TabPanel value={currentTab} index={0}>
                <Box sx={{ p: 3, textAlign: "center" }}>
                    <Typography variant="subtitle2">Please select elements to edit their properties</Typography>
                </Box>
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
                <Accordion disableGutters={true}>
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
                <Accordion disableGutters={true}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Grid and snapping</Typography>
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
            </TabPanel>
        </>
    );
}

export default DiagramPropertiesPanel;