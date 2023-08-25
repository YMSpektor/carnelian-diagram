import { DiagramElement } from "@carnelian-diagram/core";
import { SquareColliderFactory, withInteractiveRotation, withInteractiveSquare } from "@carnelian-diagram/interactivity";
import { SquareBaseProps } from "..";
import { squareRotationController, squareRotation } from "../utils";
import { withRotation } from "./with-rotation";

export function withInteractiveRotatableSquare<T extends SquareBaseProps>(
    WrappedElement: DiagramElement<T>,
    collider?: SquareColliderFactory<T>
) {
    return withRotation<T>(
        withInteractiveRotation(
            withInteractiveSquare(WrappedElement, { collider }),
            squareRotationController()
        ),
        squareRotation()
    );
}