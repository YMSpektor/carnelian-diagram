import { useCallback, useEffect, useState } from "react";
import { AppBar, Button, Divider, IconButton, Menu, MenuItem, Popover, SvgIcon, ToggleButton, ToggleButtonGroup, Toolbar } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import { CompactPicker } from 'react-color';
import { DrawingModeElementFactory, InteractionController } from "@carnelian/interaction";
import { ClosedFigureStyleProps } from "@carnelian/shapes/basic";
import { Diagram, DiagramElementNode, DiagramElementProps } from "@carnelian/diagram";
import {
    InteractiveLine as Line,
    InteractivePolyline as Polyline,
    InteractivePolygon as Polygon,
    InteractiveRect as Rect,
    InteractiveCircle as Circle,
} from "@carnelian/shapes/basic";

interface DiagramToolbarProps {
    diagram: Diagram;
    controller: InteractionController;
    scale: number;
    unit: string;
    unitMultiplier: number;
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

function PolylineIcon() {
    return (
        <SvgIcon>
            <path d="M2 3V9H4.95L6.95 15H6V21H12V16.41L17.41 11H22V5H16V9.57L10.59 15H9.06L7.06 9H8V3M4 5H6V7H4M18 7H20V9H18M8 17H10V19H8Z" />
        </SvgIcon>
    );
}

function PolygonIcon() {
    return (
        <SvgIcon>
            <path d="M22 8V2H16V5.8L14.4 8H9.6L8 5.8V2H2V8H4V16H2V22H8V20H16V22H22V16H20V8H22M11 10H13V12H11V10M4 4H6V6H4V4M6 20H4V18H6V20M16 18H8V16H6V8H7.1L9 10.6V14H15V10.6L16.9 8H18V16H16V18M20 20H18V18H20V20M18 6V4H20V6H18Z" />
        </SvgIcon>
    );
}

function RectIcon() {
    return (
        <SvgIcon>
            <path d="M2,4H8V6H16V4H22V10H20V14H22V20H16V18H8V20H2V14H4V10H2V4M16,10V8H8V10H6V14H8V16H16V14H18V10H16M4,6V8H6V6H4M18,6V8H20V6H18M4,16V18H6V16H4M18,16V18H20V16H18Z" />
        </SvgIcon>
    );
}

function DiagramToolbar(props: DiagramToolbarProps) {
    const scaleOptions = [25, 50, 100, 200, 500];
    const lineWeightOptions = [0.1, 0.25, 0.5, 1, 2, 5];

    const [scaleMenuAnchorEl, setScaleMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [colorPopoverAnchorEl, setColorPopoverAnchorEl] = useState<null | HTMLElement>(null);
    const [lineWeightMenuAnchorEl, setLineWeightMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [color, setColor] = useState<string>("black");
    const [colorProperty, setColorProperty] = useState<"fill" | "stroke">("fill");
    const [drawingMode, setDrawingMode] = useState("");

    const changeDrawinMode = useCallback((value: string) => {
        switch (value) {
            case "line":
                props.controller.switchDrawingMode(lineFactory);
                break;
            case "polyline":
                props.controller.switchDrawingMode(polylineFactory);
                break;
            case "polygon":
                props.controller.switchDrawingMode(polygonFactory);
                break;
            case "rect":
                props.controller.switchDrawingMode(rectFactory);
                break;
            case "circle":
                props.controller.switchDrawingMode(circleFactory);
                break;
            default:
                props.controller.switchDrawingMode(null);
        }
        setDrawingMode(value);
    }, [props.controller]);

    const drawElementHandler = useCallback(() => {
        changeDrawinMode("");
    }, [changeDrawinMode]);

    useEffect(() => {
        props.controller.onDrawElement.addListener(drawElementHandler);

        return () => {
            props.controller.onDrawElement.removeListener(drawElementHandler);
        }
    }, [props.controller, drawElementHandler])

    function updateElement<T>(element: DiagramElementNode<T>, elementProps: DiagramElementProps<T>) {
        props.diagram.update(element, elementProps);
    }

    const closeScaleMenu = (value?: number) => {
        if (value !== undefined) {
            props.onScaleChange(value);
        }
        setScaleMenuAnchorEl(null);
    };

    const closeLineWeightMenu = (value?: number | null) => {
        if (value !== undefined) {
            props.controller.getSelectedElements().forEach(element => {
                updateElement<ClosedFigureStyleProps>(element, { ...element.props, style: { ...element.props.style, "stroke-width": value !== null ? value / props.unitMultiplier : undefined } });
            });
        }
        setLineWeightMenuAnchorEl(null);
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
            updateElement<ClosedFigureStyleProps>(element, { ...element.props, style: { ...element.props.style, [colorProperty]: color } });
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
        return diagram.add(Line, { x1: x, y1: y, x2: x, y2: y });
    }

    const polylineFactory: DrawingModeElementFactory = (diagram, x, y) => {
        return diagram.add(Polyline, { points: [{ x, y }] });
    }

    const polygonFactory: DrawingModeElementFactory = (diagram, x, y) => {
        return diagram.add(Polygon, { points: [{ x, y }] });
    }

    const rectFactory: DrawingModeElementFactory = (diagram, x, y) => {
        return diagram.add(Rect, { x, y, width: 0, height: 0 });
    }

    const circleFactory: DrawingModeElementFactory = (diagram, x, y) => {
        return diagram.add(Circle, { x, y, radius: 0 });
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
                <IconButton color="inherit" onClick={(e) => setLineWeightMenuAnchorEl(e.currentTarget)}>
                    <LineWeightIcon />
                </IconButton>
                <Menu
                    anchorEl={lineWeightMenuAnchorEl}
                    open={!!lineWeightMenuAnchorEl}
                    onClose={() => closeLineWeightMenu()}
                >
                    <MenuItem onClick={() => closeLineWeightMenu(null)}>Default</MenuItem>
                    <Divider />
                    {lineWeightOptions.map(lineWeight => (
                        <MenuItem key={lineWeight} onClick={() => closeLineWeightMenu(lineWeight)}>{lineWeight} {props.unit}</MenuItem>
                    ))}
                </Menu>
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
                <ToggleButtonGroup exclusive size="small" value={drawingMode} onChange={(e, value) => changeDrawinMode(value)}>
                    <ToggleButton value="" sx={{ color: "inherit !important" }}>
                        <DefaultCursorIcon />
                    </ToggleButton>
                    <ToggleButton value="line" sx={{ color: "inherit !important" }}>
                        <LineIcon />
                    </ToggleButton>
                    <ToggleButton value="polyline" sx={{ color: "inherit !important" }}>
                        <PolylineIcon />
                    </ToggleButton>
                    <ToggleButton value="polygon" sx={{ color: "inherit !important" }}>
                        <PolygonIcon />
                    </ToggleButton>
                    <ToggleButton value="rect" sx={{ color: "inherit !important" }}>
                        <RectIcon />
                    </ToggleButton>
                    <ToggleButton value="circle" sx={{ color: "inherit !important" }}>
                        <CircleOutlinedIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Toolbar>
        </AppBar>
    )
}

export default DiagramToolbar;