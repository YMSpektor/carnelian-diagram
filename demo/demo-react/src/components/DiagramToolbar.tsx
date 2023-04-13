import { useState } from "react";
import { AppBar, Button, IconButton, Menu, MenuItem, Popover, SvgIcon, ToggleButton, ToggleButtonGroup, Toolbar } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import { CompactPicker } from 'react-color';
import { DrawingModeElementFactory, InteractionController } from "@carnelian/interaction";
import { ClosedFigureStyleProps } from "@carnelian/shapes/basic";
import { Diagram, DiagramElementNode, DiagramElementProps } from "@carnelian/diagram";
import {
    InteractiveLine as Line
} from "@carnelian/shapes/basic";

interface DiagramToolbarProps {
    diagram: Diagram;
    controller: InteractionController;
    scale: number;
    onScaleChange: (value: number) => void;
}

function DefaultCursorIcon() {
    return (
        <SvgIcon>
            <path d="M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z" />
        </SvgIcon>
    );
}

function LineIcon() {
    return (
        <SvgIcon>
            <path d="M15,3V7.59L7.59,15H3V21H9V16.42L16.42,9H21V3M17,5H19V7H17M5,17H7V19H5" />
        </SvgIcon>
    );
}

function DiagramToolbar(props: DiagramToolbarProps) {
    const scaleOptions = [25, 50, 100, 200, 500];

    const [scaleMenuAnchorEl, setScaleMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [colorPopoverAnchorEl, setColorPopoverAnchorEl] = useState<null | HTMLElement>(null);
    const [color, setColor] = useState<string>("black");
    const [colorProperty, setColorProperty] = useState<"fill" | "stroke">("fill");
    const [drawingMode, setDrawingMode] = useState("");

    function updateElement<T>(element: DiagramElementNode<T>, elementProps: DiagramElementProps<T>) {
        props.diagram.update(element, elementProps);
    }

    const closeScaleMenu = (value?: number) => {
        if (value !== undefined) {
            props.onScaleChange(value);
        }
        setScaleMenuAnchorEl(null);
    };

    const colorToHex = (color: string) => {
        var ctx = document.createElement('canvas').getContext('2d')
        if (ctx) {
            ctx.fillStyle = color;
            return ctx.fillStyle;
        }
        return color;
    }

    const setElementColor = (color: string) => {
        setColor(color);
        props.controller.getSelectedElements().forEach(element => {
            updateElement<ClosedFigureStyleProps>(element, {...element.props, style: {...element.props.style, [colorProperty]: color}});
        });
    }

    const openBorderColorPicker = (anchor: HTMLElement) => {
        const color = (props.controller.getSelectedElements()[0]?.props as ClosedFigureStyleProps)?.style?.stroke || "black";
        setColor(colorToHex(color));
        setColorPopoverAnchorEl(anchor);
        setColorProperty("stroke");
    }
    
    const openBackgroundColorPicker = (anchor: HTMLElement) => {
        const color = (props.controller.getSelectedElements()[0]?.props as ClosedFigureStyleProps)?.style?.fill || "white";
        setColor(colorToHex(color));
        setColorPopoverAnchorEl(anchor);
        setColorProperty("fill");
    }
    
    const closeColorPopover = () => {
        setColorPopoverAnchorEl(null);
    }

    function zoom(sign: number) {
        let value: number;
        if (props.scale < 25 - Math.min(0, sign)) {
            value = 5;
        }
        else if (props.scale < 100 - Math.min(0, sign)) {
            value = 25;
        }
        else if (props.scale < 300 - Math.min(0, sign)) {
            value = 50
        }
        else {
            value = 100
        }
        props.onScaleChange(Math.max(props.scale + value * sign, 5));
    }

    const lineFactory: DrawingModeElementFactory = (diagram, x, y) => {
        return diagram.add(Line, {x1: x, y1: y, x2: x, y2: y});
    }

    function changeDrawinMode(e: React.MouseEvent<HTMLElement>, value: string) {
        switch (value) {
            case "line": 
                props.controller.switchDrawingMode(lineFactory);
                break;
            default:
                props.controller.switchDrawingMode(null);
        }
        setDrawingMode(value);
    }

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
                <IconButton color="inherit" onClick={(e) => zoom(1)}>
                    <ZoomInIcon />
                </IconButton>
                <IconButton color="inherit" onClick={(e) => zoom(-1)}>
                    <ZoomOutIcon />
                </IconButton>
                <IconButton color="inherit" onClick={(e) => openBorderColorPicker(e.currentTarget)}>
                    <BorderColorIcon />
                </IconButton>
                <IconButton color="inherit" onClick={(e) => openBackgroundColorPicker(e.currentTarget)}>
                    <FormatColorFillIcon />
                </IconButton>
                <IconButton color="inherit">
                    <LineWeightIcon />
                </IconButton>
                <Popover
                    anchorEl={colorPopoverAnchorEl} 
                    open={!!colorPopoverAnchorEl} 
                    onClose={() => closeColorPopover()}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <CompactPicker color={color} onChange={(color) => setElementColor(color.hex)} />
                </Popover>
                <ToggleButtonGroup exclusive value={drawingMode} onChange={changeDrawinMode}>
                    <ToggleButton value="" sx={{color: "inherit !important"}}>
                        <DefaultCursorIcon />
                    </ToggleButton>
                    <ToggleButton value="line" sx={{color: "inherit !important"}}>
                        <LineIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Toolbar>
        </AppBar>
    )
}

export default DiagramToolbar;