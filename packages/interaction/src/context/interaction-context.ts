import { createContext, DiagramElementNode } from "@carnelian-diagram/core";
import { DiagramElementAction, DiagramElementControls, DiagramElementHitTest, DiagramElementIntersectionTest, DiagramElementTransform } from "..";

export interface InteractionContextType {
    updateControls(element: DiagramElementNode, key: {}, controls?: DiagramElementControls): void;
    updateHitTests(element: DiagramElementNode, priority: number, key: {}, hitTest?: DiagramElementHitTest): void;
    updateIntersectionTests(key: {}, intersectionTest?: DiagramElementIntersectionTest): void;
    updateActions(key: {}, action?: DiagramElementAction<any>): void;
    updateTransforms(element: DiagramElementNode, key: {}, transform?: DiagramElementTransform<any>): void;
}

export const InteractionContext = createContext<InteractionContextType | null>(null);