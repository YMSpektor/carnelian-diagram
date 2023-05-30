/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement, DiagramElementProps } from "@carnelian-diagram/core";
import { Point } from "../geometry";
import { useTransform } from "../hooks";
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
        const { onChange } = props;
        const angle = rotation.angle(props);
        const transform = rotateTransform(angle);
        useTransform(transform);

        if (angle) {
            const origin = rotation.origin(props);
            const p = new DOMPoint(origin.x, origin.y).matrixTransform(transform.inverse());
            const innerProps = rotation.offsetElement(props, p.x - origin.x, p.y - origin.y);
            innerProps.onChange = (callback) => {
                function rotationCallback(props: DiagramElementProps<T>): DiagramElementProps<T> {
                    const newInnerProps = callback(innerProps);
                    const newInnerOrigin = rotation.origin(newInnerProps);
                    const newOuterOrigin = new DOMPoint(newInnerOrigin.x, newInnerOrigin.y).matrixTransform(transform);
                    const dx = newOuterOrigin.x - newInnerOrigin.x;
                    const dy = newOuterOrigin.y - newInnerOrigin.y;
                    const result = {
                        ...rotation.offsetElement(newInnerProps, dx, dy),
                        onChange
                    };
                    return result;
                }
                return onChange(rotationCallback);
            }

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