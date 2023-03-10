import { DiagramControls } from "./diagram-controls";
import { HitTests } from "./hit-tests";

export class DiagramInteractions {
    hitTests = new HitTests();
    controls = new DiagramControls();

    public static current: DiagramInteractions;

    reset() {
        this.hitTests.reset();
        this.controls.reset();
    }
}

export * from "./diagram-controls";
export * from "./hit-tests";
export * from "./useInteractions";
export * from "./useControls";