import { DiagramElement } from "@carnelian-diagram/core";
import { RectColliderFactory, withRotation, withInteractiveRotation, withInteractiveRect, ACT_EDIT_TEXT } from "@carnelian-diagram/interaction";
import { MultilineTextStyle, RectBaseProps } from "..";
import { InteractiveMultilineTextComponent } from "../basic/multiline-text";
import { RectRotationController, RectRotation } from "../utils";
import { withText } from "./with-text";

export function withInteractiveRotatableTextRect<T extends RectBaseProps>(
    WrappedElement: DiagramElement<T>,
    collider?: RectColliderFactory<T>
): DiagramElement<T & { text?: string; textStyle?: MultilineTextStyle }> {
    return withRotation(
        withInteractiveRotation(
            withText(
                withInteractiveRect(WrappedElement, {
                    innerHitArea: (hitArea) => ({...hitArea, dblClickAction: ACT_EDIT_TEXT}),
                    collider
                }),
                InteractiveMultilineTextComponent,
                (props) => ({ ...props, text: props.text || "" })
            ),
            RectRotationController()
        ),
        RectRotation()
    );
}