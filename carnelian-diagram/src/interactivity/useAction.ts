import { ActionCallback, DiagramElementAction, InteractionContext } from ".";
import { renderContext, useContext, useEffect, useState } from "..";

export function useAction<T>(action: string, callback: ActionCallback<T>) {
    const curElement = renderContext.currentElement;

    if (!curElement) {
        throw new Error("The useAction hook is not allowed to be called from here. Current element is not defined");
    }

    const interactions = useContext(InteractionContext);
    if (!interactions) {
        throw new Error("InteractionContext is not defined");
    }

    const [storedActions] = useState<[DiagramElementAction<T> | undefined]>([undefined]);

    const behavior: DiagramElementAction<T> = {
        element: curElement,
        callback,
        action
    }
    interactions.updateActions(behavior, storedActions[0]);
    storedActions[0] = behavior; // Setting a state will cause an infinite loop

    useEffect(() => {
        return () => {
            interactions.updateActions(undefined, storedActions[0]);
        }
    }, [interactions]);
}