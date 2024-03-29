/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { EllipseCollider } from "@carnelian-diagram/interactivity";
import { RectBaseProps } from "..";
import { withInteractiveRotatableRect, withInteractiveRotatableTextRect } from "../hocs";

export interface EllipseProps extends RectBaseProps {}

const EllipseColliderFactory = (props: EllipseProps) => EllipseCollider({center: {x: props.x + props.width / 2, y: props.y + props.height / 2}, rx: props.width / 2, ry: props.height / 2});

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

export const InteractiveEllipse = withInteractiveRotatableRect(
    Ellipse, 
    EllipseColliderFactory
);

export const InteractiveEllipseWithText = withInteractiveRotatableTextRect(
    Ellipse, 
    EllipseColliderFactory
);