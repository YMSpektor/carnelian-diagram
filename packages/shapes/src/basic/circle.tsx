/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { CircleCollider, withRotation } from "@carnelian-diagram/interaction";
import { CircleBaseProps } from "..";
import { withInteractiveRotatableCircle, withInteractiveRotatableTextCircle } from "../hocs";
import { CircleRotation } from "../utils";

export interface CircleProps extends CircleBaseProps { }

const CircleColliderFactory = (props: CircleProps) => CircleCollider({center: {x: props.x, y: props.y}, radius: props.radius})

export const RawCircle: DiagramElement<CircleProps> = function(props) {
    const { onChange, x, y, radius, ...rest } = props;

    return (
        <circle cx={x} cy={y} r={radius} {...rest} />
    );
}

export const Circle = withRotation(RawCircle, CircleRotation);

export const InteractiveCircle = withInteractiveRotatableCircle(RawCircle, CircleColliderFactory);

export const InteractiveCircleWithText = withInteractiveRotatableTextCircle(RawCircle, CircleColliderFactory);