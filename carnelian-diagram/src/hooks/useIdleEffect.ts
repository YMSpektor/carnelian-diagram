import { renderContext } from "..";

export function useIdleEffect(effect: () => void): void {
    renderContext.idleEffects.push(effect);
}