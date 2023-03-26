import { Reference } from "../utils/types";
import { ActionCallback, DiagramElementAction, InteractionContext } from ".";
import { DiagramElementNode, RenderContext, useContext, useEffect, useState } from "..";

export function useAction<T>(actionType: string, callback: ActionCallback<T>, element?: DiagramElementNode) {
    const renderContext = useContext(RenderContext);
    const curElement = element || renderContext?.currentElement();
    if (!curElement) {
        throw new Error("The useAction hook is not allowed to be called from here. Current element is not defined");
    }

    const interactions = useContext(InteractionContext);
    if (!interactions) {
        return;
    }

    const [storedActions] = useState<Reference<DiagramElementAction<T> | undefined>>({value: undefined});

    const action: DiagramElementAction<T> = {
        element: curElement,
        callback,
        action: actionType
    }
    interactions.updateActions(action, storedActions.value);
    storedActions.value = action; // Setting a state will cause an infinite loop

    useEffect(() => {
        return () => {
            interactions.updateActions(undefined, storedActions.value);
            storedActions.value = undefined;
        }
    }, [interactions]);
}