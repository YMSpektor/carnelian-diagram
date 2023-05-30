/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { PolygonCollider, withRotation } from "@carnelian-diagram/interaction";
import { RectBaseProps } from "..";
import { withInteractiveRotatableRect, withInteractiveRotatableTextRect } from "../hocs";
import { RectRotation } from "../utils";

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

const DiamondColliderFactory = (props: DiamondProps) => PolygonCollider(toPolygon(props));

export const RawDiamond: DiagramElement<DiamondProps> = function(props) {
    const { onChange, x, y, width, height, ...rest } = props;
    const points = toPolygon(props);

    return (
        <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} {...rest} />
    );
};

export const Diamond = withRotation(RawDiamond, RectRotation);

export const InteractiveDiamond = withInteractiveRotatableRect(
    RawDiamond, 
    DiamondColliderFactory
);

export const InteractiveDiamondWithText = withInteractiveRotatableTextRect(
    RawDiamond, 
    DiamondColliderFactory
);
