export function schedule(callback: () => void): () => void {
    if (typeof requestIdleCallback !== 'undefined') {
        const scheduleId = requestIdleCallback(callback, {timeout: 0});
        return () => {
            cancelIdleCallback(scheduleId);
        }
    }
    else {
        const scheduleId = setImmediate(callback);
        return () => {
            clearImmediate(scheduleId);
        }
    }
};