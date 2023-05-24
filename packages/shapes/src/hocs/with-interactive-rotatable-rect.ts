import { DiagramElement } from "@carnelian-diagram/core";
import { RectColliderFactory, withRotation, withInteractiveRotation, withInteractiveRect } from "@carnelian-diagram/interaction";
import { RectBaseProps } from "..";
import { RectRotationController, RectRotation } from "../utils";

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