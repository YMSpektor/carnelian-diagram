import { DiagramElement } from "@carnelian-diagram/core";
import { CircleColliderFactory, withRotation, withInteractiveRotation, withInteractiveCircle, ACT_EDIT_TEXT } from "@carnelian-diagram/interaction";
import { CircleBaseProps, MultilineTextStyle } from "..";
import { InteractiveMultilineTextComponent } from "../basic/multiline-text";
import { CircleRotationController, CircleRotation } from "../utils";
import { withText } from "./with-text";

export function withInteractiveRotatableTextCircle<T extends CircleBaseProps>(
    WrappedElement: DiagramElement<T>,
    collider?: CircleColliderFactory<T>
): DiagramElement<T & { text?: string; textStyle?: MultilineTextStyle }> {
    return withRotation<T>(
        withInteractiveRotation(
            withText(
                withInteractiveCircle(WrappedElement, {
                    innerHitArea: (hitArea) => ({...hitArea, dblClickAction: ACT_EDIT_TEXT}),
                    collider
                }),
                InteractiveMultilineTextComponent,
                (props) => ({
                    x: props.x - props.radius,
                    y: props.y - props.radius,
                    width: props.radius * 2,
                    height: props.radius * 2,
                    text: props.text || "",
                    textStyle: props.textStyle
                })
            ),
            CircleRotationController()
        ),
        CircleRotation()
    );
}