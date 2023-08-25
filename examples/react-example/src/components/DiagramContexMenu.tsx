import { Diagram } from "@carnelian-diagram/core";
import { InteractionController, isClipboardService, isDeletionService } from "@carnelian-diagram/interactivity";
import { Divider, Menu, MenuItem, MenuProps } from "@mui/material";

export interface DiagramContextMenuProps {
    diagram: Diagram;
    controller: InteractionController;
    onSelect: () => void;
}

function DiagramContextMenu(props: DiagramContextMenuProps & MenuProps) {
    const { diagram, controller, ...menuProps } = props;

    const selectedElements = controller.getSelectedElements();
    const clipboardService = controller.getService(isClipboardService);

    function closeContextMenu() {
        props.onSelect();
    };

    function bringToFront() {
        controller.getSelectedElements().sort((a, b) => diagram.indexOf(a) - diagram.indexOf(b)).forEach(element => {
            diagram.rearrange(element, props.diagram.count() - 1);
        });
        closeContextMenu();
    }

    function sendToBack() {
        controller.getSelectedElements().sort((a, b) => diagram.indexOf(b) - diagram.indexOf(a)).forEach(element => {
            diagram.rearrange(element, 0);
        });
        closeContextMenu();
    }

    function deleteElements() {
        const srv = controller.getService(isDeletionService);
        srv?.delete(controller.getSelectedElements());
        closeContextMenu();
    }

    function cut() {
        clipboardService?.cut();
        closeContextMenu();
    }

    function copy() {
        clipboardService?.copy();
        closeContextMenu();
    }

    function paste() {
        clipboardService?.paste();
        closeContextMenu();
    }

    return (
        <Menu {...menuProps}>
            <MenuItem disabled={selectedElements.length < 1} onClick={deleteElements}>Delete</MenuItem>
            <Divider />
            <MenuItem disabled={!clipboardService?.canCopy()} onClick={cut}>Cut</MenuItem>
            <MenuItem disabled={!clipboardService?.canCopy()} onClick={copy}>Copy</MenuItem>
            <MenuItem disabled={!clipboardService?.canPaste()} onClick={paste}>Paste</MenuItem>
            <Divider />
            <MenuItem disabled={selectedElements.length < 1} onClick={bringToFront}>Bring to Front</MenuItem>
            <MenuItem disabled={selectedElements.length < 1} onClick={sendToBack}>Send to Back</MenuItem>
        </Menu>
    );
}

export default DiagramContextMenu;