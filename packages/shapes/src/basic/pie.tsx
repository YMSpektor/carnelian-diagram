/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { CircleCollider, HalfPlaneCollider, IntersectionCollider, KnobController, UnionCollider, withKnobs, withRotation } from "@carnelian-diagram/interaction";
import { degToRad, Point, radToDeg } from "@carnelian-diagram/interaction/geometry";
import { CircleBaseProps } from "..";
import { withInteractiveRotatableCircle } from "../hocs";
import { CircleRotation } from "../utils";

export interface PieProps extends CircleBaseProps {
    startAngle: number;
    endAngle: number;
}

function getCirclePoint(x: number, y: number, radius: number, angle: number): Point {
    return {
        x: x + radius * Math.cos(degToRad(angle)),
        y: y + radius * Math.sin(degToRad(angle))
    }
}

function knobController(index: number): KnobController<PieProps> {
    return {
        hitArea: {
            type: "knob_handle",
            index,
            cursor: "default",
            action: "knob_move",
        },
        getPosition(props) {
            const angle = index === 0 ? props.startAngle : props.endAngle;
            return getCirclePoint(props.x, props.y, props.radius, angle);
        },
        setPosition(props, {rawPosition: position, snapAngle, snapToGrid}) {
            let angle = radToDeg(Math.atan2(position.y - props.y, position.x - props.x));
            angle = snapToGrid ? snapToGrid(angle, snapAngle) : angle;
            return {
                ...props,
                startAngle: index === 0 ? angle : props.startAngle,
                endAngle: index === 1 ? angle : props.endAngle
            }
        }
    }
};

const PieColliderFactory = (props: PieProps) => {
    const { x, y, radius, startAngle, endAngle } = props;

    const center = {x, y};
    const start = getCirclePoint(x, y, radius, startAngle);
    const end = getCirclePoint(x, y, radius, endAngle);
    const AngleCollider = Math.sin(degToRad(endAngle - startAngle)) < 0 ? UnionCollider : IntersectionCollider;
    
    return IntersectionCollider(
        CircleCollider({center, radius}),
        AngleCollider(
            HalfPlaneCollider({a: center, b: start}),
            HalfPlaneCollider({a: end, b: center})
        )
    );
}

export const RawPie: DiagramElement<PieProps> = function(props) {
    let { onChange, x, y, radius, startAngle, endAngle, ...rest } = props;

    const isCircle = endAngle - startAngle === 360;
    endAngle = isCircle ? endAngle - 1 : endAngle;
    const largeArcFlag = Math.sin(degToRad(endAngle - startAngle)) >= 0 ? 0 : 1;
    const start = getCirclePoint(x, y, radius, startAngle);
    const end = getCirclePoint(x, y, radius, endAngle);
    let path = `M${start.x} ${start.y} A${radius},${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
    path += isCircle ? "Z" : `L${x} ${y}Z`

    return (
        <path d={path} {...rest} />
    );
}

export const Pie = withRotation(RawPie, CircleRotation);

export const InteractivePie = withInteractiveRotatableCircle(
    withKnobs(RawPie, knobController(0), knobController(1)),
    PieColliderFactory
);