/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { withRotation } from "@carnelian-diagram/interaction";
import { SquareBaseProps } from "..";
import { SquareRotation, withInteractiveRotatableSquare, withInteractiveRotatableTextSquare } from "../utils";
;

export interface SquareProps extends SquareBaseProps { }

export const RawSquare: DiagramElement<SquareProps> = function(props) {
    let { onChange, x, y, size, ...rest } = props;

    return (
        <rect x={x} y={y} width={size} height={size} {...rest} />
    );
};

export const Square = withRotation(RawSquare, SquareRotation);

export const InteractiveSquare = withInteractiveRotatableSquare(RawSquare);

export const InteractiveSquareWithText = withInteractiveRotatableTextSquare(RawSquare);