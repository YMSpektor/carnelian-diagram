import { Diagram } from "@carnelian/diagram";

export interface InteractionServive {
    type: string;
    init?: (diagram: Diagram, root: HTMLElement) => void;
    release?: () => void;
}

export function setElementCursor(element: HTMLElement, cursor?: string | null) {
    if (cursor) {
        element.style.cursor = cursor;
    }
    else {
        element.style.removeProperty("cursor");
    }
}

export * from "./selection-service";
export * from "./element-interaction-service";
export * from "./grid-snapping-service";
export * from "./deletion-service";
export * from "./element-drawing-service";
export * from "./control-rendering-service";