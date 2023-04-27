import { InteractionServive } from ".";
import { InteractionController } from "..";
import { Rect } from "../geometry";

export interface InplaceEditorStyles {
    fontSize?: string;
    fontFamily?: string;
    fontStyle?: string;
    fontWeight?: string | number;
    textAlign?: string;
}

export interface TextEditingService extends InteractionServive {
    type: "text_editing_service";
    showEditor(text: string, rect: Rect, style?: InplaceEditorStyles, onClose?: (text: string) => void): void;
}

export function isTextEditingService(service: InteractionServive): service is TextEditingService {
    return service.type === "text_editing_service";
}

export class DefaultTextEditingService implements TextEditingService {
    type: "text_editing_service" = "text_editing_service";

    constructor(private controller: InteractionController) {}

    showEditor(text: string, rect: Rect, style?: InplaceEditorStyles, onClose?: (text: string) => void) {
        function closeEditor(value: string) {
            onClose?.(value);
            backdrop.remove();
        }

        const backdrop = document.createElement("div");
        backdrop.className = "inplace-text-editor-backdrop";
        backdrop.style.position = "fixed";
        backdrop.style.zIndex = "1000";
        backdrop.style.left = "0";
        backdrop.style.top = "0";
        backdrop.style.right = "0";
        backdrop.style.bottom = "0";
        backdrop.onclick = (e) => {
            if (e.target === backdrop) {
                closeEditor(inplaceEditor.value);
            }
        };
        const p = this.controller.diagramToClient(new DOMPoint(rect.x + rect.width / 2, rect.y + rect.height / 2));
        const inplaceEditor = document.createElement("input");
        inplaceEditor.className = "inplace-text-editor";
        inplaceEditor.style.position = "relative";
        inplaceEditor.style.left = `${p.x}px`;
        inplaceEditor.style.top = `${p.y}px`;
        inplaceEditor.style.transform = "translate(-50%, -50%)";
        let fontSize: string | number | undefined = style?.fontSize;
        if (fontSize) {
            fontSize = parseInt(fontSize);
            if (!isNaN(fontSize)) {
                const scale = this.controller.screenCTM?.a || 1;
                inplaceEditor.style.fontSize = `${Math.round(fontSize * scale)}px`;
            }
        }
        inplaceEditor.style.fontFamily = style?.fontFamily || "";
        inplaceEditor.style.fontStyle = style?.fontStyle || "";
        inplaceEditor.style.fontWeight = `${style?.fontWeight}` || "";
        inplaceEditor.style.textAlign = style?.textAlign || "";
        inplaceEditor.value = text;
        inplaceEditor.onkeydown = (e) => {
            if (e.code === "Esc" || e.code === "Escape") {
                closeEditor(text);
            }
            if (e.code === "Enter") {
                closeEditor(inplaceEditor.value);
            }
        };
        backdrop.appendChild(inplaceEditor);
        document.body.appendChild(backdrop);
        inplaceEditor.focus();
    }
}
