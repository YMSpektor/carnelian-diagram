import { DiagramElement } from "@carnelian-diagram/core";
import { SquareColliderFactory, withInteractiveRotation, withInteractiveSquare, ACT_EDIT_TEXT } from "@carnelian-diagram/interaction";
import { MultilineTextStyle, SquareBaseProps } from "..";
import { InteractiveMultilineTextComponent } from "../basic/multiline-text";
import { squareRotationController, squareRotation } from "../utils";
import { withRotation } from "./with-rotation";
import { withText } from "./with-text";

export function withInteractiveRotatableTextSquare<T extends SquareBaseProps>(
    WrappedElement: DiagramElement<T>,
    collider?: SquareColliderFactory<T>
): DiagramElement<T & { text?: string; textStyle?: MultilineTextStyle }> {
    return withRotation<T>(
        withInteractiveRotation(
            withText(
                withInteractiveSquare(WrappedElement, {
                    innerHitArea: (hitArea) => ({...hitArea, dblClickAction: ACT_EDIT_TEXT}),
                    collider
                }),
                InteractiveMultilineTextComponent,
                (props) => ({
                    x: props.x,
                    y: props.y,
                    width: props.size,
                    height: props.size,
                    text: props.text || "",
                    textStyle: props.textStyle
                })
            ),
            squareRotationController()
        ),
        squareRotation()
    );
}