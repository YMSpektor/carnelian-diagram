/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { EllipseCollider, withRotation } from "@carnelian-diagram/interaction";
import { RectBaseProps } from "..";
import { RectRotation, withInteractiveRotatableRect, withInteractiveRotatableTextRect } from "../utils";

export interface EllipseProps extends RectBaseProps {}

const EllipseColliderFactory = (props: EllipseProps) => EllipseCollider({center: {x: props.x + props.width / 2, y: props.y + props.height / 2}, rx: props.width / 2, ry: props.height / 2});

export const RawEllipse: DiagramElement<EllipseProps> = function(props) {
    const { onChange, x, y, width, height, ...rest } = props;
    const rx = width / 2;
    const ry = height / 2;
    const cx = x + rx;
    const cy = y + ry;

    return (
        <ellipse {...{cx, cy, rx, ry}} {...rest} />
    );
};

export const Ellipse = withRotation(RawEllipse, RectRotation);

export const InteractiveEllipse = withInteractiveRotatableRect(
    RawEllipse, 
    EllipseColliderFactory
);

export const InteractiveEllipseWithText = withInteractiveRotatableTextRect(
    RawEllipse, 
    EllipseColliderFactory
);