import { DiagramInteractions } from ".";

export function useInteractions(): DiagramInteractions {
    return DiagramInteractions.current;
}