/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { ACT_EDIT_TEXT, PolygonCollider, withInteractiveRect, withInteractiveText } from "@carnelian-diagram/interaction";
import { RectBaseProps } from "..";
import { withText } from "../hocs";
import { textEditorStyles } from "../utils";
import { MultilineText } from "./multiline-text";

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
    {
        collider: (props) => PolygonCollider(toPolygon(props)),
        innerHitArea: (hitArea) => ({...hitArea, dblClickAction: ACT_EDIT_TEXT})
    }
);

export const InteractiveDiamondWithText = withText(
    InteractiveDiamond,
    withInteractiveText(
        MultilineText,
        (props) => props,
        (props) => textEditorStyles(props.textStyle)
    ),
    (props) => props
);
