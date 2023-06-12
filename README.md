# Carnelian Diagram
**Carnelian Diagram** is a typescript library that allows you to create interactive diagrams for your web applications.

## Motivation
The library aims to achieve several goals. First and foremost, it is not just a collection of pre-built tools and features, but also an engine that enables you to create your own.

Secondly, **Carnelian Diagram** is designed to have similarities with the popular React library. If you are already familiar with React, your skills will be transferrable to this library as well. You can develop custom interactive elements using similar concepts, such as functional components (using custom and standard hooks like useState and useEffect), JSX syntax, and higher-order components. This familiarity makes it easy to learn and integrate **Carnelian Diagram** into your projects.

However, it is important to note that **Carnelian Diagram** is not based on React and does not require its installation in your project. You can use the library with vanila TypeScript/JavaScript or alongside other tools. The library utilizes its own engine, similar to React but simpler and designed to meet specific needs.

## Installation

**Carnelian Diagram** is available as a set of several npm packages.

### @carnelian-diagram/core
This package is a core of **Carnelian Diagram** library and contains base functionality to create and render diagrams.

```sh
npm install @carnelian-diagram/core
```

### @carnelian-diagram/interaction
This package contains tools to make a diagram and its elements respond to a user's input.

```sh
npm install @carnelian-diagram/interaction
```

### @carnelian-diagram/shapes
This package containt some ready to use basic diagram elements and shapes: rectangle, ellipse, polygons, lines, text elements, etc.

```sh
npm install @carnelian-diagram/shapes
```

## Examples

### Example - Basic usage

```typescript
import { Diagram, DiagramDOM, DiagramRoot } from "@carnelian-diagram/core";
import { InteractionController, withInteraction } from "@carnelian-diagram/interaction";
import { 
    InteractiveRoundedRect as RoundedRect,
    InteractiveCircle as Circle 
} from "@carnelian-diagram/shapes/basic";

const root = document.getElementById("root");
if (root && root instanceof SVGGraphicsElement) {
    const diagram = new Diagram();
    diagram.add(RoundedRect, { x: 100, y: 100, width: 200, height: 150, radius: "25%", style: { fill: "yellow" } });
    diagram.add(Circle, { x: 280, y: 220, radius: 80, style: { fill: "blue" }});

    const controller = new InteractionController(diagram);
    const diagramDOM = DiagramDOM.createRoot(diagram, root, withInteraction(DiagramRoot, controller));

    controller.attach(root);
    diagramDOM.attach();
}
```

### Example - Custom elements

Firstly, you need to configure JSX for typescript. Add the following lines to your tsconfig.json:
```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@carnelian-diagram/core"
  }
}
```
Instead of adding `jsxImportSource` to the tsconfig.json, you can define the typescript pragma at the beginning of your .tsx files. This can be useful when your project has already had some other JSX configuration (e.g. React projects) and you need to overwrite it for your custom diagram elements.

```typescript
/** @jsxImportSource @carnelian-diagram/core */

// The rest of the .tsx file
...
```

Here is the example for a simple interactive rectangle:
```typescript
/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { withInteractiveRect } from "@carnelian-diagram/interaction";

export interface RectProps {
    x: number;
    y: number;
    width: number;
    height: number;
    style?: any;
}

export const Rect: DiagramElement<RectProps> = function(props) {
    const { x, y, width, height, style } = props;

    return (
        <rect x={x} y={y} width={width} height={height} style={style} />
    );
};

export const InteractiveRect = withInteractiveRect(Rect);
```

See [Examples folder](https://github.com/YMSpektor/carnelian-diagram/tree/main/examples) for more examples of using the library and [@carnelian-diagram/shapes](https://github.com/YMSpektor/carnelian-diagram/tree/main/packages/shapes/src/basic) package source for creating custom elements.

## Documentation

* [Carnelian Diagram core](https://github.com/YMSpektor/carnelian-diagram/blob/main/docs/core.md)
* [Interactivity](https://github.com/YMSpektor/carnelian-diagram/blob/main/docs/interactivity.md)

## Demo application

Demo application is available [here](https://ymspektor.github.io/carnelian-diagram).

## License

This project is licensed under the terms of the MIT license.