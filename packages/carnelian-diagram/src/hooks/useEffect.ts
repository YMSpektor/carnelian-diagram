import { useContext, useState } from ".";
import { ComponentCleanups, Effect, EffectCleanup, RenderContext } from "..";

function compareArrays(a: any[], b: any[]): boolean {
    return a.length === b.length && a.every((x, i) => Object.is(x, b[i]));
}

interface StoredEffect {
    dependencies?: any[];
    cleanup?: EffectCleanup | void;
}

export function useEffect(effect: Effect, dependencies: any[] | undefined) {
    const renderContext = useContext(RenderContext);
    let curNode = renderContext?.currentNode;
    const diagram = renderContext?.currentDiagram;
    if (!curNode) {
        throw new Error("The useEffect hook is not allowed to be called from here. Current element is not defined");
    }

    const cleanups = curNode.cleanups = (curNode.cleanups || new ComponentCleanups());
    const [storedEffect] = useState<StoredEffect>({});
    if (!dependencies || !storedEffect.dependencies || !compareArrays(dependencies, storedEffect.dependencies)) {
        storedEffect.dependencies = dependencies;
        diagram?.schedule(() => {
            storedEffect.cleanup && cleanups.invokeCleanup(storedEffect.cleanup);
            const cleanup = storedEffect.cleanup = effect();
            if (cleanup) {
                cleanups.registerCleanup(cleanup);
            }
        });
    }
}