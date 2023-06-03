/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { withRotation } from "@carnelian-diagram/interaction";
import { RectBaseProps } from "..";
import { withInteractiveRotatableRect, withInteractiveRotatableTextRect } from "../hocs";
import { RectRotation } from "../utils";

export interface RectProps extends RectBaseProps {}

export const RawRect: DiagramElement<RectProps> = function(props) {
    const { onChange, ...rest } = props;

    return (
        <rect {...rest} />
    );
};

export const Rect = withRotation(RawRect, RectRotation());

export const InteractiveRect = withInteractiveRotatableRect(RawRect);

export const InteractiveRectWithText = withInteractiveRotatableTextRect(RawRect);