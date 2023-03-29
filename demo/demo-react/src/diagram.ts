import { Diagram, DiagramRoot } from "@carnelian/diagram";
import { InteractionController, withInteraction } from "@carnelian/interaction";
import { DiagramPaletteElement } from "./components/DiagramPalette";
import { Rect } from "./elements";

export const controller = new InteractionController();
export const diagram = new Diagram(
    withInteraction(
        DiagramRoot, 
        controller
    )
);

export const palette: DiagramPaletteElement<any>[] = [];

function addToPalette<T extends object>(element: DiagramPaletteElement<T>) {
    palette.push(element);
}

addToPalette({
    elementType: Rect,
    elementProps: {x: 20, y: 20, width: 300, height: 300, style: { fill: "white" }},
    viewBox: "0 0 340 340",
    title: "Rectangle",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    elementType: Rect,
    elementProps: {x: 20, y: 20, width: 300, height: 300, style: { fill: "blue" }},
    viewBox: "0 0 340 340",
    title: "Rectangle",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});
