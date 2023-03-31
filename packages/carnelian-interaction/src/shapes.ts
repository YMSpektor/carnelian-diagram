import { HitTestCallback, IntersectionTestCallback } from ".";
import { Rect } from "./geometry";

export interface Shape {
    bounds: Readonly<Rect>;
    hitTestCallback: HitTestCallback;
    intersectionTestCallback: IntersectionTestCallback;
}