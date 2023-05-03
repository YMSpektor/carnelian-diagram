# Carnelian Diagram
**Carnelian Diagram** is a typescript library that allows you to create interactive diagrams for your web applications.

## Motivation
The library pursues several goals: first of all, it's not only a set of finished tools and features, but also an engine for creating your own. Secondly, **Carnelian Diagram** is designed to be similar to the popular `React` library, so if you're familiar with React, your skills will be useful for this library too: you can develop custom interactive elements and this process is similar to creating functional components in React (using custom and standard hooks like useState and useEffect, JSX syntax, higher-order components etc). This makes **Carnelian Diagram** easy to learn and use in your projects. However the library is not based on React and doesn't require it to be installed in your project, you can use it in vanilla TypeScript/JavaScript or with other tools because the library uses it's own engine *similar* to React, but much simplier and adapted for specific needs.

## Installation

**Carnelian Diagram** is available as a set of several npm packages.

### @carnelian/diagram
This package is a core of **Carnelian Diagram** library and contains base functionality to create and render diagrams.

```sh
npm install @carnelian/diagram
```

### @carnelian/interaction
This package contains tools to make diagram and its elements respond to a user's input.

```sh
npm install @carnelian/interaction
```

### @carnelian/shapes
This package containt some ready to use basic diagram elements and shapes: rectangle, ellipse, polygons, lines, text elements, etc.

```sh
npm install @carnelian/shapes
```

## Examples

### Example - Basic usage

```typescript
import { Diagram, DiagramDOM, DiagramRoot } from "@carnelian/diagram";
import { InteractionController, withInteraction } from "@carnelian/interaction";
import { 
    InteractiveRoundedRect as RoundedRect,
    InteractiveCircle as Circle 
} from "@carnelian/shapes/basic";

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
    "jsxImportSource": "@carnelian/diagram"
  }
}
```
Instead of adding `jsxImportSource` to the tsconfig.json, you can define the typescript pragma at the beginning of your .tsx files. This can be useful when your project has already had some other JSX configuration (e.g. React projects) and you need to overwrite it for you custom diagram elements.

```typescript
/** @jsxImportSource @carnelian/diagram */

// The rest of .tsx file
...
```

Here is the example for a simple interactive rectangle:
```typescript
/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { withInteractiveRect } from "@carnelian/interaction";

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
To create more complex diagram elements see documentation below

## Documentation

* Carnelian Diagram engine
* Interactivity

## License

This project is licensed under the terms of the MIT license.