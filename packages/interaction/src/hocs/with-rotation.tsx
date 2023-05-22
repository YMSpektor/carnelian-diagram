/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement, DiagramElementProps } from "@carnelian-diagram/core";
import { Point } from "../geometry";
import { rotateTransform } from "../transforms";

export interface DiagramElementRotation<T extends object> {
    angle: (props: DiagramElementProps<T>) => number
    origin: (props: DiagramElementProps<T>) => Point,
    offsetElement: (props: DiagramElementProps<T>, dx: number, dy: number) => DiagramElementProps<T>,
}

export function withRotation<T extends object>(
    WrappedElement: DiagramElement<T>,
    rotation: DiagramElementRotation<T>
): DiagramElement<T> {
    return (props) => {
        if (rotation.angle) {
            const angle = rotation.angle(props);
            const origin = rotation.origin(props);
            const p = new DOMPoint(origin.x, origin.y).matrixTransform(rotateTransform(angle).inverse());
            const innerProps = rotation.offsetElement(props, p.x - origin.x, p.y - origin.y);
            return (
                <g transform={`rotate(${angle})`}>
                    <WrappedElement {...innerProps} />
                </g>
            )
        }
        else {
            return <WrappedElement {...props} />;
        }
    }
}