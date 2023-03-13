import { createContext, DiagramNode } from "../diagram";
import { DiagramControls } from "./diagram-controls";
import { HitTests } from "./hit-tests";

export interface InteractionContextType {
    controls: DiagramControls;
    hitTests: HitTests;
    isSelected: (element: DiagramNode) => boolean;
}

export const InteractionContext = createContext<InteractionContextType>({
    controls: new DiagramControls(),
    hitTests: new HitTests(),
    isSelected: (element) => false,
});