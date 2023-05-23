/** @jsxImportSource @carnelian-diagram/core */

import { JSX } from "@carnelian-diagram/core/jsx-runtime";
import { InteractionServive } from ".";
import { ControlProps, ControlsContextType } from "../context";

export interface ControlRenderingService extends InteractionServive {
    type: "control_rendering_service";
    controlsContext: ControlsContextType;
    renderHandle(kind: string, x: number, y: number, otherProps: ControlProps): JSX.Element;
    renderEdge(kind: string, x1: number, y1: number, x2: number, y2: number, otherProps: ControlProps): JSX.Element;
}

export function isControlRenderingService(service: InteractionServive): service is ControlRenderingService {
    return service.type === "control_rendering_service";
}

export class DefaultControlRenderingService implements ControlRenderingService {
    type: "control_rendering_service" = "control_rendering_service";
    controlsContext: ControlsContextType;

    constructor() {
        this.controlsContext = {
            renderHandle: this.renderHandle,
            renderEdge: this.renderEdge
        }
    }

    renderHandle(kind: string, x: number, y: number, otherProps: ControlProps) {
        let size = 8;
        switch (kind) {
            case "knob":
                size = 9;
                const points = [
                    {x: x - size / 2, y},
                    {x, y: y - size / 2},
                    {x: x + size / 2, y},
                    {x, y: y + size / 2}
                ];
                return <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} fill="orange" {...otherProps} />
            case "rotation":
                size = 10;
                return <path 
                    d={`M ${x + size / 2} ${y} a ${size / 2} ${size / 2} 0 1 1 ${-size / 2} ${-size / 2} l 2 0 l -3 -2 m 3 2 l -3 2`} 
                    stroke="deepskyblue" stroke-width={2} fill="white" fill-opacity={0} {...otherProps} />
            default:
                return <rect x={x - size / 2} y={y - size / 2} width={size} height={size} fill="yellow" {...otherProps} />
        }
    }

    renderEdge(kind: string, x1: number, y1: number, x2: number, y2: number, otherProps: ControlProps) {
        return (
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke-dasharray={4} {...otherProps} />
        )
    }
}