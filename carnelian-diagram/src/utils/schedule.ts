export function schedule(callback: () => void): () => void {
    if (typeof requestIdleCallback !== 'undefined') {
        const scheduleId = requestIdleCallback(callback);
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