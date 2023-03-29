import { createContext, DiagramElementNode } from "@carnelian/diagram";

export const SelectionContext = createContext<DiagramElementNode[]>([]);