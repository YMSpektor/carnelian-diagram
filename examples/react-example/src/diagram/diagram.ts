import { Diagram } from "@carnelian-diagram/core";
import { InteractionController, isClipboardService, isGridSnappingService, isPaperService } from "@carnelian-diagram/interactivity";

export const diagram = new Diagram();
export const controller = new InteractionController(diagram, (services) => {
    services.configure(isPaperService, (service) => {
        service.paper = {
            x: 0,
            y: 0,
            width: 2100,
            height: 2970,
            majorGridSize: 200,
            minorGridSize: 50
        };
    });

    services.configure(isGridSnappingService, (service) => {
        service.snapGridSize = 50;
        service.snapAngle = 5;
    });

    services.configure(isClipboardService, (service) => {
        service.offsetXOnPaste = 50;
        service.offsetYOnPaste = 50;
    });
});