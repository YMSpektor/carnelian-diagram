import { 
    circleHitTest,
    circleIntersectionTest,
    HitTestCallback,
    IntersectionTestCallback,
    rectHitTest,
    rectIntersectionTest,
    Shape 
} from "@carnelian/interaction";
import { Rect } from "@carnelian/interaction/geometry";

export class RectShape implements Shape {
    bounds: Readonly<Rect>;
    hitTestCallback: HitTestCallback;
    intersectionTestCallback: IntersectionTestCallback;

    constructor(x: number, y: number, width: number, height: number) {
        this.bounds = {x, y, width, height};
        this.hitTestCallback = rectHitTest(x, y, width, height);
        this.intersectionTestCallback = rectIntersectionTest(x, y, width, height);
    }
}

export class CircleShape implements Shape {
    bounds: Readonly<Rect>;
    hitTestCallback: HitTestCallback;
    intersectionTestCallback: IntersectionTestCallback;

    constructor(x: number, y: number, radius: number) {
        this.bounds = {x: x - radius, y: y - radius, width: radius * 2, height: radius * 2};
        this.hitTestCallback = circleHitTest(x, y, radius);
        this.intersectionTestCallback = circleIntersectionTest(x, y, radius);
    }
}