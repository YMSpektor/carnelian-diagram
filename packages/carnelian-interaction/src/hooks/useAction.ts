import { DiagramElementNode, RenderContext, useContext, useEffect, useState } from "@carnelian/diagram";
import { ActionCallback, DiagramElementAction, InteractionContext } from "..";

export function useAction<T>(actionType: string, callback?: ActionCallback<T>, element?: DiagramElementNode) {
    const renderContext = useContext(RenderContext);
    const curElement = element || renderContext?.currentElement();
    if (!curElement) {
        throw new Error("The useAction hook is not allowed to be called from here. Current element is not defined");
    }

    const interactions = useContext(InteractionContext);
    if (!interactions) {
        return;
    }

    const [key] = useState({});

    const action: DiagramElementAction<T> | undefined = callback ? {
        element: curElement,
        callback,
        action: actionType
    } : undefined;
    interactions.updateActions(key, action);

    useEffect(() => {
        return () => {
            interactions.updateActions(key, undefined);
        }
    }, []);
}