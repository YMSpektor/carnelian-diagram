import { Reference } from "../utils/types";
import { DiagramElementControls, InteractionContext, RenderControlsCallback } from ".";
import { RenderContext, useContext, useEffect, useState } from "..";

export function useControls(callback: RenderControlsCallback) {
    const renderContext = useContext(RenderContext);

    const curElement = renderContext?.currentElement();
    if (!curElement) {
        throw new Error("The useControls hook is not allowed to be called from here. It must be called when element is rendering");
    }

    const interactions = useContext(InteractionContext);
    if (!interactions) {
        throw new Error("InteractionContext is not defined");
    }

    const [storedControls] = useState<Reference<DiagramElementControls | undefined>>({value: undefined});

    const controls: DiagramElementControls = {
        element: curElement,
        callback
    }
    interactions.updateControls(controls, storedControls.value);
    storedControls.value = controls; // Setting a state will cause an infinite loop

    useEffect(() => {
        return () => {
            interactions.updateControls(undefined, storedControls.value);
            storedControls.value = undefined;
        }
    }, [interactions]);
}