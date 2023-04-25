/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { EllipseCollider, withInteractiveRect } from "@carnelian/interaction";
import { RectBaseProps } from "..";

export interface EllipseProps extends RectBaseProps {}

export const Ellipse: DiagramElement<EllipseProps> = function(props) {
    const { onChange, x, y, width, height, ...rest } = props;
    const rx = width / 2;
    const ry = height / 2;
    const cx = x + rx;
    const cy = y + ry;

    return (
        <ellipse {...{cx, cy, rx, ry}} {...rest} />
    );
};

export const InteractiveEllipse = withInteractiveRect(
    Ellipse,
    (props) => EllipseCollider({center: {x: props.x + props.width / 2, y: props.y + props.height / 2}, rx: props.width / 2, ry: props.height / 2})
);