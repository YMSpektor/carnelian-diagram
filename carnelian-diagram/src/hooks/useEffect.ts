import { useState } from ".";
import { renderContext } from "..";

function compareArrays(a: any[], b: any[]): boolean {
    return a.length === b.length && a.every((x, i) => x === b[i]);
}

export function useEffect(callback: () => (() => void) | void, dependencies: any[] | undefined) {
    const [deps, setDeps] = useState<any[] | undefined>(undefined);
    if (!dependencies || !deps || !compareArrays(dependencies, deps)) {
        setDeps(dependencies);
        renderContext.effects.push(callback); // TODO: clear effect when component is unmounted
    }
}