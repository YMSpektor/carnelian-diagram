import { DiagramElement } from "@carnelian-diagram/core";
import { CircleColliderFactory, withInteractiveRotation, withInteractiveCircle } from "@carnelian-diagram/interactivity";
import { CircleBaseProps } from "..";
import { circleRotationController, circleRotation } from "../utils";
import { withRotation } from "./with-rotation";

export function withInteractiveRotatableCircle<T extends CircleBaseProps>(
    WrappedElement: DiagramElement<T>,
    collider?: CircleColliderFactory<T>
) {
    return withRotation<T>(
        withInteractiveRotation(
            withInteractiveCircle(WrappedElement, { collider }),
            circleRotationController()
        ),
        circleRotation()
    );
}