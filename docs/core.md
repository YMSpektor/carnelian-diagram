# Carnelian Diagram engine

**Carnelian Diagram** is designed to be similar to the popular React library, so creating custom diagram elements resembles the process of creating functional components in React. In particular, to define a new diagram element type in Carnelian Diagram you'll implement a function that accepts an element props and returns JSX to render the element DOM. The difference here is the DOM will be rendered to `<svg>` element, so you need to render SVG instead of HTML. Inside the functional element you can use similar hooks (like useState, useEffect, useContext) to manage the element behaviour.

## Diagram model and view

Carnelian Diagram separates a diagram model (that contains all elements with their properties) and the process of rendering. To define a diagram model you need to create an instance of `Diagram` class:
```typescript
import { Diagram } from "@carnelian/diagram";

const diagram = new Diagram();
```
The Diagram class contains methods to add, delete or update elements, for example, you can add new elements to the diagram using `add` method:
```typescript
import { InteractiveRect } from "@carnelian/shapes/basic";

diagram.add(InteractiveRect, { x: 100, y: 100, width: 200, height: 150, style: { fill: "yellow" } });
```
To display the diagram on a web page use `DiagramDOM`:
```typescript
import { Diagram, DiagramDOM, DiagramRoot } from "@carnelian/diagram";

const root = DiagramDOM.createRoot(
    diagram,     // The diagram model
    rootElement, // The root element to render the diagram to: svg element or its child
    DiagramRoot  // The root diagram component, typically the DiagramRoot or its wrapper
);
// Start listening for changes to rerender the root when needed
root.attach();
```

Carnelian Diagram (similar to React) has separate render and commit phases. On the render phase it renders diagram elements to a virtual tree (and only rerender the elements that were changed from the previouse rendering). On the commit phase the DOM is being updated. The library uses virtual DOM under the hood to do it efficiently instead of recreating the entire DOM.

## Creating custom elements