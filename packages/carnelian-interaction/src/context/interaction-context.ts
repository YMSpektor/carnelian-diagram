import { createContext, DiagramElementNode } from "@carnelian/diagram";
import { DiagramElementAction, DiagramElementControls, DiagramElementHitTest, DiagramElementIntersectionTest } from "..";

export interface InteractionContextType {
    updateControls(element: DiagramElementNode, key: {}, controls?: DiagramElementControls): void;
    updateHitTests(element: DiagramElementNode, priority: number, key: {}, hitTest?: DiagramElementHitTest): void;
    updateIntersectionTests(key: {}, intersectionTest?: DiagramElementIntersectionTest): void;
    updateActions(key: {}, action?: DiagramElementAction<any>): void;
}

export const InteractionContext = createContext<InteractionContextType | null>(null);