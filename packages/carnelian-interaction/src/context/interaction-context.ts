import { createContext } from "@carnelian/diagram";
import { DiagramElementAction, DiagramElementBounds, DiagramElementControls, DiagramElementHitTest } from "..";

export interface InteractionContextType {
    updateControls(controls?: DiagramElementControls, prevControls?: DiagramElementControls): void;
    updateHitTests(hitTests?: DiagramElementHitTest, prevHitTests?: DiagramElementHitTest): void;
    updateActions(action?: DiagramElementAction<any>, prevAction?: DiagramElementAction<any>): void;
    updateBounds(bounds?: DiagramElementBounds, prevBounds?: DiagramElementBounds): void;
}

export const InteractionContext = createContext<InteractionContextType | null>(null);