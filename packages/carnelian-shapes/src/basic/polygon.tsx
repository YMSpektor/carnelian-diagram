/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { PolygonCollider, withInteractivePolyline } from "@carnelian/interaction";
import { PolygonBaseProps } from ".";

export interface PolygonProps extends PolygonBaseProps {}

export const Polygon: DiagramElement<PolygonProps> = function(props) {
    const { points, onChange, ...rest } = props;
    const polygonProps = {
        ...rest,
        style: {
            ...rest.style,
            "fill-rule": "evenodd"
        }
    }

    return (
        <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} {...polygonProps} />
    );
};

export const InteractivePolygon = withInteractivePolyline(
    Polygon, true, 3,
    (props) => PolygonCollider(props.points)
);