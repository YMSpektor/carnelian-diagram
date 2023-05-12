/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { CircleCollider, DiffCollider, HalfPlaneCollider, IntersectionCollider, KnobController, UnionCollider, withInteractiveCircle, withKnobs } from "@carnelian-diagram/interaction";
import { clamp, degToRad, Point, radToDeg } from "@carnelian-diagram/interaction/geometry";
import { CircleBaseProps } from "@carnelian-diagram/shapes";
import { convertPercentage, isPercentage, NumberOrPercentage } from "@carnelian-diagram/shapes/utils";

const MAX_MOUTH_ANGLE = 120;

export interface PacmanProps extends CircleBaseProps {
    mouthAngle: number;
    eyeRadius: NumberOrPercentage;
}

function getCirclePoint(x: number, y: number, radius: number, angle: number): Point {
    return {
        x: x + radius * Math.cos(degToRad(angle)),
        y: y + radius * Math.sin(degToRad(angle))
    }
}

function clampEyeRadius(value: number, radius: number) {
    return clamp(value, 0, radius / 4);
}

function calcEyeRadius(props: PacmanProps): number {
    return clampEyeRadius(convertPercentage(props.eyeRadius, props.radius / 2), props.radius);
}

function getEyeCenter(props: PacmanProps): Point {
    return {
        x: props.x,
        y: props.y - props.radius / 2
    }
}

const mouthKnobController: KnobController<PacmanProps> = {
    hitArea: {
        type: "mouth_knob_handle",
        cursor: "default",
        action: "mouth_knob_move",
    },
    getPosition(props) {
        const mouthAngle = clamp(props.mouthAngle, 0, MAX_MOUTH_ANGLE);
        return getCirclePoint(props.x, props.y, props.radius, mouthAngle / 2);
    },
    setPosition(props, {rawPosition: position, snapAngle, snapToGrid}) {
        let angle = radToDeg(Math.atan2(position.y - props.y, position.x - props.x));
        angle = snapToGrid ? snapToGrid(angle, snapAngle) : angle;
        return {
            ...props,
            mouthAngle: clamp(angle * 2, 0, MAX_MOUTH_ANGLE)
        }
    }
}

const eyeKnobController: KnobController<PacmanProps> = {
    hitArea: {
        type: "eye_knob_handle",
        cursor: "default",
        action: "eye_knob_move",
    },
    getPosition(props) {
        const eyeCenter = getEyeCenter(props);
        return {
            x: eyeCenter.x,
            y: eyeCenter.y - calcEyeRadius(props)
        }
    },
    setPosition(props, {rawPosition: position}) {
        const eyeCenter = getEyeCenter(props);
        let eyeRadius: NumberOrPercentage = clampEyeRadius(eyeCenter.y - position.y, props.radius);
        eyeRadius = isPercentage(props.eyeRadius)
            ? props.radius > 0 ? `${eyeRadius / props.radius * 2 * 100}%` : props.eyeRadius
            : eyeRadius;
        return {
            ...props,
            eyeRadius
        }
    }
}

function PacmanCollider(props: PacmanProps) {
    let { x, y, radius, mouthAngle } = props;

    mouthAngle = clamp(mouthAngle, 0, MAX_MOUTH_ANGLE);
    const center = {x, y};
    const start = getCirclePoint(x, y, radius, mouthAngle / 2);
    const end = getCirclePoint(x, y, radius, -mouthAngle / 2);
    
    return IntersectionCollider(
        DiffCollider(
            CircleCollider({center, radius}),
            CircleCollider({center: getEyeCenter(props), radius: calcEyeRadius(props)})
        ),
        UnionCollider(
            HalfPlaneCollider({a: center, b: start}),
            HalfPlaneCollider({a: end, b: center})
        )
    );
}

export const Pacman: DiagramElement<PacmanProps> = function(props) {
    let { onChange, x, y, radius, mouthAngle, eyeRadius, ...rest } = props;

    mouthAngle = clamp(mouthAngle, 0.001, MAX_MOUTH_ANGLE);
    const mouthStart = getCirclePoint(x, y, radius, mouthAngle / 2);
    const mouthEnd = getCirclePoint(x, y, radius, -mouthAngle / 2);

    const eyeCenter = getEyeCenter(props);
    eyeRadius = calcEyeRadius(props);

    let path = `
        M${mouthStart.x} ${mouthStart.y} A${radius},${radius} 0 1 1 ${mouthEnd.x} ${mouthEnd.y} L${x} ${y}Z
        M${eyeCenter.x - eyeRadius} ${eyeCenter.y} a${eyeRadius},${eyeRadius} 0 1 0 ${eyeRadius * 2} 0 a${eyeRadius} ${eyeRadius} 0 1 0 -${eyeRadius * 2} 0`;

    return (
        <path d={path} {...rest} />
    );
}

export const InteractivePacman = withInteractiveCircle(
    withKnobs(Pacman, mouthKnobController, eyeKnobController),
    { collider: PacmanCollider }
);
