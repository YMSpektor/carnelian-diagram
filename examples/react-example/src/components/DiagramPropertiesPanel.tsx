import { useState } from "react";
import { InteractionController } from "@carnelian-diagram/interaction";
import { Accordion, AccordionDetails, AccordionSummary, Box, FormControl, FormControlLabel, FormLabel, InputLabel, Radio, RadioGroup, Select, Tab, Tabs, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TabPanel from "./TabPanel";

export interface DiagramPropertiesPanelProps {
    controller: InteractionController;
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
                            >
                                
                            </Select>
                        </FormControl>
                        <FormControl fullWidth variant="outlined" size="small">
                            <FormLabel id="page-orientation-label">Orientation</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="page-orientation-label"
                                name="page-orientation-radio-buttons-group"
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