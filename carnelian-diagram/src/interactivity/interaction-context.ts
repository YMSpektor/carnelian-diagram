import { createContext, DiagramNode } from "../diagram";
import { HitTests } from "./hit-tests";

export type RenderControlsCallback = (transform: DOMMatrixReadOnly, element: DiagramNode) => JSX.Element;

export interface DiagramElementControls {
    element: DiagramNode;
    renderCallback: RenderControlsCallback;
}

export interface InteractionContextType {
    hitTests: HitTests;
    isSelected: (element: DiagramNode) => boolean;
    updateControls: (controls: DiagramElementControls, prevControls?: DiagramElementControls) => void;
}

export const InteractionContext = createContext<InteractionContextType>({
    hitTests: new HitTests(),
    isSelected: (element) => false,
    updateControls: (controls, prevControls) => {},
});