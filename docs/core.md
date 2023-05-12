# Carnelian engine

**Carnelian** is designed to be similar to the popular React library, so creating custom diagram elements resembles the process of creating functional components in React. In particular, to define a new diagram element type in Carnelian you'll implement a function that accepts an element props and returns JSX to render the element DOM. The difference here is the DOM will be rendered to `<svg>` element, so you need to render SVG instead of HTML. Inside the functional element you can use similar hooks (like useState, useEffect, useContext) to manage the element behaviour.

## Diagram model and view

Carnelian separates a diagram model (that contains all elements with their properties) and the process of rendering. To define a diagram model you need to create an instance of `Diagram` class:
```typescript
import { Diagram } from "@carnelian-diagram/core";

const diagram = new Diagram();
```
The Diagram class contains methods to add, delete or update elements, for example, you can add new elements to the diagram using `add` method:
```typescript
import { InteractiveRect } from "@carnelian-diagram/shapes/basic";

diagram.add(InteractiveRect, { x: 100, y: 100, width: 200, height: 150, style: { fill: "yellow" } });
```
To display the diagram on a web page use `DiagramDOM`:
```typescript
import { Diagram, DiagramDOM, DiagramRoot } from "@carnelian-diagram/core";

const root = DiagramDOM.createRoot(
    diagram,     // The diagram model
    rootElement, // The root element to render the diagram to: svg element or its child
    DiagramRoot  // The root diagram component, typically the DiagramRoot or its wrapper
);
// Start listening for changes to rerender the root when needed
root.attach();
```

Carnelian (similar to React) has separate render and commit phases. On the render phase it renders diagram elements to a virtual tree (and only rerender the elements that were changed from the previouse rendering). On the commit phase the DOM is being updated. The library uses virtual DOM under the hood to do it efficiently instead of recreating the entire DOM.

## Creating custom elements

Creating custom elements is similar to how you create functional components in React. Here is a simple example:

```typescript
/** @jsxImportSource @carnelian-diagram/core */

import { useState, DiagramElement } from "@carnelian-diagram/core";

export interface CustomElementProps {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const CustomElement: DiagramElement<CustomElementProps> = function(props) {
    const { x, y, width, height } = props;

    const [color, setColor] = useState("red");
    setTimeout(() => {
        setColor(color === "red" ? "yellow" : "red");
    }, 1000);

    return (
        <rect x={x} y={y} width={width} height={height} fill={color} />
    ); 
}
```
To add this element to diagram model we need to call the `add` method of `Diagram` object:
```typescript
import { Diagram } from "@carnelian-diagram/core";
import { CustomElement } from "./custom-element";

const diagram = new Diagram();
diagram.add(CustomElement, { x: 100, y: 100, width: 200, height: 150 });
```

To make this element interactive see further documentation.

This is just an example to demonstrate using useState hook. We don't recommend using state to hold element properties related to a diagram model, it's better to define them in the props and use onChange callback to update the element:

```typescript
export interface CustomElementProps {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
}

export const CustomElement: DiagramElement<CustomElementProps> = function(props) {
    const { x, y, width, height, color, onChange } = props;

    setTimeout(() => {
        onChange((props) => ({
            ...props,
            color: props.color === "red" ? "yellow" : "red"
        }));
    }, 1000);
```
As you can see we can extract onChange from props object, but we don't need to define it in the props type. It's possible because the library adds this property automatically to every element added to a diagram.

Currently the library supports the following standard hooks:
* useState
* useEffect
* useContext (together with createContext, Context.Provider and Context.Consumer)
* useRef

In addition there are several hooks related to interactivity built on top of these standard hooks, see [Interactivity](https://github.com/YMSpektor/carnelian-diagram/blob/main/docs/interactivity.md) for more details.

## See also
* [Interactivity](https://github.com/YMSpektor/carnelian-diagram/blob/main/docs/interactivity.md)