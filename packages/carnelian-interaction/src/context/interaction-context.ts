import { createContext } from "@carnelian/diagram";
import { DiagramElementAction, DiagramElementControls, DiagramElementHitTest, DiagramElementIntersectionTest } from "..";

export interface InteractionContextType {
    updateControls(newValue?: DiagramElementControls, prevValue?: DiagramElementControls): void;
    updateHitTests(newValue?: DiagramElementHitTest, prevValue?: DiagramElementHitTest): void;
    updateIntersectionTests(newValue?: DiagramElementIntersectionTest, prevValue?: DiagramElementIntersectionTest): void;
    updateActions(newValue?: DiagramElementAction<any>, prevValue?: DiagramElementAction<any>): void;
}

export const InteractionContext = createContext<InteractionContextType | null>(null);