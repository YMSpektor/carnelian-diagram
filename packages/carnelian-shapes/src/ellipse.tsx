/** @jsxImportSource @carnelian/diagram */

import { RectBaseProps, withRectBase } from "./rect-base";

export interface EllipseProps extends RectBaseProps {}

export const Ellipse = withRectBase<EllipseProps>(function(props) {
    const { onChange, x, y, width, height, ...rest } = props;
    const rx = width / 2;
    const ry = height / 2;
    const cx = x + rx;
    const cy = y + ry;

    return (
        <ellipse {...{cx, cy, rx, ry}} {...rest} />
    );
});