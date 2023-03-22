import "setimmediate";

const localSetImmediate = setImmediate;
const lolacClearImmediate = clearImmediate;

export function schedule(callback: () => void): () => void {
    const scheduleId = localSetImmediate(callback);

    return () => {
        lolacClearImmediate(scheduleId);
    }
};