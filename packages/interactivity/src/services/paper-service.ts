import { InteractionServive } from ".";
import { InteractionController } from "../interaction-controller";

export interface Paper {
    x: number;
    y: number;
    width: number;
    height: number;
    majorGridSize?: number | null;
    majorGridColor?: string;
    minorGridSize?: number | null;
    minorGridColor?: string;
}

export interface PaperService extends InteractionServive {
    type: "paper_service";
    paper: Paper | null;
}

export function isPaperService(service: InteractionServive): service is PaperService {
    return service.type === "paper_service";
}

export const PAPER_CHANGE_EVENT = "paper_change";
export interface PaperChangeEventArgs {
    paper: Paper | null;
}

export class DefaultPaperService implements PaperService {
    private _paper: Paper | null = null;
    type: "paper_service" = "paper_service";

    constructor(private controller: InteractionController) {}

    get paper(): Paper | null { return this._paper; }
    set paper(value: Paper | null) {
        this._paper = value;
        this.controller.dispatchEvent<PaperChangeEventArgs>(PAPER_CHANGE_EVENT, { paper: this._paper });
    }
}