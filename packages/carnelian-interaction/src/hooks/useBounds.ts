import { RenderContext, useContext, useEffect, useRef } from "@carnelian/diagram";
import { Rect } from "@carnelian/diagram/geometry";
import { DiagramElementBounds, InteractionContext } from "..";

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

    const storedBounds = useRef<DiagramElementBounds | undefined>(undefined);

    const bounds: DiagramElementBounds = {
        element: curElement,
        bounds: boundsRect
    }
    interactions.updateBounds(bounds, storedBounds.current);
    storedBounds.current = bounds; // Setting a state will cause an infinite loop

    useEffect(() => {
        return () => {
            interactions.updateBounds(undefined, storedBounds.current);
            storedBounds.current = undefined;
        }
    }, [interactions]);
}