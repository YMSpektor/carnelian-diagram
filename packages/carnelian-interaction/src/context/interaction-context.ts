import { createContext, DiagramElementNode } from "@carnelian/diagram";
import { DiagramElementAction, DiagramElementControls, DiagramElementHitTest, DiagramElementIntersectionTest } from "..";

export interface InteractionContextType {
    updateControls(key: {}, controls?: DiagramElementControls): void;
    updateHitTests(key: {priority: number, element: DiagramElementNode}, hitTest?: DiagramElementHitTest): void;
    updateIntersectionTests(key: {}, intersectionTest?: DiagramElementIntersectionTest): void;
    updateActions(key: {}, action?: DiagramElementAction<any>): void;
}

export const InteractionContext = createContext<InteractionContextType | null>(null);