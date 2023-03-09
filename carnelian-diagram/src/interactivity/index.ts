import { DiagramControls } from "./diagram-controls";
import { HitTests } from "./hit-tests";

export class DiagramInteractions {
    hitTests = new HitTests();
    controls = new DiagramControls();
}