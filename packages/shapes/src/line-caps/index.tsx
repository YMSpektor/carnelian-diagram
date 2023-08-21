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

registerLineCap("arrow1", Arrow1);

export * from "./arrow1";