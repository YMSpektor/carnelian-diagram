/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { withInteractiveLine } from "@carnelian/interaction";
import { LineBaseProps } from "..";

export interface LineProps extends LineBaseProps {}

export const Line: DiagramElement<LineProps> = function(props) {
    const { onChange, ...rest } = props;

    return (
        <line {...rest} />
    );
};

export const InteractiveLine = withInteractiveLine(Line);