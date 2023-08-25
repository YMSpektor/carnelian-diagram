import { DiagramElement } from "@carnelian-diagram/core";
import { withInteractiveRotation, withInteractivePolyline, PolygonCollider } from "@carnelian-diagram/interactivity";
import { PolygonBaseProps } from "..";
import { polygonRotation, polygonRotationController } from "../utils";
import { withRotation } from "./with-rotation";

export function withInteractiveRotatablePolygon<T extends PolygonBaseProps>(
    WrappedElement: DiagramElement<T>
) {
    return withRotation<T>(
        withInteractiveRotation(
            withInteractivePolyline(
                WrappedElement, true, 3, { collider: (props) => PolygonCollider(props.points) }
            ),
            polygonRotationController()
        ),
        polygonRotation()
    );
}