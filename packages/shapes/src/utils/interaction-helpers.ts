import { DiagramElement } from "@carnelian-diagram/core";
import { ACT_EDIT_TEXT, CircleColliderFactory, RectColliderFactory, SquareColliderFactory, withInteractiveCircle, withInteractiveRect, withInteractiveRotation, withInteractiveSquare, withInteractiveText, withRotation } from "@carnelian-diagram/interaction";
import { CircleBaseProps, RectBaseProps, SquareBaseProps } from "..";
import { MultilineText } from "../basic/multiline-text";
import { withText } from "../hocs";
import { textEditorStyles } from "./text-utils";

const ROTATION_HANDLE_OFFSET = 20;

export const MultilineTextComponent = withInteractiveText(
    MultilineText,
    (props) => props,
    (props) => textEditorStyles(props.textStyle)
);

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

export function withInteractiveRotatableRect<T extends RectBaseProps>(
    WrappedElement: DiagramElement<T>,
    collider?: RectColliderFactory<T>
) {
    return withRotation(
        withInteractiveRotation(
            withInteractiveRect(WrappedElement, { collider }),
            RectRotationController
        ),
        RectRotation
    );
}

export function withInteractiveRotatableTextRect<T extends RectBaseProps>(
    WrappedElement: DiagramElement<T>,
    collider?: RectColliderFactory<T>
) {
    return withRotation(
        withInteractiveRotation(
            withText(
                withInteractiveRect(WrappedElement, {
                    innerHitArea: (hitArea) => ({...hitArea, dblClickAction: ACT_EDIT_TEXT}),
                    collider
                }),
                MultilineTextComponent,
                (props) => props
            ),
            RectRotationController
        ),
        RectRotation
    );
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

export function withInteractiveRotatableSquare<T extends SquareBaseProps>(
    WrappedElement: DiagramElement<T>,
    collider?: SquareColliderFactory<T>
) {
    return withRotation(
        withInteractiveRotation(
            withInteractiveSquare(WrappedElement, { collider }),
            SquareRotationController
        ),
        SquareRotation
    );
}

export function withInteractiveRotatableTextSquare<T extends SquareBaseProps>(
    WrappedElement: DiagramElement<T>,
    collider?: SquareColliderFactory<T>
) {
    return withRotation(
        withInteractiveRotation(
            withText(
                withInteractiveSquare(WrappedElement, {
                    innerHitArea: (hitArea) => ({...hitArea, dblClickAction: ACT_EDIT_TEXT}),
                    collider
                }),
                MultilineTextComponent,
                (props) => ({
                    x: props.x,
                    y: props.y,
                    width: props.size,
                    height: props.size,
                    text: props.text,
                    textStyle: props.textStyle
                })
            ),
            SquareRotationController
        ),
        SquareRotation
    );
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

export function withInteractiveRotatableCircle<T extends CircleBaseProps>(
    WrappedElement: DiagramElement<T>,
    collider?: CircleColliderFactory<T>
) {
    return withRotation(
        withInteractiveRotation(
            withInteractiveCircle(WrappedElement, { collider }),
            CircleRotationController
        ),
        CircleRotation
    );
}

export function withInteractiveRotatableTextCircle<T extends CircleBaseProps>(
    WrappedElement: DiagramElement<T>,
    collider?: CircleColliderFactory<T>
) {
    return withRotation(
        withInteractiveRotation(
            withText(
                withInteractiveCircle(WrappedElement, {
                    innerHitArea: (hitArea) => ({...hitArea, dblClickAction: ACT_EDIT_TEXT}),
                    collider
                }),
                MultilineTextComponent,
                (props) => ({
                    x: props.x - props.radius,
                    y: props.y - props.radius,
                    width: props.radius * 2,
                    height: props.radius * 2,
                    text: props.text,
                    textStyle: props.textStyle
                })
            ),
            CircleRotationController
        ),
        CircleRotation
    );
}