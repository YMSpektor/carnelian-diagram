/** @jsxImportSource @carnelian/diagram */

import { DiagramElement, DiagramElementProps } from "@carnelian/diagram";
import { TextBaseProps, TextStyle } from "..";

export function withText<E extends object, S extends TextStyle, T extends TextBaseProps<S>>(
    WrappedElement: DiagramElement<E>,
    TextElement: DiagramElement<T>,
    textElementProps: (props: E & { text: string; textStyle?: S }) => T
): DiagramElement<E & { text: string; textStyle?: S }> {
    return (props) => {
        const { text, textStyle, ...rest } = props;
        const elementProps: DiagramElementProps<E> = rest as any;
        const textProps: DiagramElementProps<T> = {
            ...textElementProps(props),
            onChange: (callback) => {
                props.onChange((props) => {
                    const { text, textStyle } = callback(textProps);
                    return {
                        ...props,
                        text,
                        textStyle
                    }
                });
            }
        };
        return (
            <>
                <WrappedElement {...elementProps} />
                <TextElement {...textProps} />
            </>
        )
    }
}