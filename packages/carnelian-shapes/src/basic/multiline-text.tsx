/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { withInteractiveRect } from "@carnelian/interaction";
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

export const MultilineText: DiagramElement<MultilineTextProps> = function(props) {
    let { x, y, width, height, style, text } = props;
    let textStyle: TextStyle & { userSelect?: "none" };
    let verticalAlign: MultilineTextStyle["verticalAlign"] | undefined;
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
            alignmentBaseline = "bottom";
            break;
        default:
            alignmentBaseline = "top";
    }

    return (
        <text x={x} y={y} style={textStyle}>
            {lines.map((line, i) => (
                <tspan x={x} dy={i > 0 ? fontHeight * lineHeight : undefined} style={{alignmentBaseline}}>{line}</tspan>
            ))}
        </text>
    );
}

export const InteractiveMultilineText = withInteractiveRect(MultilineText);