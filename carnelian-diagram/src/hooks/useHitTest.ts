import { getCurrentElement, HitTestCallback } from "..";

export function useHitTest(callback: HitTestCallback) {
    const curElement = getCurrentElement();
    if (curElement) {
        const oldCallback = curElement.hooks.hitTestCallback;
        curElement.hooks.hitTestCallback = !oldCallback ? callback : (transform, point, tolerance) => {
            return oldCallback(transform, point, tolerance) || callback(transform, point, tolerance);
        }
    }
    else {
        throw new Error("Invalid hook call. Current element is not defined");
    }
}