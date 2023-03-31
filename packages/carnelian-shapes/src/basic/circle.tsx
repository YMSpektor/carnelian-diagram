/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { ClosedFigureStyleProps } from ".";
import { CircleShape, withInteractiveCircle} from "../interaction";

export interface CircleProps extends ClosedFigureStyleProps {
    x: number;
    y: number;
    radius: number;
}

export const Circle: DiagramElement<CircleProps> = function(props) {
    let { onChange, x, y, radius, ...rest } = props;

    return (
        <circle cx={x} cy={y} r={radius} {...rest} />
    );
}
export const InteractiveCircle = withInteractiveCircle(
    Circle,
    (x, y, width, height) => new CircleShape(x + width / 2, y + height / 2, width / 2)
);