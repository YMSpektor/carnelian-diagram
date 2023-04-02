/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { CircleCollider } from "@carnelian/interaction/collisions";
import { RawCircleProps } from ".";
import { withInteractiveCircle} from "../interaction";

export interface DonutProps extends RawCircleProps {
    innerRadius: number;
}

export const Donut: DiagramElement<DonutProps> = function(props) {
    const { onChange, x, y, radius: or, innerRadius: ir, ...rest } = props;
    const path = `
        M${x - or},${y} a${or},${or} 0 1,0 ${or * 2},0 a${or},${or} 0 1,0 -${or * 2},0
        M${x - ir},${y} a${ir},${ir} 0 0,1 ${ir * 2},0 a${ir},${ir} 0 0,1 -${ir * 2},0`;

    return (
        <path d={path} {...rest} />
    );
}
export const InteractiveDonut = withInteractiveCircle(
    Donut,
    (props) => CircleCollider({center: {x: props.x, y: props.y}, radius: props.radius})
);