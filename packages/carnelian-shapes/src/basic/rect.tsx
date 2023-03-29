/** @jsxImportSource @carnelian/diagram */

import { RectBaseProps, withRectBase } from "./rect-base";

export interface RectProps extends RectBaseProps {}

export const Rect = withRectBase<RectProps>(function(props) {
    const { onChange, ...rest } = props;

    return (
        <rect {...rest} />
    );
});