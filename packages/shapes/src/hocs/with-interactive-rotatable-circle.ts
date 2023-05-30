import { DiagramElement } from "@carnelian-diagram/core";
import { CircleColliderFactory, withRotation, withInteractiveRotation, withInteractiveCircle } from "@carnelian-diagram/interaction";
import { CircleBaseProps } from "..";
import { CircleRotationController, CircleRotation } from "../utils";

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