import { RenderContext, useContext, useEffect } from "@carnelian-diagram/core";
import { DiagramElementBounds, InteractionContext } from "..";
import { Rect } from "../geometry";

export function useBounds(bounds: Rect | null) {
    const renderContext = useContext(RenderContext);
    const curElement = renderContext?.currentElement();
    if (!curElement) {
        throw new Error("The useBounds hook is not allowed to be called from here. Current element is not defined");
    }

    const interactions = useContext(InteractionContext);
    if (!interactions) {
        return;
    }

    const elementBounds: DiagramElementBounds | undefined = bounds ? {
        bounds,
        element: curElement
    } : undefined;
    interactions.updateBounds(curElement, elementBounds);

    useEffect(() => {
        return () => {
            interactions.updateBounds(curElement, undefined);
        }
    }, []);
}