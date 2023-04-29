/** @jsxImportSource @carnelian/diagram */

import { DiagramElement, DiagramElementProps, useState } from "@carnelian/diagram";
import { ACT_DRAW_POINT_PLACE, ACT_DRAW_POINT_PLACE_Payload, ACT_EDIT_TEXT, ACT_EDIT_TEXT_Payload, InplaceEditorStyles, InteractionController, isTextEditingService, useAction } from "..";
import { Rect } from "../geometry";

export interface InteractiveTextProps {
    text: string;
}

export interface InteractiveTextOptions<T extends InteractiveTextProps> {
    onPlaceText?: (props: DiagramElementProps<T>) => DiagramElementProps<T>;
    deleteOnEmpty?: boolean;
}

export function withInteractiveText<T extends InteractiveTextProps>(
    WrappedElement: DiagramElement<T>,
    textBounds: (props: T) => Rect,
    editorStyle: (props: T) => InplaceEditorStyles,
    options?: InteractiveTextOptions<T>
): DiagramElement<T> {
    return function(props) {
        const [isEditing, setEditing] = useState(false);
        const elementNode = this.element;

        function showEditor(controller: InteractionController, updateProps: (props: DiagramElementProps<T>, text: string) => DiagramElementProps<T>) {
            const textEdititngService = controller.getService(isTextEditingService)
            if (textEdititngService) {
                textEdititngService.showEditor(props.text, textBounds(props), editorStyle(props), (text) => {
                    if (!text.length && options?.deleteOnEmpty) {
                        elementNode && controller.diagram.delete(elementNode);
                    }
                    else {
                        props.onChange((props) => updateProps(props, text));
                    }
                    setEditing(false);
                });
                setEditing(true);
            }
        }

        useAction<ACT_EDIT_TEXT_Payload>(ACT_EDIT_TEXT, ({controller}) => {
            showEditor(controller, (props, text) => ({
                ...props,
                text
            }));
        });

        const onPlaceText = options?.onPlaceText;
        onPlaceText && useAction<ACT_DRAW_POINT_PLACE_Payload>(ACT_DRAW_POINT_PLACE, (payload) => {
            showEditor(payload.controller, (props, text) => {
                return onPlaceText({...props, text})
            });
            payload.result.current = true;
        });

        return !isEditing ? <WrappedElement {...props} /> : null;
    }
}