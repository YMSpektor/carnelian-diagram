import { createContext, DiagramNode } from "../diagram";
import { DiagramElementControls } from "./diagram-controls";
import { DiagramElementHitTest } from "./hit-tests";

export interface InteractionContextType {
    isSelected: (element: DiagramNode) => boolean;
    updateControls: (controls?: DiagramElementControls, prevControls?: DiagramElementControls) => void;
    updateHitTests: (hitTests?: DiagramElementHitTest, prevHitTests?: DiagramElementHitTest) => void;
}

export const InteractionContext = createContext<InteractionContextType>({
    isSelected: (element) => false,
    updateControls: (controls, prevControls) => {},
    updateHitTests: (hitTests, prevHitTests) => {},
});