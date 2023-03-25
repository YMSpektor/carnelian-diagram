import { useState } from "react";
import { AppBar, Button, Menu, MenuItem, Toolbar } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface DiagramToolbarProps {
    scale: number;
    onScaleChange: (value: number) => void;
}

function DiagramToolbar(props: DiagramToolbarProps) {
    const scaleOptions = [25, 50, 100, 200, 500];

    const [scaleMenuAnchorEl, setScaleMenuAnchorEl] = useState<null | HTMLElement>(null);
    const closeScaleMenu = (value?: number) => {
        if (value !== undefined) {
            props.onScaleChange(value);
        }
        setScaleMenuAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Button sx={{ color: 'inherit' }} endIcon={<KeyboardArrowDownIcon />} onClick={(e) => setScaleMenuAnchorEl(e.currentTarget)}>
                    {props.scale}%
                </Button>
                <Menu 
                    anchorEl={scaleMenuAnchorEl} 
                    open={!!scaleMenuAnchorEl} 
                    onClose={() => closeScaleMenu()} 
                >
                    {scaleOptions.map(scale => (
                        <MenuItem key={scale} onClick={() => closeScaleMenu(scale)}>{scale}%</MenuItem>
                    ))}
                </Menu>
            </Toolbar>
        </AppBar>
    )
}

export default DiagramToolbar;