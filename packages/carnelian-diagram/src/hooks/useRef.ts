import { useState } from "./useState";
import { MutableRefObject, RefObject } from "../utils/types";

export function useRef<T>(initialValue: T): MutableRefObject<T>;
export function useRef<T>(initialValue: T | null): RefObject<T>;
export function useRef<T>(initialValue: T | null): RefObject<T> {
    const [ref] = useState({current: initialValue});
    return ref;
}