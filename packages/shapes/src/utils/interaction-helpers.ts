import { CircleBaseProps, RectBaseProps, SquareBaseProps, TextBaseProps, TextStyle } from "..";

const ROTATION_HANDLE_OFFSET = 20;

export const TextRotation = {
    angle: <S extends TextStyle, T extends TextBaseProps<S>>(props: T) => props.rotation || 0,
    origin: <S extends TextStyle, T extends TextBaseProps<S>>(props: T) => ({ x: props.x + props.width / 2, y: props.y + props.height / 2 }),
    offsetElement: <S extends TextStyle, T extends TextBaseProps<S>>(props: T, dx: number, dy: number) => ({ ...props, x: props.x + dx, y: props.y + dy })
}

export const TextRotationController = {
    origin: <S extends TextStyle, T extends TextBaseProps<S>>(props: T) => ({ x: props.x + props.width / 2, y: props.y + props.height / 2 }),
    handleAnchor: <S extends TextStyle, T extends TextBaseProps<S>>(props: T) => ({ x: props.x + props.width, y: props.y }),
    handleOffset: ROTATION_HANDLE_OFFSET,
    getRotation: <S extends TextStyle, T extends TextBaseProps<S>>(props: T) => props.rotation || 0,
    setRotation: <S extends TextStyle, T extends TextBaseProps<S>>(props: T, rotation: number) => ({...props, rotation })
}

export const RectRotation = {
    angle: <T extends RectBaseProps>(props: T) => props.rotation || 0,
    origin: <T extends RectBaseProps>(props: T) => ({ x: props.x + props.width / 2, y: props.y + props.height / 2 }),
    offsetElement: <T extends RectBaseProps>(props: T, dx: number, dy: number) => ({ ...props, x: props.x + dx, y: props.y + dy })
}

export const RectRotationController = {
    origin: <T extends RectBaseProps>(props: T) => ({ x: props.x + props.width / 2, y: props.y + props.height / 2 }),
    handleAnchor: <T extends RectBaseProps>(props: T) => ({ x: props.x + props.width, y: props.y }),
    handleOffset: ROTATION_HANDLE_OFFSET,
    getRotation: <T extends RectBaseProps>(props: T) => props.rotation || 0,
    setRotation: <T extends RectBaseProps>(props: T, rotation: number) => ({...props, rotation })
}

export const SquareRotation = {
    angle: <T extends SquareBaseProps>(props: T) => props.rotation || 0,
    origin: <T extends SquareBaseProps>(props: T) => ({ x: props.x + props.size / 2, y: props.y + props.size / 2 }),
    offsetElement: <T extends SquareBaseProps>(props: T, dx: number, dy: number) => ({ ...props, x: props.x + dx, y: props.y + dy })
}

export const SquareRotationController = {
    origin: <T extends SquareBaseProps>(props: T) => ({ x: props.x + props.size / 2, y: props.y + props.size / 2 }),
    handleAnchor: <T extends SquareBaseProps>(props: T) => ({ x: props.x + props.size, y: props.y }),
    handleOffset: ROTATION_HANDLE_OFFSET,
    getRotation: <T extends SquareBaseProps>(props: T) => props.rotation || 0,
    setRotation: <T extends SquareBaseProps>(props: T, rotation: number) => ({...props, rotation })
}

export const CircleRotation = {
    angle: <T extends CircleBaseProps>(props: T) => props.rotation || 0,
    origin: <T extends CircleBaseProps>(props: T) => ({ x: props.x, y: props.y }),
    offsetElement: <T extends CircleBaseProps>(props: T, dx: number, dy: number) => ({ ...props, x: props.x + dx, y: props.y + dy })
}

export const CircleRotationController = {
    origin: <T extends CircleBaseProps>(props: T) => ({ x: props.x, y: props.y }),
    handleAnchor: <T extends CircleBaseProps>(props: T) => ({ x: props.x + props.radius, y: props.y - props.radius }),
    handleOffset: ROTATION_HANDLE_OFFSET,
    getRotation: <T extends CircleBaseProps>(props: T) => props.rotation || 0,
    setRotation: <T extends CircleBaseProps>(props: T, rotation: number) => ({...props, rotation })
}