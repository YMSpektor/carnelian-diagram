import { useState } from "react";
import { InteractionController, isPaperService, Paper } from "@carnelian-diagram/interaction";
import { Accordion, AccordionDetails, AccordionSummary, Box, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Tab, Tabs, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TabPanel from "./TabPanel";

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

    const [ currentTab, setCurrentTab ] = useState(0);
    const [ pageOrientation, setPageOrientation ] = useState(getPageOrientation());
    const [ pageSize, setPageSize ] = useState(PAGE_SIZES.find(x => 
        getPaperWidth(x) === paperService?.paper?.width && 
        getPaperHeight(x) === paperService?.paper?.height));

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
                        <FormControl fullWidth variant="outlined" size="small" sx={{backgroundColor: "background.default", mb: 2}}>
                            <InputLabel id="page-size-label">Page size</InputLabel>
                            <Select
                                labelId="page-size-label"
                                label="Page size"
                                value={pageSize?.name}
                                onChange={(e) => changePageSize(e.target.value)}
                            >
                                {PAGE_SIZES.map(ps => (
                                    <MenuItem value={ps.name}>{ps.name} ({ps.width} mm x {ps.height} mm)</MenuItem>
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
                        <Typography>Grid snapping</Typography>
                    </AccordionSummary>
                    <AccordionDetails>

                    </AccordionDetails>
                </Accordion>
            </TabPanel>
        </>
    );
}

export default DiagramPropertiesPanel;