import { useState } from "react";
import { AppBar, Button, IconButton, Menu, MenuItem, Popover, Toolbar } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import { CompactPicker } from 'react-color';
import { InteractionController } from "@carnelian/interaction";
import { ClosedFigureStyleProps } from "@carnelian/shapes/basic";
import { Diagram, DiagramElementNode, DiagramElementProps } from "@carnelian/diagram";

interface DiagramToolbarProps {
    diagram: Diagram;
    controller: InteractionController;
    scale: number;
    onScaleChange: (value: number) => void;
}

function DiagramToolbar(props: DiagramToolbarProps) {
    const scaleOptions = [25, 50, 100, 200, 500];

    const [scaleMenuAnchorEl, setScaleMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [colorPopoverAnchorEl, setColorPopoverAnchorEl] = useState<null | HTMLElement>(null);
    const [color, setColor] = useState<string>("black");
    const [colorProperty, setColorProperty] = useState<"fill" | "stroke">("fill");

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
            </Toolbar>
        </AppBar>
    )
}

export default DiagramToolbar;