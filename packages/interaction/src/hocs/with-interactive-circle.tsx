/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement, DiagramElementChangeHandler, DiagramElementProps } from "@carnelian-diagram/core";
import { InteractiveSquareProps, SquareColliderFactory, useInteractiveSquare } from "./with-interactive-square";
import { Collider } from "../collisions";
import { HitArea } from "../hit-tests";

export interface InteractiveCircleProps {
    x: number;
    y: number;
    radius: number;
}

export type CircleColliderFactory<T extends InteractiveCircleProps> = (props: T) => Collider<any>;

export interface InteractiveCircleOptions<T extends InteractiveCircleProps> {
    collider?: CircleColliderFactory<T>;
    innerHitArea?: (hitArea: HitArea) => HitArea;
}

export function withInteractiveCircle<T extends InteractiveCircleProps>(
    WrappedElement: DiagramElement<T>,
    options?: InteractiveCircleOptions<T>
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
        const colliderFactory = options?.collider;
        const squareColliderFactory: SquareColliderFactory<InteractiveSquareProps> | undefined = colliderFactory 
            ? (_: InteractiveSquareProps) => colliderFactory(props) : undefined;
        useInteractiveSquare(squareProps, {...options, collider: squareColliderFactory});
        return <WrappedElement {...props} />
    }
}