import { getCurrentElement, RenderControlsCallback } from "..";

export function useControls(callback: RenderControlsCallback) {
    const curElement = getCurrentElement();
    if (curElement) {
        const oldCallback = curElement.hooks.renderControlsCallback;
        curElement.hooks.renderControlsCallback = !oldCallback ? callback : (transform) => {
            return [oldCallback, callback]
                .map(cb => cb(transform));
        }
    }
    else {
        throw new Error("Invalid hook call. Current element is not defined");
    }
}