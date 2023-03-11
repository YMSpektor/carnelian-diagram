import { createContext } from "../diagram";
import { DiagramControls } from "./diagram-controls";
import { HitTests } from "./hit-tests";

export interface InteractionContextType {
    controls: DiagramControls;
    hitTests: HitTests;
}

export const InteractionContext = createContext<InteractionContextType>({
    controls: new DiagramControls(),
    hitTests: new HitTests(),
});