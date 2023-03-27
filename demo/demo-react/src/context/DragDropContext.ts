import { DiagramElement } from "carnelian-diagram";
import { Point } from "carnelian-diagram/geometry";
import { createContext } from "react";

export type ElementFactory<T> = (p: Point, props: T) => T;

export interface DragDropContextType {
    draggedElement: {
        elementType: DiagramElement<any>;
        elementProps: any;
        factory: ElementFactory<any>;
    } | null
}

export const DragDropContext = createContext<DragDropContextType>({draggedElement: null });