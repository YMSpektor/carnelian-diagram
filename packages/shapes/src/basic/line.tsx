/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { withInteractiveLine } from "@carnelian-diagram/interaction";
import { LineBaseProps } from "..";

export interface LineProps extends LineBaseProps {}

export const Line: DiagramElement<LineProps> = function(props) {
    const { onChange, ...rest } = props;

    return (
        <line {...rest} />
    );
};

export const InteractiveLine = withInteractiveLine(Line);