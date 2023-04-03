/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { PolygonCollider } from "@carnelian/interaction";
import { RectBaseProps } from ".";
import { withInteractiveRect } from "../interaction";

export interface DiamondProps extends RectBaseProps {}

function toPolygon(props: DiamondProps) {
    const { x, y, width, height } = props;
    const rx = width / 2;
    const ry = height / 2;
    return [
        {x, y: y + ry},
        {x: x + rx, y},
        {x: x + width, y: y + ry},
        {x: x + rx, y: y + height}
    ];
 
}

export const Diamond: DiagramElement<DiamondProps> = function(props) {
    const { onChange, x, y, width, height, ...rest } = props;
    const points = toPolygon(props);

    return (
        <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} {...rest} />
    );
};

export const InteractiveDiamond = withInteractiveRect(
    Diamond,
    (props) => PolygonCollider(toPolygon(props))
);