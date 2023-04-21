/** @jsxImportSource @carnelian/diagram */

import { JSX } from "@carnelian/diagram/jsx-runtime";
import { InteractionServive } from ".";
import { ControlsContextType } from "../context";
import { CreateHitTestProps } from "../hit-tests";

export interface ControlRenderingService extends InteractionServive {
    type: "control_rendering_service";
    controlsContext: ControlsContextType;
    renderHandle(kind: string, x: number, y: number, otherProps: ControlProps): JSX.Element;
    renderEdge(kind: string, x1: number, y1: number, x2: number, y2: number, otherProps: ControlProps): JSX.Element;
}

export function isControlRenderingService(service: InteractionServive): service is ControlRenderingService {
    return service.type === "control_rendering_service";
}

export type ControlProps = Partial<CreateHitTestProps> & {
    className: string;
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