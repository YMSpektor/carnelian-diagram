import { DiagramControls } from "./diagram-controls";
import { HitTests } from "./hit-tests";
import { DiagramSelections } from "./diagram-selections";

export class DiagramInteractions {
    hitTests = new HitTests();
    controls = new DiagramControls();
    selections = new DiagramSelections();

    public static current: DiagramInteractions;

    reset() {
        this.hitTests.reset();
        this.controls.reset();
    }
}

export * from "./diagram-controls";
export * from "./hit-tests";
export * from "./diagram-selections";
export * from "./useInteractions";
export * from "./useControls";