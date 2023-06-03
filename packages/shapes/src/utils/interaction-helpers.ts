import { DiagramElementRotation, RotationController } from "@carnelian-diagram/interaction";
import { polygonBounds } from "@carnelian-diagram/interaction/geometry";
import { CircleBaseProps, PolygonBaseProps, RectBaseProps, SquareBaseProps, TextBaseProps, TextStyle } from "..";

const ROTATION_HANDLE_OFFSET = 20;

export function TextRotation<S extends TextStyle, T extends TextBaseProps<S>>(): DiagramElementRotation<T> {
    return {
        angle: (props) => props.rotation || 0,
        origin: (props) => ({ x: props.x + props.width / 2, y: props.y + props.height / 2 }),
        offsetElement: (props, dx, dy) => ({ ...props, x: props.x + dx, y: props.y + dy })
    }
}

export function TextRotationController<S extends TextStyle, T extends TextBaseProps<S>>(): RotationController<T> {
    return {
        origin: (props) => ({ x: props.x + props.width / 2, y: props.y + props.height / 2 }),
        handleAnchor: (props) => ({ x: props.x + props.width, y: props.y }),
        handleOffset: ROTATION_HANDLE_OFFSET,
        getRotation: (props) => props.rotation || 0,
        setRotation: (props, rotation) => ({...props, rotation })
    }
}

export function RectRotation<T extends RectBaseProps>(): DiagramElementRotation<T> {
    return {
        angle: (props) => props.rotation || 0,
        origin: (props) => ({ x: props.x + props.width / 2, y: props.y + props.height / 2 }),
        offsetElement: (props, dx, dy) => ({ ...props, x: props.x + dx, y: props.y + dy })
    }
}

export function RectRotationController<T extends RectBaseProps>(): RotationController<T> {
    return {
        origin: (props) => ({ x: props.x + props.width / 2, y: props.y + props.height / 2 }),
        handleAnchor: (props) => ({ x: props.x + props.width, y: props.y }),
        handleOffset: ROTATION_HANDLE_OFFSET,
        getRotation: (props) => props.rotation || 0,
        setRotation: (props, rotation) => ({...props, rotation })
    }
}

export function SquareRotation<T extends SquareBaseProps>(): DiagramElementRotation<T> {
    return {
        angle: (props) => props.rotation || 0,
        origin: (props) => ({ x: props.x + props.size / 2, y: props.y + props.size / 2 }),
        offsetElement: (props, dx, dy) => ({ ...props, x: props.x + dx, y: props.y + dy })
    }
}

export function SquareRotationController<T extends SquareBaseProps>(): RotationController<T> {
    return {
        origin: (props) => ({ x: props.x + props.size / 2, y: props.y + props.size / 2 }),
        handleAnchor: (props) => ({ x: props.x + props.size, y: props.y }),
        handleOffset: ROTATION_HANDLE_OFFSET,
        getRotation: (props) => props.rotation || 0,
        setRotation: (props, rotation) => ({...props, rotation })
    }
}

export function CircleRotation<T extends CircleBaseProps>(): DiagramElementRotation<T> {
    return {
        angle: (props) => props.rotation || 0,
        origin: (props) => ({ x: props.x, y: props.y }),
        offsetElement: (props, dx, dy) => ({ ...props, x: props.x + dx, y: props.y + dy })
    }
}

export function CircleRotationController<T extends CircleBaseProps>(): RotationController<T> {
    return {
        origin: (props) => ({ x: props.x, y: props.y }),
        handleAnchor: (props) => ({ x: props.x + props.radius, y: props.y - props.radius }),
        handleOffset: ROTATION_HANDLE_OFFSET,
        getRotation: (props) => props.rotation || 0,
        setRotation: (props, rotation) => ({...props, rotation })
    }
}

export function PolygonRotation<T extends PolygonBaseProps>(): DiagramElementRotation<T> {
    return {
        angle: (props) => props.rotation || 0,
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

export function PolygonRotationController<T extends PolygonBaseProps>(): RotationController<T> {
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