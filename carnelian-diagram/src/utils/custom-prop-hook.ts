export class CustomPropHook<T> {
    constructor(private value: T) {}

    hook(node: Record<string, T | undefined>, propertyName: string): void {
        node[propertyName] = this.value;
    }

    unhook(node: Record<string, T | undefined>, propertyName: string): void {
        node[propertyName] = undefined;
    }
}