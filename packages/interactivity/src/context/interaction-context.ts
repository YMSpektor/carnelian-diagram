import { createContext, DiagramElementNode } from "@carnelian-diagram/core";
import { DiagramElementAction, DiagramElementControls, DiagramElementHitTest, DiagramElementIntersectionTest, DiagramElementTransform, InteractionController } from "..";

export interface InteractionContextType {
    getController(): InteractionController;
    updateControls(element: DiagramElementNode, key: {}, controls?: DiagramElementControls): void;
    updateHitTests(element: DiagramElementNode, priority: number, key: {}, hitTest?: DiagramElementHitTest): void;
    updateIntersectionTests(key: {}, intersectionTest?: DiagramElementIntersectionTest): void;
    updateActions(key: {}, action?: DiagramElementAction<any>): void;
    updateTransforms(element: DiagramElementNode, key: {}, transform?: DiagramElementTransform): void;
}

export const InteractionContext = createContext<InteractionContextType | null>(null);