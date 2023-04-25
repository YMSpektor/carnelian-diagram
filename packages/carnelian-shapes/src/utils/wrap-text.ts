import { TextStyle } from "..";

export interface WrapTextResult {
    lines: string[];
    textMetrics: TextMetrics;
}

export function wrapText(text: string, width: number, style?: TextStyle): WrapTextResult {
    const canvas = document.createElement('canvas');
    try
    {
        let lines: string[] = [];
        const ctx = canvas.getContext("2d");
        if (ctx) {
            if (style?.fontSize !== undefined && style.fontFamily) {
                const font = 
                    [style.fontStyle, style.fontVariant, style.fontWeight, style.fontStretch, style.fontSize, style.fontFamily]
                    .filter(x => x !== undefined)
                    .join(' ');
                ctx.font = font;
            }
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
        }
        else {
            throw new Error("Can't wrap text: canvas 2d context is not defined");
        }
    }
    finally {
        canvas.remove();
    }
}