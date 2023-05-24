import { RenderContext, useContext, useEffect, useState } from "@carnelian-diagram/core";
import { DiagramElementTransform, InteractionContext } from "..";

export function useTransform(transform?: DOMMatrixReadOnly): DOMMatrixReadOnly {
    const renderContext = useContext(RenderContext);

    const curElement = renderContext?.currentElement();
    if (!curElement) {
        throw new Error("The useTransform hook is not allowed to be called from here. It must be called when element is rendering");
    }

    const interactions = useContext(InteractionContext);
    if (!interactions) {
        return new DOMMatrix();
    }

    if (arguments.length > 0) {
        const [key] = useState({});
        const elementTransform: DiagramElementTransform = {
            element: curElement,
            transform: transform || new DOMMatrix()
        };
        interactions.updateTransforms(curElement, key, elementTransform);

        useEffect(() => {
            return () => {
                interactions.updateTransforms(curElement, key, undefined);
            }
        }, []);
    }

    return interactions.getController().getElementTransform(curElement);
}