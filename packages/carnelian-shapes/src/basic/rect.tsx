/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { RectBaseProps } from ".";
import { withInteractiveRect } from "../interaction";

export interface RectProps extends RectBaseProps {}

export const Rect: DiagramElement<RectProps> = function(props) {
    const { onChange, ...rest } = props;

    return (
        <rect {...rest} />
    );
};

export const InteractiveRect = withInteractiveRect(Rect);