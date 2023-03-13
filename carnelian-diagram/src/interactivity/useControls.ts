import { DiagramElementControls, InteractionContext, RenderControlsCallback } from ".";
import { renderContext, useContext, useEffect, useState } from "..";

export function useControls(callback: RenderControlsCallback, deps: any[]) {
    const curElement = renderContext.currentElement;

    if (!curElement) {
        throw new Error("The useControls hook is not allowed to be called from here. It must be called when element is rendering");
    }

    const [storedControls, setStoredControls] = useState<DiagramElementControls | undefined>(undefined);
    const interactions = useContext(InteractionContext);

    useEffect(() => {
        const controls: DiagramElementControls = {
            element: curElement,
            renderCallback: callback
        }
        interactions.updateControls(controls, storedControls);
        setStoredControls(controls);
    }, deps);
}