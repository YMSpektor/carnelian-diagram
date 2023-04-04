/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { RectBaseProps } from ".";
import { withInteractiveRect } from "@carnelian/interaction";

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

export const InteractiveEllipse = withInteractiveRect(Ellipse);