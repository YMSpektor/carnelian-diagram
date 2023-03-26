import { Reference } from "../utils/types";
import { DiagramElementBounds, InteractionContext } from ".";
import { RenderContext, useContext, useEffect, useState } from "..";
import { Rect } from "../geometry";

export function useBounds(boundsRect: Rect) {
    const renderContext = useContext(RenderContext);
    const curElement = renderContext?.currentElement();
    if (!curElement) {
        throw new Error("The useBounds hook is not allowed to be called from here. Current element is not defined");
    }

    const interactions = useContext(InteractionContext);
    if (!interactions) {
        return;
    }

    const [storedBounds] = useState<Reference<DiagramElementBounds | undefined>>({value: undefined});

    const bounds: DiagramElementBounds = {
        element: curElement,
        bounds: boundsRect
    }
    interactions.updateBounds(bounds, storedBounds.value);
    storedBounds.value = bounds; // Setting a state will cause an infinite loop

    useEffect(() => {
        return () => {
            interactions.updateBounds(undefined, storedBounds.value);
            storedBounds.value = undefined;
        }
    }, [interactions]);
}