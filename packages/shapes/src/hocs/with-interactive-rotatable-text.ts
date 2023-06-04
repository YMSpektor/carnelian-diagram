import { DiagramElement } from "@carnelian-diagram/core";
import { withInteractiveRotation, withInteractiveText, withInteractiveRect, ACT_EDIT_TEXT } from "@carnelian-diagram/interaction";
import { TextStyle, TextBaseProps } from "..";
import { textEditorStyles, getTextBounds, textRotationController, textRotation } from "../utils";
import { withRotation } from "./with-rotation";

export function withInteractiveRotatableText<S extends TextStyle, T extends TextBaseProps<S>>(
    WrappedElement: DiagramElement<T>
) {
    return withRotation<T>(
        withInteractiveRotation(
            withInteractiveText(
                withInteractiveRect(WrappedElement, {
                    innerHitArea: (hitArea) => ({...hitArea, dblClickAction: ACT_EDIT_TEXT})
                }),
                (props) => props,
                (props) => textEditorStyles(props.textStyle),
                {
                    onPlaceText: (props) => ({
                        ...props,
                        ...getTextBounds(props.x, props.y, props.text, props.textStyle)
                    }),
                    deleteOnEmpty: true
                }
            ),
            textRotationController()
        ),
        textRotation()
    );
}