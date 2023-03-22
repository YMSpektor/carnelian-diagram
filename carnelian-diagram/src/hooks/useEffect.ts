import { useContext, useState } from ".";
import { ComponentEffects, Effect, EffectCleanup, RenderContext } from "..";

function compareArrays(a: any[], b: any[]): boolean {
    return a.length === b.length && a.every((x, i) => x === b[i]);
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

    let effects: ComponentEffects;
    if (!curNode.hooks.effects) {
        curNode.hooks.effects = new ComponentEffects();
    }
    effects = curNode.hooks.effects;

    const [storedEffect] = useState<StoredEffect>({});
    if (!dependencies || !storedEffect.dependencies || !compareArrays(dependencies, storedEffect.dependencies)) {
        storedEffect.dependencies = dependencies;
        diagram?.schedule(() => {
            storedEffect.cleanup && effects.invokeCleanup(storedEffect.cleanup);
            const cleanup = storedEffect.cleanup = effect();
            if (cleanup) {
                effects.registerCleanup(cleanup);
            }
        });
    }
}