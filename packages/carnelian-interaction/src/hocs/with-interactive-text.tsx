/** @jsxImportSource @carnelian/diagram */

import { DiagramElement, useState } from "@carnelian/diagram";
import { ACT_EDIT_TEXT, ACT_EDIT_TEXT_Payload, InplaceEditorStyles, isTextEditingService, useAction } from "..";
import { Rect } from "../geometry";

export interface InteractiveTextProps {
    text: string;
}

export function withInteractiveText<T extends InteractiveTextProps>(
    WrappedElement: DiagramElement<T>,
    textBounds: (props: T) => Rect,
    editorStyle: (props: T) => InplaceEditorStyles
): DiagramElement<T> {
    return (props) => {
        const [isEditing, setEditing] = useState(false);

        useAction<ACT_EDIT_TEXT_Payload>(ACT_EDIT_TEXT, ({controller}) => {
            const textEdititngService = controller.getService(isTextEditingService)
            if (textEdititngService) {
                textEdititngService.showEditor(props.text, textBounds(props), editorStyle(props), (text) => {
                    props.onChange((props) => ({
                        ...props,
                        text
                    }));
                    setEditing(false);
                });
                setEditing(true);
            }
        });

        return !isEditing ? <WrappedElement {...props} /> : null;
    }
}