/** @jsxImportSource @carnelian/diagram */

import { DiagramElement, DiagramElementChangeHandler, DiagramElementProps } from "@carnelian/diagram";
import { Shape } from "@carnelian/interaction";
import { InteractiveSquareProps, SquareShapeFactory, useInteractiveSquare } from "./interactive-square";

export interface InteractiveCircleProps {
    x: number;
    y: number;
    radius: number;
}

export type CircleShapeFactory = (x: number, y: number, radius: number) => Shape;

export function withInteractiveCircle<T extends InteractiveCircleProps>(
    WrappedElement: DiagramElement<T>,
    shapeFactory?: CircleShapeFactory
): DiagramElement<T> {
    return (props) => {
        const { x, y, radius, onChange } = props;
        const squareOnChange: DiagramElementChangeHandler<InteractiveSquareProps> = (callback) => {
            const circleCallback = (props: DiagramElementProps<T>): DiagramElementProps<T> => {
                const { x, y, radius, onChange, ...rest } = props;
                let squareProps: DiagramElementProps<InteractiveSquareProps> = {
                    ...rest,
                    x: x - radius,
                    y: y - radius,
                    size: radius * 2,
                    onChange: squareOnChange
                }
                squareProps = callback(squareProps);
                return {
                    ...props,
                    x: squareProps.x + squareProps.size / 2,
                    y: squareProps.y + squareProps.size / 2,
                    radius: squareProps.size / 2,
                }
            }
            onChange(circleCallback);
        }
        const squareProps = {
            x: x - radius,
            y: y - radius,
            size: radius * 2,
            onChange: squareOnChange
        };
        const squareShapeFactory: SquareShapeFactory | undefined = shapeFactory ? (x, y, size) => shapeFactory(x + size / 2, y + size / 2, size / 2) : undefined;
        useInteractiveSquare(squareProps, squareShapeFactory);
        return <WrappedElement {...props} />
    }
}