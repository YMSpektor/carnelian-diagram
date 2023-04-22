import { createContext } from "@carnelian/diagram";
import { JSX } from "@carnelian/diagram/jsx-runtime";
import { CreateHitTestProps } from "../hit-tests";

export type ControlProps = Partial<CreateHitTestProps> & {
    className: string;
}

export interface ControlsContextType {
    renderHandle: (kind: string, x: number, y: number, otherProps: ControlProps) => JSX.Element;
    renderEdge: (kind: string, x1: number, y1: number, x2: number, y2: number, otherProps: ControlProps) => JSX.Element;
}

export const ControlsContext = createContext<ControlsContextType>({
    renderHandle: () => null,
    renderEdge: () => null
});