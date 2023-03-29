/** @jsxImportSource @carnelian/diagram */

import { RectBaseProps, withRectBase } from "./rect-base";

export interface RhombusProps extends RectBaseProps {}

export const Rhombus = withRectBase<RhombusProps>(function(props) {
    const { onChange, x, y, width, height, ...rest } = props;
    const rx = width / 2;
    const ry = height / 2;
    const points = [
        {x, y: y + ry},
        {x: x + rx, y},
        {x: x + width, y: y + ry},
        {x: x + rx, y: y + height}
    ];

    return (
        <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} {...rest} />
    );
});