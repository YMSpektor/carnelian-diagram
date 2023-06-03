/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { withRotation } from "@carnelian-diagram/interaction";
import { PolygonBaseProps } from "..";
import { withInteractiveRotatablePolygon } from "../hocs";
import { PolygonRotation } from "../utils";

export interface PolygonProps extends PolygonBaseProps {}

export const RawPolygon: DiagramElement<PolygonProps> = function(props) {
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

export const Polygon = withRotation(RawPolygon, PolygonRotation());

export const InteractivePolygon = withInteractiveRotatablePolygon(RawPolygon);