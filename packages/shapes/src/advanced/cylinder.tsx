/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { EllipseCollider, KnobController, RectCollider, UnionCollider, withKnob } from "@carnelian-diagram/interactivity";
import { clamp } from "@carnelian-diagram/interactivity/geometry";
import { RectBaseProps } from "..";
import { withInteractiveRotatableRect, withInteractiveRotatableTextRect } from "../hocs";
import { convertPercentage, isPercentage, NumberOrPercentage } from "../utils";

export interface CylinderProps extends RectBaseProps {
    ry: NumberOrPercentage;
}

const knobController: KnobController<CylinderProps> = {
    hitArea: (props) => ({
        type: "knob_handle",
        cursor: "default",
        action: "knob_move"
    }),
    getPosition(props) {
        const ry = clamp(convertPercentage(props.ry, props.height), 0, props.height / 2);
        return {
            x: props.x,
            y: props.y + ry
        }
    },
    setPosition(props, {position}) {
        let ry: NumberOrPercentage = position.y - props.y;
        ry = clamp(ry, 0, props.height / 2);
        ry = isPercentage(props.ry) 
            ? props.height > 0 ? `${ry / props.height * 100}%` : props.ry
            : ry;
        return {
            ...props,
            ry
        }
    }
}

const CylinderColliderFactory = (props: CylinderProps) => {
    let { x, y, width, height, ry } = props;
    ry = clamp(convertPercentage(ry, height), 0, height / 2);

    return UnionCollider(
        EllipseCollider({center: {x: x + width / 2, y: y + ry}, rx: width / 2, ry}),
        EllipseCollider({center: {x: x + width / 2, y: y + height - ry}, rx: width / 2, ry}),
        RectCollider({x, y: y + ry, width, height: height - 2 * ry})
    );
}

export const Cylinder: DiagramElement<CylinderProps> = function(props) {
    let { onChange, x, y, width, height, ry, ...rest } = props;
    ry = clamp(convertPercentage(ry, height), 0, height / 2);

    let path = `M${x + width} ${y + ry} l0 ${height - 2 * ry} a${width / 2} ${ry} 0 0 1 ${-width} 0 l0 ${-height + 2 * ry}`;
    if (ry === 0) {
        path += "Z";
    }

    return (
        <>
            <path d={path} {...rest} />
            <ellipse cx={x + width / 2} cy={y + ry} rx={width / 2} ry={ry} {...rest} />
        </>
    );
}

export const InteractiveCylinder = withInteractiveRotatableRect(
    withKnob(Cylinder, knobController), 
    CylinderColliderFactory
);

export const InteractiveCylinderWithText = withInteractiveRotatableTextRect(
    withKnob(Cylinder, knobController), 
    CylinderColliderFactory,
    (props) => {
        const ry = clamp(convertPercentage(props.ry, props.height), 0, props.height / 2);
        return {
            ...props,
            height: ry * 2
        }
    }
);