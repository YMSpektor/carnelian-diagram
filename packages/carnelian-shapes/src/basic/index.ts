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

export interface ClosedFigureStyleProps {
    style?: {
        stroke?: string;
        fill?: string;
    }
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

export interface RectBaseProps extends RawRectProps, ClosedFigureStyleProps {}
export interface SquareBaseProps extends RawSquareProps, ClosedFigureStyleProps {}
export interface CircleBaseProps extends RawCircleProps, ClosedFigureStyleProps {}