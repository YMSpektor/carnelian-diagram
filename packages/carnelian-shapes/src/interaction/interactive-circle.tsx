/** @jsxImportSource @carnelian/diagram */

import { DiagramElement, DiagramElementProps } from "@carnelian/diagram";
import { circleHitTest, HandleControl, MovementActionPayload, useAction, useBounds, useControls, useHitTest } from "@carnelian/interaction";

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