/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { SquareBaseProps } from "..";
import { withInteractiveRotatableSquare, withInteractiveRotatableTextSquare } from "../hocs";
;

export interface SquareProps extends SquareBaseProps { }

export const Square: DiagramElement<SquareProps> = function(props) {
    let { onChange, x, y, size, ...rest } = props;

    return (
        <rect x={x} y={y} width={size} height={size} {...rest} />
    );
};

export const InteractiveSquare = withInteractiveRotatableSquare(Square);

export const InteractiveSquareWithText = withInteractiveRotatableTextSquare(Square);