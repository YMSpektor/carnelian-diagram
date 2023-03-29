import { DiagramElementNode, RenderContext, useContext, useEffect, useRef } from "@carnelian/diagram";
import { ActionCallback, DiagramElementAction, InteractionContext } from "..";

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

    const storedActions = useRef<DiagramElementAction<T> | undefined>(undefined);

    const action: DiagramElementAction<T> = {
        element: curElement,
        callback,
        action: actionType
    }
    interactions.updateActions(action, storedActions.current);
    storedActions.current = action; // Setting a state will cause an infinite loop

    useEffect(() => {
        return () => {
            interactions.updateActions(undefined, storedActions.current);
            storedActions.current = undefined;
        }
    }, [interactions]);
}