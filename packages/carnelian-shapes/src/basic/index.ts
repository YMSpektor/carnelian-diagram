import { Point } from "@carnelian/interaction/geometry";

export * from "./line";
export * from "./polyline";
export * from "./polygon";
export * from "./rect";
export * from "./ellipse";
export * from "./diamond";
export * from "./rounded-rect";
export * from "./parallelogram";
export * from "./trapezoid";
export * from "./hexagon";
export * from "./square";
export * from "./circle";
export * from "./donut";
export * from "./cross";
export * from "./pie";

export interface LineFigureStyleProps {
    style?: {
        stroke?: string;
    }
}

export interface ClosedFigureStyleProps {
    style?: {
        stroke?: string;
        fill?: string;
    }
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

export interface LineBaseProps extends RawLineProps, LineFigureStyleProps {}
export interface PolylineBaseProps extends RawPolylineProps, LineFigureStyleProps {}

export interface RectBaseProps extends RawRectProps, ClosedFigureStyleProps {}
export interface SquareBaseProps extends RawSquareProps, ClosedFigureStyleProps {}
export interface CircleBaseProps extends RawCircleProps, ClosedFigureStyleProps {}
export interface PolygonBaseProps extends RawPolylineProps, ClosedFigureStyleProps {}