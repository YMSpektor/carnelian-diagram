import { InteractiveRectProps } from "../interaction";

export * from "./rect";
export * from "./ellipse";
export * from "./rhombus";
export * from "./rounded-rect";
export * from "./parallelogram";

export interface RectBaseProps extends InteractiveRectProps {
    style?: {
        stroke?: string;
        fill?: string;
    }
}