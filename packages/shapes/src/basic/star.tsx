/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { PolygonCollider } from "@carnelian-diagram/interactivity";
import { intersectLines, Point } from "@carnelian-diagram/interactivity/geometry";
import { RectBaseProps } from "..";
import { withInteractiveRotatableRect, withInteractiveRotatableTextRect } from "../hocs";

export interface StarProps extends RectBaseProps {}

function toPolygon(props: StarProps) {
    const { x, y, width, height } = props;
    const cx = x + width / 2;
    const cy = y + height / 2;

    const angles = Array.from({length: 5}, (x, i) => -Math.PI / 2 + Math.PI / 2.5 * i);
    
    const outerPts = [
        {x: cx, y},
        {x: x + width, y: cy + Math.sin(angles[1]) * height / 2},
        {x: cx + (width / 2) * Math.cos(angles[2]), y: y + height},
        {x: cx + (width / 2) * Math.cos(angles[3]), y: y + height},
        {x, y: cy + Math.sin(angles[4]) * height / 2}
    ];

    const innerPts = [
        intersectLines({a: outerPts[0], b: outerPts[2]}, {a: outerPts[1], b: outerPts[4]}, false, false)!,
        intersectLines({a: outerPts[0], b: outerPts[2]}, {a: outerPts[1], b: outerPts[3]}, false, false)!,
        intersectLines({a: outerPts[1], b: outerPts[3]}, {a: outerPts[2], b: outerPts[4]}, false, false)!,
        intersectLines({a: outerPts[3], b: outerPts[0]}, {a: outerPts[2], b: outerPts[4]}, false, false)!,
        intersectLines({a: outerPts[4], b: outerPts[1]}, {a: outerPts[0], b: outerPts[3]}, false, false)!
    ]

    return outerPts.reduce<Point[]>((acc, cur, i) => acc.concat(cur, innerPts[i] || cur), []);
};

const StarColliderFactory = (props: StarProps) => PolygonCollider(toPolygon(props));

export const Star: DiagramElement<StarProps> = function(props) {
    let { onChange, x, y, width, height, ...rest } = props;
    const points = toPolygon(props);

    return (
        <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} {...rest} />
    );
};

export const InteractiveStar = withInteractiveRotatableRect(Star, StarColliderFactory);

export const InteractiveStarWithText = withInteractiveRotatableTextRect(Star, StarColliderFactory);