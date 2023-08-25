/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { withInteractiveLine } from "@carnelian-diagram/interactivity";
import { radToDeg } from "@carnelian-diagram/interactivity/geometry";
import { LineBaseProps } from "..";
import { LineCap } from "../line-caps";

export interface LineProps extends LineBaseProps {}

export const Line: DiagramElement<LineProps> = function(props) {
    const { onChange, startLineCap, endLineCap, ...rest } = props;

    return (
        <>
            <line {...rest} />
            { startLineCap && 
                <LineCap 
                    kind={startLineCap.kind} 
                    size={startLineCap.size} 
                    x={props.x1} 
                    y={props.y1} 
                    rotation={radToDeg(Math.atan2(props.y1 - props.y2, props.x1 - props.x2))} 
                    style={props.style} 
                /> }
            { endLineCap && 
                <LineCap 
                    kind={endLineCap.kind} 
                    size={endLineCap.size} 
                    x={props.x2} 
                    y={props.y2} 
                    rotation={radToDeg(Math.atan2(props.y2 - props.y1, props.x2 - props.x1))} 
                    style={props.style} 
                /> }
        </>
    );
};

export const InteractiveLine = withInteractiveLine(Line);