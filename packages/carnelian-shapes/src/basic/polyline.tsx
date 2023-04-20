/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { withInteractivePolyline } from "@carnelian/interaction";
import { PolylineBaseProps } from ".";

export interface PolylineProps extends PolylineBaseProps {}

export const Polyline: DiagramElement<PolylineProps> = function(props) {
    const { points, onChange, ...rest } = props;
    const polylineProps = {
        ...rest,
        style: {
            ...rest.style,
            fill: "none"
        }
    }

    return (
        <polyline points={points.map(p => `${p.x},${p.y}`).join(" ")} {...polylineProps} />
    );
};

export const InteractivePolyline = withInteractivePolyline(Polyline, false, 2);