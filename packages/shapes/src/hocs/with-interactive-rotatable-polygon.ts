import { DiagramElement } from "@carnelian-diagram/core";
import { withRotation, withInteractiveRotation, withInteractivePolyline, PolygonCollider } from "@carnelian-diagram/interaction";
import { PolygonBaseProps } from "..";
import { PolygonRotation, PolygonRotationController } from "../utils";

export function withInteractiveRotatablePolygon<T extends PolygonBaseProps>(
    WrappedElement: DiagramElement<T>
) {
    return withRotation<T>(
        withInteractiveRotation(
            withInteractivePolyline(
                WrappedElement, true, 3, { collider: (props) => PolygonCollider(props.points) }
            ),
            PolygonRotationController()
        ),
        PolygonRotation()
    );
}