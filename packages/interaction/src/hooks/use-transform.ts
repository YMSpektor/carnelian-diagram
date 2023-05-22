import { RenderContext, useContext, useEffect, useState } from "@carnelian-diagram/core";
import { DiagramElementTransform, InteractionContext } from "..";

export function useTransform<T>(transform: DOMMatrixReadOnly) {
    const renderContext = useContext(RenderContext);

    const curElement = renderContext?.currentElement();
    if (!curElement) {
        throw new Error("The useTransform hook is not allowed to be called from here. It must be called when element is rendering");
    }

    const interactions = useContext(InteractionContext);
    if (!interactions) {
        return;
    }

    const [key] = useState({});
    const elementTransform: DiagramElementTransform<T> = {
        element: curElement,
        transform
    };
    interactions.updateTransforms(curElement, key, elementTransform);

    useEffect(() => {
        return () => {
            interactions.updateTransforms(curElement, key, undefined);
        }
    }, []);
}