import { createContext, DiagramElementNode } from "@carnelian-diagram/core";

export const SelectionContext = createContext<DiagramElementNode[]>([]);