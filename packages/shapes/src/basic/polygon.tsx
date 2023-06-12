/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { PolygonBaseProps } from "..";
import { withInteractiveRotatablePolygon } from "../hocs";

export interface PolygonProps extends PolygonBaseProps {}

export const Polygon: DiagramElement<PolygonProps> = function(props) {
    const { points, onChange, ...rest } = props;
    const polygonProps = {
        ...rest,
        style: {
            ...rest.style,
            fillRule: "evenodd"
        }
    }

    return (
        <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} {...polygonProps} />
    );
};

export const InteractivePolygon = withInteractiveRotatablePolygon(Polygon);