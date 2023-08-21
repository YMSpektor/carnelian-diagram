/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { withInteractivePolyline } from "@carnelian-diagram/interaction";
import { radToDeg } from "@carnelian-diagram/interaction/geometry";
import { PolylineBaseProps } from "..";
import { LineCap } from "../line-caps";

export interface PolylineProps extends PolylineBaseProps {}

export const Polyline: DiagramElement<PolylineProps> = function(props) {
    const { points, onChange, startLineCap, endLineCap, ...rest } = props;
    const polylineProps = {
        ...rest,
        style: {
            ...rest.style,
            fill: "none"
        }
    }

    return (
        <>
            <polyline points={points.map(p => `${p.x},${p.y}`).join(" ")} {...polylineProps} />
            { startLineCap && points.length >= 2 &&
                <LineCap 
                    kind={startLineCap.kind} 
                    size={startLineCap.size} 
                    x={props.points[0].x} 
                    y={props.points[0].y} 
                    rotation={radToDeg(Math.atan2(props.points[0].y - props.points[1].y, props.points[0].x - props.points[1].x))} 
                    style={polylineProps.style} 
                /> }
            { endLineCap && points.length >= 2 &&
                <LineCap 
                    kind={endLineCap.kind} 
                    size={endLineCap.size} 
                    x={props.points[props.points.length - 1].x} 
                    y={props.points[props.points.length - 1].y} 
                    rotation={radToDeg(Math.atan2(props.points[props.points.length - 1].y - props.points[props.points.length - 2].y, props.points[props.points.length - 1].x - props.points[props.points.length - 2].x))} 
                    style={polylineProps.style} 
                /> }
        </>
    );
};

export const InteractivePolyline = withInteractivePolyline(Polyline, false, 2);