import { RotationController } from "@carnelian-diagram/interaction";
import { polygonBounds } from "@carnelian-diagram/interaction/geometry";
import { CircleBaseProps, PolygonBaseProps, RectBaseProps, RotatableElementProps, SquareBaseProps, TextBaseProps, TextStyle } from "..";
import { DiagramElementRotation } from "../hocs";

const ROTATION_HANDLE_OFFSET = 20;

export function textRotation<S extends TextStyle, T extends TextBaseProps<S>>(): DiagramElementRotation<T> {
    return {
        origin: (props) => ({ x: props.x + props.width / 2, y: props.y + props.height / 2 }),
        offsetElement: (props, dx, dy) => ({ ...props, x: props.x + dx, y: props.y + dy })
    }
}

export function textRotationController<S extends TextStyle, T extends TextBaseProps<S> & RotatableElementProps>(): RotationController<T> {
    return {
        origin: (props) => ({ x: props.x + props.width / 2, y: props.y + props.height / 2 }),
        handleAnchor: (props) => ({ x: props.x + props.width, y: props.y }),
        handleOffset: ROTATION_HANDLE_OFFSET,
        getRotation: (props) => props.rotation || 0,
        setRotation: (props, rotation) => ({...props, rotation })
    }
}

export function rectRotation<T extends RectBaseProps>(): DiagramElementRotation<T> {
    return {
        origin: (props) => ({ x: props.x + props.width / 2, y: props.y + props.height / 2 }),
        offsetElement: (props, dx, dy) => ({ ...props, x: props.x + dx, y: props.y + dy })
    }
}

export function rectRotationController<T extends RectBaseProps & RotatableElementProps>(): RotationController<T> {
    return {
        origin: (props) => ({ x: props.x + props.width / 2, y: props.y + props.height / 2 }),
        handleAnchor: (props) => ({ x: props.x + props.width, y: props.y }),
        handleOffset: ROTATION_HANDLE_OFFSET,
        getRotation: (props) => props.rotation || 0,
        setRotation: (props, rotation) => ({...props, rotation })
    }
}

export function squareRotation<T extends SquareBaseProps>(): DiagramElementRotation<T> {
    return {
        origin: (props) => ({ x: props.x + props.size / 2, y: props.y + props.size / 2 }),
        offsetElement: (props, dx, dy) => ({ ...props, x: props.x + dx, y: props.y + dy })
    }
}

export function squareRotationController<T extends SquareBaseProps & RotatableElementProps>(): RotationController<T> {
    return {
        origin: (props) => ({ x: props.x + props.size / 2, y: props.y + props.size / 2 }),
        handleAnchor: (props) => ({ x: props.x + props.size, y: props.y }),
        handleOffset: ROTATION_HANDLE_OFFSET,
        getRotation: (props) => props.rotation || 0,
        setRotation: (props, rotation) => ({...props, rotation })
    }
}

export function circleRotation<T extends CircleBaseProps>(): DiagramElementRotation<T> {
    return {
        origin: (props) => ({ x: props.x, y: props.y }),
        offsetElement: (props, dx, dy) => ({ ...props, x: props.x + dx, y: props.y + dy })
    }
}

export function circleRotationController<T extends CircleBaseProps & RotatableElementProps>(): RotationController<T> {
    return {
        origin: (props) => ({ x: props.x, y: props.y }),
        handleAnchor: (props) => ({ x: props.x + props.radius, y: props.y - props.radius }),
        handleOffset: ROTATION_HANDLE_OFFSET,
        getRotation: (props) => props.rotation || 0,
        setRotation: (props, rotation) => ({...props, rotation })
    }
}

export function polygonRotation<T extends PolygonBaseProps>(): DiagramElementRotation<T> {
    return {
        origin: (props) => {
            const bounds = polygonBounds(props.points);
            return bounds ? {
                x: bounds.x + bounds.width / 2,
                y: bounds.y + bounds.height / 2
            } :  { x: 0, y: 0 }
        },
        offsetElement: (props, dx, dy) => ({ ...props, points: props.points.map(p => ({ x: p.x + dx, y: p.y + dy })) })
    }
}

export function polygonRotationController<T extends PolygonBaseProps & RotatableElementProps>(): RotationController<T> {
    return {
        origin: (props) => {
            const bounds = polygonBounds(props.points);
            return bounds ? {
                x: bounds.x + bounds.width / 2,
                y: bounds.y + bounds.height / 2
            } :  { x: 0, y: 0 }
        },
        handleAnchor: (props) => {
            const bounds = polygonBounds(props.points);
            return bounds ? { x: bounds.x + bounds.width, y: bounds.y } : { x: 0, y: 0 }
        },
        handleOffset: ROTATION_HANDLE_OFFSET,
        getRotation: (props) => props.rotation || 0,
        setRotation: (props, rotation) => ({...props, rotation })
    }
}