/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { KnobController, PolygonCollider, withKnob } from "@carnelian-diagram/interaction";
import { clamp } from "@carnelian-diagram/interaction/geometry";
import { RectBaseProps } from "..";
import { withInteractiveRotatableRect, withInteractiveRotatableTextRect } from "../hocs";
import { convertPercentage, isPercentage, NumberOrPercentage } from "../utils";

export interface NoteProps extends RectBaseProps {
    offset: NumberOrPercentage;
}

const knobController: KnobController<NoteProps, number> = {
    hitArea: (props) => ({
        type: "knob_handle",
        cursor: "default",
        action: "knob_move"
    }),
    getPosition(props) {
        const base = Math.min(props.width, props.height);
        const offset = clamp(convertPercentage(props.offset, base), 0, base);
        return {
            x: props.x + props.width - offset,
            y: props.y
        }
    },
    setPosition(props, {position}) {
        const base = Math.min(props.width, props.height);
        let offset: NumberOrPercentage = clamp(props.x + props.width - position.x, 0, base);
        offset = isPercentage(props.offset) 
            ? base > 0 ? `${offset / base * 100}%` : props.offset
            : offset
        return {
            ...props,
            offset
        }
    }
}

function toPolygon(props: NoteProps) {
    let { x, y, width, height, offset } = props;

    const base = Math.min(props.width, props.height);
    offset = clamp(convertPercentage(offset, base), 0, base);
    return [
        {x, y},
        {x: x + width - offset, y},
        {x: x + width, y: y + offset},
        {x: x + width, y: y + height},
        {x, y: y + height}
    ];
}

const NoteColliderFactory = (props: NoteProps) => PolygonCollider(toPolygon(props));

export const Note: DiagramElement<NoteProps> = function(props) {
    let { x, y, width, height, offset, style } = props;
    offset = convertPercentage(offset, Math.min(width, height));
    const points = toPolygon(props);

    return (
        <g style={style}>
            <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} />
            <polyline points={[
                {x: x + width - offset, y},
                {x: x + width - offset, y: y + offset},
                {x: x + width, y: y + offset}
            ].map(p => `${p.x},${p.y}`).join(" ")} style={{fill: "none"}} />
        </g>
    );
}

export const InteractiveNote = withInteractiveRotatableRect(
    withKnob(Note, knobController),
    NoteColliderFactory
);

export const InteractiveNoteWithText = withInteractiveRotatableTextRect(
    withKnob(Note, knobController),
    NoteColliderFactory
);
