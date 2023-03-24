import "setimmediate";

const localSetImmediate = setImmediate;
const localClearImmediate = clearImmediate;
const localSetTimeout: (callback: () => void, timeout?: number) => number = setTimeout;
const localClearTimeout = clearTimeout;
const requestIdleCallbackShim = function(callback: () => void) {
    return localSetTimeout(callback, 0);
}
const cancelIdleCallbackShim = function(id: number) {
    localClearTimeout(id);
}
const localRequestIdleCallback = typeof requestIdleCallback === 'function' ? requestIdleCallback : requestIdleCallbackShim;
const localCancelIdleCallback = typeof cancelIdleCallback === 'function' ? cancelIdleCallback : cancelIdleCallbackShim;

export function scheduleImmediate(callback: () => void): () => void {
    const scheduleId = localSetImmediate(callback);

    return () => {
        localClearImmediate(scheduleId);
    }
};

export function scheduleIdle(callback: () => void): () => void {
    const scheduleId = localRequestIdleCallback(callback);

    return () => {
        localCancelIdleCallback(scheduleId);
    }
};