import { RenderContext, useContext, useEffect, useRef } from "@carnelian/diagram";
import { DiagramElementControls, InteractionContext, RenderControlsCallback } from "..";

export function useControls(callback: RenderControlsCallback) {
    const renderContext = useContext(RenderContext);

    const curElement = renderContext?.currentElement();
    if (!curElement) {
        throw new Error("The useControls hook is not allowed to be called from here. It must be called when element is rendering");
    }

    const interactions = useContext(InteractionContext);
    if (!interactions) {
        return;
    }

    const storedControls = useRef<DiagramElementControls | undefined>(undefined);

    const controls: DiagramElementControls = {
        element: curElement,
        callback
    }
    interactions.updateControls(controls, storedControls.current);
    storedControls.current = controls; // Setting a state will cause an infinite loop

    useEffect(() => {
        return () => {
            interactions.updateControls(undefined, storedControls.current);
            storedControls.current = undefined;
        }
    }, [interactions]);
}