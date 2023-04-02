/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { CircleCollider } from "@carnelian/interaction/collisions";
import { RawCircleProps } from ".";
import { withInteractiveCircle} from "../interaction";

export interface CircleProps extends RawCircleProps { }

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