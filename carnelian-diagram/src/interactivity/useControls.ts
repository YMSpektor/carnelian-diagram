import { DiagramElementControls, InteractionContext, RenderControlsCallback } from ".";
import { renderContext, useContext, useEffect, useState } from "..";

export function useControls(callback: RenderControlsCallback) {
    const curElement = renderContext.currentElement;

    if (!curElement) {
        throw new Error("The useControls hook is not allowed to be called from here. It must be called when element is rendering");
    }

    const [storedControls, setStoredControls] = useState<DiagramElementControls | undefined>(undefined);
    const interactions = useContext(InteractionContext);

    const controls: DiagramElementControls = {
        element: curElement,
        callback
    }
    interactions.updateControls(controls, storedControls);
    setStoredControls(controls);

    useEffect(() => {
        return () => {
            interactions.updateControls(undefined, storedControls);
        }
    }, [interactions, storedControls]);
}