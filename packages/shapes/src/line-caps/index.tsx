/** @jsxImportSource @carnelian-diagram/core */

import { DiagramComponent } from "@carnelian-diagram/core";
import { LineFigureStyle } from "..";

export interface LineCapSyle {
    kind: string;
    size: number;
}

export interface LineCapProps extends LineCapSyle {
    x: number;
    y: number;
    rotation: number;
    style?: LineFigureStyle;
}

export type LineCapComponent = DiagramComponent<LineCapProps>;

const lineCapRegistry = new Map<string, LineCapComponent>();

export function registerLineCap(kind: string, renderer: LineCapComponent) {
    lineCapRegistry.set(kind, renderer);
}

export function unregisterLineCap(kind: string) {
    lineCapRegistry.delete(kind);
}

export function allLineCapNames(): string[] {
    return [...lineCapRegistry.keys()];
}

export const LineCap: DiagramComponent<LineCapProps> = function(props) {
    const lineCap = lineCapRegistry.get(props.kind);
    return lineCap && (
        <g transform={`rotate(${props.rotation} ${props.x} ${props.y})`}>
            {lineCap.call(this, props)}
        </g>
    );
}

import { Arrow1 } from "./arrow1";
import { Arrow2 } from "./arrow2";
import { Arrow3 } from "./arrow3";
import { Diamond } from "./diamond";
import { Square } from "./square";
import { Circle } from "./circle";

registerLineCap("arrow1", Arrow1);
registerLineCap("arrow2", Arrow2);
registerLineCap("arrow3", Arrow3);
registerLineCap("diamond", Diamond);
registerLineCap("square", Square);
registerLineCap("circle", Circle);

export * from "./arrow1";
export * from "./arrow2";
export * from "./arrow3";
export * from "./diamond";
export * from "./square";
export * from "./circle";