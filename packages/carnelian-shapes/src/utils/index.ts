export * from "./text-utils";

export type NumberOrPercentage = number | string;

export function isPercentage(value: NumberOrPercentage): value is string {
    return typeof value === "string" && value.charAt(value.length - 1) === "%";
}

export function convertPercentage(value: NumberOrPercentage, base: number): number {
    return isPercentage(value) ? parseFloat(value) * base / 100 : +value;
}