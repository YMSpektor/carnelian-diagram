import { DiagramElementControls, InteractionContext, RenderControlsCallback } from ".";
import { renderContext, useContext, useEffect, useState } from "..";

export function useControls(callback: RenderControlsCallback) {
    const curElement = renderContext.currentElement();
    if (!curElement) {
        throw new Error("The useControls hook is not allowed to be called from here. It must be called when element is rendering");
    }

    const interactions = useContext(InteractionContext);
    if (!interactions) {
        throw new Error("InteractionContext is not defined");
    }

    const [storedControls] = useState<[DiagramElementControls | undefined]>([undefined]);

    const controls: DiagramElementControls = {
        element: curElement,
        callback
    }
    interactions.updateControls(controls, storedControls[0]);
    storedControls[0] = controls; // Setting a state will cause an infinite loop

    useEffect(() => {
        return () => {
            interactions.updateControls(undefined, storedControls[0]);
            storedControls[0] = undefined;
        }
    }, [interactions]);
}