import { RenderContext, useContext, useEffect, useState } from "@carnelian/diagram";
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

    const [key] = useState({});

    const controls: DiagramElementControls = {
        element: curElement,
        callback
    }
    interactions.updateControls(key, controls);

    useEffect(() => {
        return () => {
            interactions.updateControls(key, undefined);
        }
    }, []);
}