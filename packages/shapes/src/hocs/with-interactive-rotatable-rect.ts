import { DiagramElement } from "@carnelian-diagram/core";
import { RectColliderFactory, withInteractiveRotation, withInteractiveRect } from "@carnelian-diagram/interaction";
import { RectBaseProps } from "..";
import { rectRotationController, rectRotation } from "../utils";
import { withRotation } from "./with-rotation";

export function withInteractiveRotatableRect<T extends RectBaseProps>(
    WrappedElement: DiagramElement<T>,
    collider?: RectColliderFactory<T>
) {
    return withRotation<T>(
        withInteractiveRotation(
            withInteractiveRect(WrappedElement, { collider }),
            rectRotationController()
        ),
        rectRotation()
    );
}