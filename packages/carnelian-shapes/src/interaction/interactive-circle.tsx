/** @jsxImportSource @carnelian/diagram */

import { DiagramElement, DiagramElementChangeHandler, DiagramElementProps } from "@carnelian/diagram";
import { circleHitTest, HandleControl, MovementActionPayload, useAction, useBounds, useControls, useHitTest } from "@carnelian/interaction";
import { InteractiveSquareProps, useInteractiveSquare } from "./interactive-square";

export interface InteractiveCircleProps {
    x: number;
    y: number;
    radius: number;
}

export function useInteractiveCircle<T extends InteractiveCircleProps>(props: DiagramElementProps<T>) {
    const { x, y, radius, onChange } = props;

    function move(payload: MovementActionPayload) {
        onChange(props => ({
            ...props,
            x: props.x + payload.deltaX,
            y: props.y + payload.deltaY
        }));
    }

    useHitTest(
        circleHitTest(x, y, radius),
        { 
            type: "in",
            action: "move",
            cursor: "move",
        },
    );
    useAction<MovementActionPayload>("move", move);
    useBounds({x: x - radius, y: y - radius, width: radius * 2, height: radius * 2});

    useControls((transform, element) => {
        return (
            <HandleControl
                kind="default"
                x={x} y={y} 
                hitArea={{
                    type: "center_handle",
                    cursor: "default",
                    action: "center_handle_move"
                }}
                transform={transform} 
                element={element}
                onDrag={move}
            />
        )
    });
}

export function withInteractiveCircle<T extends InteractiveCircleProps>(WrappedElement: DiagramElement<T>): DiagramElement<T> {
    return (props) => {
        useInteractiveCircle(props);
        return <WrappedElement {...props} />;
    }
}

export function withInteractiveSquareForCircle<T extends InteractiveCircleProps>(
    WrappedElement: DiagramElement<T>
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
        useInteractiveSquare(squareProps);
        return <WrappedElement {...props} />
    }
}