import { DiagramElement } from "@carnelian-diagram/core";
import { SquareColliderFactory, withRotation, withInteractiveRotation, withInteractiveSquare } from "@carnelian-diagram/interaction";
import { SquareBaseProps } from "..";
import { SquareRotationController, SquareRotation } from "../utils";

export function withInteractiveRotatableSquare<T extends SquareBaseProps>(
    WrappedElement: DiagramElement<T>,
    collider?: SquareColliderFactory<T>
) {
    return withRotation<T>(
        withInteractiveRotation(
            withInteractiveSquare(WrappedElement, { collider }),
            SquareRotationController()
        ),
        SquareRotation()
    );
}