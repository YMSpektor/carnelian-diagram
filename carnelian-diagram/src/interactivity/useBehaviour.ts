import { BehaviourCallback, DiagramElementBehaviour, InteractionContext } from ".";
import { renderContext, useContext, useEffect, useState } from "..";

export function useBehaviour<T>(action: string, callback: BehaviourCallback<T>) {
    const curElement = renderContext.currentElement;

    if (!curElement) {
        throw new Error("The useBehaviour hook is not allowed to be called from here. Current element is not defined");
    }

    const interactions = useContext(InteractionContext);
    if (!interactions) {
        throw new Error("InteractionContext is not defined");
    }

    const [storedBehaviours] = useState<[DiagramElementBehaviour<T> | undefined]>([undefined]);

    const behavior: DiagramElementBehaviour<T> = {
        element: curElement,
        callback,
        action
    }
    interactions.updateBehaviours(behavior, storedBehaviours[0]);
    storedBehaviours[0] = behavior; // Setting a state will cause an infinite loop

    useEffect(() => {
        return () => {
            interactions.updateBehaviours(undefined, storedBehaviours[0]);
        }
    }, [interactions]);
}