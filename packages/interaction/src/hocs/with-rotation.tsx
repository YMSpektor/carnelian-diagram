/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { Point, transformPoint } from "../geometry";
import { useTransform } from "../hooks";
import { rotateTransform } from "../transforms";

export interface DiagramElementRotation<T extends object> {
    angle: (props: T) => number
    origin: (props: T) => Point,
    offsetElement: (props: T, dx: number, dy: number) => T,
}

export function withRotation<T extends object>(
    WrappedElement: DiagramElement<T>,
    rotation: DiagramElementRotation<T>
): DiagramElement<T> {
    return (props) => {
        const { onChange } = props;
        const angle = rotation.angle(props);
        const transform = rotateTransform(angle);
        useTransform(transform);

        if (angle) {
            const origin = rotation.origin(props);
            const p = transformPoint(origin, transform.inverse());
            const innerOnChange = (callback: (oldProps: T) => T) => {
                function rotationCallback(props: T): T {
                    const newInnerProps = callback(innerProps);
                    const newInnerOrigin = rotation.origin(newInnerProps);
                    const newOuterOrigin = transformPoint(newInnerOrigin, transform);
                    const dx = newOuterOrigin.x - newInnerOrigin.x;
                    const dy = newOuterOrigin.y - newInnerOrigin.y;
                    return rotation.offsetElement(newInnerProps, dx, dy);
                }
                return onChange(rotationCallback);
            }
            const innerProps = {
                ...rotation.offsetElement(props, p.x - origin.x, p.y - origin.y),
                onChange: innerOnChange
            };

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