/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { CircleCollider } from "@carnelian-diagram/interaction";
import { CircleBaseProps } from "..";
import { withInteractiveRotatableCircle, withInteractiveRotatableTextCircle } from "../hocs";

export interface CircleProps extends CircleBaseProps { }

const CircleColliderFactory = (props: CircleProps) => CircleCollider({center: {x: props.x, y: props.y}, radius: props.radius})

export const Circle: DiagramElement<CircleProps> = function(props) {
    const { onChange, x, y, radius, ...rest } = props;

    return (
        <circle cx={x} cy={y} r={radius} {...rest} />
    );
}

export const InteractiveCircle = withInteractiveRotatableCircle(Circle, CircleColliderFactory);

export const InteractiveCircleWithText = withInteractiveRotatableTextCircle(Circle, CircleColliderFactory);