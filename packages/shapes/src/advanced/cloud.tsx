/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { RectBaseProps } from "..";
import { withInteractiveRotatableRect, withInteractiveRotatableTextRect } from "../hocs";

export interface CloudProps extends RectBaseProps {}

export const Cloud: DiagramElement<CloudProps> = function(props) {
    const { x, y, width, height, ...rest } = props;

    const path = `
       M${x + width / 6} ${y + 3 * height / 4} c${-width / 4.5} ${0}, ${-width / 4.5} ${-height / 2}, ${0} ${-height / 2}
       c${width / 20} ${-height / 3.1}, ${3.5 * width / 10} ${-height / 3.1}, ${2 * width / 5} ${-height / 15}
       c${width / 10} ${-height / 8}, ${2.7 * width / 10} ${-height / 20}, ${width / 3.5} ${height / 6}
       c${width / 5.1} ${0}, ${width / 5.1} ${height / 2}, ${-width / 10} ${height / 2.5}
       c${-width / 20} ${height / 4}, ${-width / 5} ${height / 5}, ${-width / 4} ${height / 10}
       C${x + 2.3 * width / 5} ${y + 1.04 * height}, ${x + width / 5} ${y + 1.1 * height}, ${x + width / 6} ${y + 3 * height / 4}Z
    `;

    return (
        <path d={path} {...rest} />
    );
}

export const InteractiveCloud = withInteractiveRotatableRect(Cloud);

export const InteractiveCloudWithText = withInteractiveRotatableTextRect(Cloud);