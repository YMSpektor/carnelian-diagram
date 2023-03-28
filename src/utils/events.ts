export type EventListener<T> = (args: T) => void;

export class Event<T> {
    private listeners: EventListener<T>[] = [];

    addListener(listener: EventListener<T>) {
        this.listeners.push(listener);
    }

    removeListener(listener: EventListener<T>) {
        this.listeners = this.listeners.filter(x => x !== listener);
    }

    emit(args: T) {
        this.listeners.forEach(listener => listener(args));
    }
}