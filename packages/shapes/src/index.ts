import { Point } from "@carnelian-diagram/interactivity/geometry";
import { LineCapSyle } from "./line-caps";

export let DEFAULT_FONT_SIZE = "10px";
export let DEFAULT_FONT_FAMILY = "sans-serif";

export interface LineFigureStyle {
    stroke?: string;
    strokeWidth?: number | string;
    strokeDasharray?: string;
}

export interface ClosedFigureStyle extends LineFigureStyle {
    fill?: string;
}

export interface TextStyle extends ClosedFigureStyle {
    fontFamily?: string;
    fontSize?: string;
    fontStyle?: "normal" | "italic" | "oblique";
    fontVariant?: string;
    fontWeight?: number | "normal" | "bold" | "bolder" | "lighter";
    fontStretch?: string;
    textAlign?: "left" | "center" | "right";
    textDecoration?: string;
    verticalAlign?: "top" | "middle" | "bottom";
}

export interface MultilineTextStyle extends TextStyle {
    lineHeight?: number;
}

export interface LineFigureStyleProps {
    startLineCap?: LineCapSyle | null;
    endLineCap?: LineCapSyle | null;
    style?: LineFigureStyle;
}

export interface ClosedFigureStyleProps {
    style?: ClosedFigureStyle;
}

export interface TextStyleProps<T extends TextStyle = TextStyle> {
    textStyle?: T;
}

export interface RawLineProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export interface RawPolylineProps {
    points: Point[];
}

export interface RawRectProps {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface RawSquareProps {
    x: number;
    y: number;
    size: number;
}

export interface RawCircleProps {
    x: number;
    y: number;
    radius: number;
}

export interface RawTextProps {
    text: string;
}

export interface RawImageProps extends RawRectProps {
    href: string;
    preserveAspectRatio?: string;
    crossorigin?: string;
    decoding?: "sync" | "async" | "auto";
}

export interface RotatableElementProps {
    rotation?: number;
}

export interface LineBaseProps extends RawLineProps, LineFigureStyleProps {}
export interface PolylineBaseProps extends RawPolylineProps, LineFigureStyleProps {}

export interface RectBaseProps extends RawRectProps, ClosedFigureStyleProps {}
export interface SquareBaseProps extends RawSquareProps, ClosedFigureStyleProps {}
export interface CircleBaseProps extends RawCircleProps, ClosedFigureStyleProps {}
export interface PolygonBaseProps extends RawPolylineProps, ClosedFigureStyleProps {}
export interface ImageBaseProps extends RawImageProps {}

export interface TextBaseProps<T extends TextStyle> extends RawRectProps, RawTextProps, TextStyleProps<T> {}