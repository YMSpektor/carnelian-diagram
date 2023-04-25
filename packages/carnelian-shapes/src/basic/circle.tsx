/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { CircleCollider, withInteractiveCircle } from "@carnelian/interaction";
import { CircleBaseProps } from "..";

export interface CircleProps extends CircleBaseProps { }

export const Circle: DiagramElement<CircleProps> = function(props) {
    const { onChange, x, y, radius, ...rest } = props;

    return (
        <circle cx={x} cy={y} r={radius} {...rest} />
    );
}

export const InteractiveCircle = withInteractiveCircle(
    Circle,
    (props) => CircleCollider({center: {x: props.x, y: props.y}, radius: props.radius})
);