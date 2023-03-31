/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";;
import { SquareBaseProps } from ".";
import { withInteractiveSquare } from "../interaction";

export interface SquareProps extends SquareBaseProps { }

export const Square: DiagramElement<SquareProps> = function(props) {
    let { onChange, x, y, size, ...rest } = props;

    return (
        <rect x={x} y={y} width={size} height={size} {...rest} />
    );
};

export const InteractiveSquare = withInteractiveSquare(Square);