/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { ACT_EDIT_TEXT, withInteractiveRect, withInteractiveText } from "@carnelian/interaction";
import { RawRectProps, TextStyle } from "..";
import { wrapText } from "../utils";

export interface MultilineTextStyle extends TextStyle {
    verticalAlign?: "top" | "middle" | "bottom";
    lineHeight?: number;
}

export interface MultilineTextProps extends RawRectProps {
    text: string;
    style?: MultilineTextStyle;
}

function textAnchorToTextAlign(textAnchor?: string) {
    switch (textAnchor) {
        case "start": return "left";
        case "middle": return "center";
        case "end": return "right";
    }
}

export const MultilineText: DiagramElement<MultilineTextProps> = function(props) {
    let { x, y, width, height, style, text } = props;
    let textStyle: TextStyle & { userSelect?: "none" };
    let verticalAlign: MultilineTextStyle["verticalAlign"] | undefined = "middle";
    let lineHeight = 1;
    if (style) {
        let { verticalAlign: va, lineHeight: lh, ...rest } = style;
        textStyle = rest;
        verticalAlign = va || "middle";
        lineHeight = lh || 1;
    }
    else {
        textStyle = {};
    }

    textStyle = {
        ...textStyle,
        alignmentBaseline: undefined,
        stroke: textStyle?.stroke || "none",
        fill: textStyle?.fill || "black",
        fontFamily: textStyle?.fontFamily || "sans-serif",
        fontSize: textStyle?.fontSize || "10px",
        textAnchor: textStyle?.textAnchor || "middle",
        userSelect: "none"
    }
    const { lines, textMetrics } = wrapText(text, width, textStyle);
    const fontHeight = textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent;

    switch (textStyle?.textAnchor) {
        case "middle":
            x = x + width / 2;
            break;
        case "end":
            x = x + width;
            break;
    }

    let alignmentBaseline = style?.alignmentBaseline;
    switch (verticalAlign) {
        case "middle":
            y = y + height / 2 - (fontHeight * lineHeight * (lines.length - 1)) / 2;
            alignmentBaseline = "middle";
            break;
        case "bottom":
            y = y + height;
            alignmentBaseline = "text-after-edge";
            break;
        default:
            alignmentBaseline = "text-before-edge";
    }

    return (
        <text x={x} y={y} style={textStyle}>
            {lines.map((line, i) => (
                <tspan x={x} dy={i > 0 ? fontHeight * lineHeight : undefined} style={{alignmentBaseline}}>{line}</tspan>
            ))}
        </text>
    );
}

export const InteractiveMultilineText = withInteractiveText(
    withInteractiveRect(MultilineText, undefined, (hitArea) => ({...hitArea, dblClickAction: ACT_EDIT_TEXT})),
    (props) => props,
    (props) => ({
        fontSize: props.style?.fontSize || "10px",
        fontFamily: props.style?.fontFamily || "sans-serif",
        fontStyle: props.style?.fontStyle,
        fontWeight: props.style?.fontWeight,
        textAlign: textAnchorToTextAlign(props.style?.textAnchor) || "center"
    })
);