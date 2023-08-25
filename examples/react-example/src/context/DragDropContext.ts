import { createContext } from "react";
import { DiagramElement } from "@carnelian-diagram/core";
import { Point } from "@carnelian-diagram/interactivity/geometry";

export type ElementFactory<T> = (p: Point, props: T) => T;

export interface DragDropContextType {
    draggedElement: {
        elementType: DiagramElement<any>;
        elementProps: any;
        factory: ElementFactory<any>;
    } | null
}

export const DragDropContext = createContext<DragDropContextType>({draggedElement: null });