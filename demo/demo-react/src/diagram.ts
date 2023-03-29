import { Diagram, DiagramRoot } from "@carnelian/diagram";
import { InteractionController, withInteraction } from "@carnelian/interaction";
import { DiagramPaletteElement } from "./components/DiagramPalette";
import { 
    InteractiveRect as Rect, 
    InteractiveEllipse as Ellipse, 
    InteractiveRhombus as Rhombus 
} from "@carnelian/shapes/basic";

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
    elementProps: {x: 20, y: 20, width: 300, height: 200},
    viewBox: "0 0 340 240",
    title: "Rectangle",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    elementType: Ellipse,
    elementProps: {x: 20, y: 20, width: 300, height: 200},
    viewBox: "0 0 340 240",
    title: "Ellipse",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});

addToPalette({
    elementType: Rhombus,
    elementProps: {x: 20, y: 20, width: 300, height: 200},
    viewBox: "0 0 340 240",
    title: "Rhombus",
    factory: (point, props) => ({
        ...props,
        x: point.x - props.width / 2,
        y: point.y - props.height / 2
    }),
});
