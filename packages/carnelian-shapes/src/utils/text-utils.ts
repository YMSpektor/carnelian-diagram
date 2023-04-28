import { InplaceEditorStyles } from "@carnelian/interaction";
import { Rect } from "@carnelian/interaction/geometry";
import { DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, TextStyle } from "..";

export interface WrapTextResult {
    lines: string[];
    textMetrics: TextMetrics;
}

function with2dContext<T>(action: (ctx: CanvasRenderingContext2D) => T, style?: TextStyle): T {
    const canvas = document.createElement('canvas');
    try
    {
        const ctx = canvas.getContext("2d");
        if (ctx) {
            const fontSize = style?.fontSize || DEFAULT_FONT_SIZE;
            const fontFamily = style?.fontFamily || DEFAULT_FONT_FAMILY;
            const font = 
                [style?.fontStyle, style?.fontVariant, style?.fontWeight, style?.fontStretch, fontSize, fontFamily]
                .filter(x => x !== undefined)
                .join(' ');
            ctx.font = font;
            return action(ctx);
        }
        else {
            throw new Error("An error has occured while getting a canvas 2d context");
        }
    }
    finally {
        canvas.remove();
    }
}

export function measureText(text: string, style?: TextStyle): TextMetrics {
    return with2dContext((ctx) => ctx.measureText(text), style);
}

export function wrapText(text: string, width: number, style?: TextStyle): WrapTextResult {
    return with2dContext((ctx) => {
        let lines: string[] = [];
        const words = text.split(' ');
        let line: string[] = [];
        while (words.length > 0) {
            const word = words.shift()!;
            line.push(word);
            var size = ctx.measureText(line.join(' '));
            if (size.width > width || words.length === 0) {
                if (size.width > width && line.length > 1) {
                    line.pop();
                    words.unshift(word);
                }
                lines.push(line.join(' '));
                line = [];
            }
        }

        const textMetrics = ctx.measureText(text);
        return { lines, textMetrics };
    }, style);    
}

export function getTextBounds(
    x: number,
    y: number,
    text: string,
    style?: TextStyle & {verticalAlign?: "top" | "middle" | "bottom"}
): Rect {
    const textMetrics = measureText(text, style);
    const width = textMetrics.width;
    const height = textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent;
    switch (style?.textAnchor || "middle") {
        case "middle":
            x = x - width / 2;
            break;
        case "end":
            x = x - width;
            break;
    }
    switch (style?.verticalAlign || "middle") {
        case "middle":
            y = y - height / 2;
            break;
        case "bottom":
            y = y - height;
            break;
    }
    return { x, y, width, height };
}

function textAnchorToTextAlign(textAnchor?: string) {
    switch (textAnchor) {
        case "start": return "left";
        case "middle": return "center";
        case "end": return "right";
    }
}

export function textEditorStyles(style?: TextStyle): InplaceEditorStyles {
    return {
        fontSize: style?.fontSize || DEFAULT_FONT_SIZE,
        fontFamily: style?.fontFamily || DEFAULT_FONT_FAMILY,
        fontStyle: style?.fontStyle,
        fontWeight: style?.fontWeight,
        textAlign: textAnchorToTextAlign(style?.textAnchor) || "center"
    }
}