import { InteractionServive } from ".";
import { InteractionController, Paper } from "../interaction-controller";

export interface PaperService extends InteractionServive {
    type: "paper_service";
    paper: Paper | null;
}

export function isPaperService(service: InteractionServive): service is PaperService {
    return service.type === "paper_service";
}

export class DefaultPaperService implements PaperService {
    private _paper: Paper | null = null;
    type: "paper_service" = "paper_service";

    constructor(private controller: InteractionController) {}

    get paper(): Paper | null { return this._paper; }
    set paper(value: Paper | null) {
        this._paper = value;
        this.controller.onPaperChange.emit({ paper: this._paper });
    }
}