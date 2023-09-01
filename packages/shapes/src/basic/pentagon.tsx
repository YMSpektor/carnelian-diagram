/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { PolygonCollider } from "@carnelian-diagram/interactivity";
import { RectBaseProps } from "..";
import { withInteractiveRotatableRect, withInteractiveRotatableTextRect } from "../hocs";

export interface PentagonProps extends RectBaseProps {}

function toPolygon(props: PentagonProps) {
    const { x, y, width, height } = props;
    const cx = x + width / 2;
    const cy = y + height / 2;

    const angles = Array.from({length: 5}, (x, i) => -Math.PI / 2 + Math.PI / 2.5 * i);
    
    return [
        {x: cx, y},
        {x: x + width, y: cy + Math.sin(angles[1]) * height / 2},
        {x: cx + (width / 2) * Math.cos(angles[2]), y: y + height},
        {x: cx + (width / 2) * Math.cos(angles[3]), y: y + height},
        {x, y: cy + Math.sin(angles[4]) * height / 2}
    ];
};

const PentagonColliderFactory = (props: PentagonProps) => PolygonCollider(toPolygon(props));

export const Pentagon: DiagramElement<PentagonProps> = function(props) {
    let { onChange, x, y, width, height, ...rest } = props;
    const points = toPolygon(props);

    return (
        <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} {...rest} />
    );
};

export const InteractivePentagon = withInteractiveRotatableRect(Pentagon, PentagonColliderFactory);

export const InteractivePentagonWithText = withInteractiveRotatableTextRect(Pentagon, PentagonColliderFactory);