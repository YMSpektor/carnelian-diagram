/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { ACT_EDIT_TEXT, withInteractiveRect, withInteractiveText } from "@carnelian/interaction";
import { DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, TextBaseProps, TextStyle } from "..";
import { getTextBounds, textEditorStyles, wrapText } from "../utils";

export interface MultilineTextStyle extends TextStyle {
    lineHeight?: number;
}

export interface MultilineTextProps extends TextBaseProps<MultilineTextStyle> {}

export const MultilineText: DiagramElement<MultilineTextProps> = function(props) {
    let { x, y, width, height, style, text } = props;
    let textStyle: TextStyle & { userSelect?: "none" };
    let verticalAlign = style?.verticalAlign || "middle";
    let lineHeight = 1;
    if (style) {
        let { verticalAlign: va, lineHeight: lh, ...rest } = style;
        textStyle = rest;
        lineHeight = lh || 1;
    }
    else {
        textStyle = {};
    }

    textStyle = {
        ...textStyle,
        alignmentBaseline: undefined,
        fontFamily: textStyle?.fontFamily || DEFAULT_FONT_FAMILY,
        fontSize: textStyle?.fontSize || DEFAULT_FONT_SIZE,
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
    withInteractiveRect(MultilineText, {
        innerHitArea: (hitArea) => ({...hitArea, dblClickAction: ACT_EDIT_TEXT})
    }),
    (props) => props,
    (props) => textEditorStyles(props.style),
    {
        updateProps: (props) => ({
            ...props,
            ...getTextBounds(props.x, props.y, props.text, props.style)
        })
    }
);