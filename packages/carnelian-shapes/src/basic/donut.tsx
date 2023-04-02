/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { CircleCollider, DiffCollider } from "@carnelian/interaction/collisions";
import { clamp } from "@carnelian/interaction/geometry";
import { RawCircleProps } from ".";
import { KnobController, withInteractiveCircle, withKnob} from "../interaction";
import { convertPercentage, isPercentage, NumberOrPercentage } from "../utils";

export interface DonutProps extends RawCircleProps {
    innerRadius: NumberOrPercentage;
}

function calcInnerRadius(props: DonutProps): number {
    return Math.min(convertPercentage(props.innerRadius, props.radius), props.radius);
}

const knobController: KnobController<DonutProps> = {
    hitArea: {
        type: "knob_handle",
        cursor: "default",
        action: "knob_move"
    },
    getPosition(props) {
        const ir = calcInnerRadius(props);
        return {
            x: props.x,
            y: props.y - ir
        }
    },
    setPosition(props, pos) {
        let ir: NumberOrPercentage = clamp(props.y - pos.y, 0, props.radius);
        ir = isPercentage(props.innerRadius)
            ? props.radius > 0 ? `${ir / props.radius * 100}%` : props.innerRadius
            : ir;
        return {
            ...props,
            innerRadius: ir
        }
    }
}

export const Donut: DiagramElement<DonutProps> = function(props) {
    let { onChange, x, y, radius: or, innerRadius: ir, ...rest } = props;
    ir = calcInnerRadius(props);

    const path = `
        M${x - or},${y} a${or},${or} 0 1,0 ${or * 2},0 a${or},${or} 0 1,0 -${or * 2},0
        M${x - ir},${y} a${ir},${ir} 0 0,1 ${ir * 2},0 a${ir},${ir} 0 0,1 -${ir * 2},0`;

    return (
        <path d={path} {...rest} />
    );
}
export const InteractiveDonut = withInteractiveCircle(
    withKnob(knobController, Donut),
    (props) => DiffCollider(
        CircleCollider({center: {x: props.x, y: props.y}, radius: props.radius}),
        CircleCollider({center: {x: props.x, y: props.y}, radius: calcInnerRadius(props)})
    )
);