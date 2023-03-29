import { createContext } from "@carnelian/diagram";
import { RenderEdgeCallback, RenderHandleCallback } from "..";

export interface ControlsContextType {
    renderHandle: RenderHandleCallback;
    renderEdge: RenderEdgeCallback;
}

export const ControlsContext = createContext<ControlsContextType>({
    renderHandle: () => null,
    renderEdge: () => null
});