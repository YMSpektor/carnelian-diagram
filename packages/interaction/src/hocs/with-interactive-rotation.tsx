/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement, DiagramElementProps } from "@carnelian-diagram/core";
import { distance, Point, radToDeg } from "../geometry";
import { KnobController, useKnob } from "./with-knob";

export interface RotationController<T extends object> {
    origin: (props: T) => Point;
    handleAnchor: (props: T) => Point;
    handleOffset?: number;
    getRotation: (props: T) => number;
    setRotation: (props: T, angle: number) => T;
}

export function useInteractiveRotation<T extends object>(
    props: DiagramElementProps<T>,
    rotationController: RotationController<T>
) {
    const knobController: KnobController<T> = {
        kind: "rotation",
        hitArea: {
            type: "rotation_handle",
            cursor: "move",
            action: "rotate"
        },
        getPosition: (props, transform) => {
            let result = rotationController.handleAnchor(props);
            if (rotationController.handleOffset) {
                const origin = rotationController.origin(props);
                transform = transform.inverse();
                const offset = distance(
                    new DOMPoint(0, 0).matrixTransform(transform), 
                    new DOMPoint(rotationController.handleOffset, 0).matrixTransform(transform));
                const l = distance(origin, result);
                const v = l !== 0 ? {
                    x: (result.x - origin.x) / l * offset,
                    y: (result.y - origin.y) / l * offset
                } : { x: offset, y: 0 };
                result = {
                    x: result.x + v.x,
                    y: result.y + v.y
                };
            }
            return result;
        },
        setPosition(props, payload) {
            const origin = rotationController.origin(props);
            const anchor = rotationController.handleAnchor(props);
            let angle = radToDeg(Math.atan2(payload.rawPosition.y - origin.y, payload.rawPosition.x - origin.x) - 
                Math.atan2(anchor.y - origin.y, anchor.x - origin.x)) + rotationController.getRotation(props);
            angle = payload.snapToGrid ? payload.snapToGrid(angle, payload.snapAngle) : angle;
            return rotationController.setRotation(props, angle);
        }
    }

    useKnob(knobController, props);
}

export function withInteractiveRotation<T extends object>(
    WrappedElement: DiagramElement<T>,
    rotationController: RotationController<T>
): DiagramElement<T> {
    return (props) => {
        useInteractiveRotation(props, rotationController);
        return <WrappedElement {...props} />;
    }
}
