export * from "./rect";
export * from "./ellipse";
export * from "./diamond";
export * from "./rounded-rect";
export * from "./parallelogram";
export * from "./trapezoid";
export * from "./hexagon";
export * from "./square";
export * from "./circle";

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

export interface RectBaseProps extends RawRectProps, ClosedFigureStyleProps {}
export interface SquareBaseProps extends RawSquareProps, ClosedFigureStyleProps {}