# Interactivity

The `@carnelian/interaction` package provides several tools to make your diagram and elements interactive - in other wodrs, they will respond to a user's input

## Interactive root and InteractionController

The first thing you need to make your diagram interactive is to pass a specific root component to the `DiagramDOM.createRoot` using the `withInteraction` function and pass an instance of `InteractionController` there. The `withInteraction` function wraps all diagram elements to a container that makes interactivity work by providing several context objects (similar to React context) to child elements and the elements can consume them using useContext and higher-level hooks described below in this document.

```typescript
import { Diagram, DiagramDOM, DiagramRoot } from "@carnelian/diagram";
import { InteractionController, withInteraction } from "@carnelian/interaction";

const diagram = new Diargam();
const controller = new InteractionController();
const root = DiagramDOM.createRoot(diagram, rootElement, withInteraction(DiagramRoot, controller));
```

The InteractionController is a central element of the interaction system. It's responsible to handle the user input and perform corresponding actions to diagram elements. Once created the interaction controller must be attached to a DOM element (usually the `<svg>` element or its container) that will receive the input events and treat them as interaction with diagram.

```typescript
controller.attach(rootElement);
```

## Hooks

Receiving and dispatching the input events is not enought for interactivity. Different elements can process the same user action differently. For some elements dragging a vertex handle will resize the element, for others it will change the position of this particular vertext. In other words, the elements must know how to respond to a particular action. It's possible by using some specific hooks provided by @carnelian/interaction package:
* useSelection
* useHitTest
* useIntersectionTest
* useCollider
* useAction
* useControls

### Selection and useSelection hook

The `InteractionController` holds the list of selected elements. Elements can be selected manually (by clicking the element or using selection rect tool) or programmatically by calling the `select` method of the InteractionController. It's possible to get a selection state of the element from the element function using a `useSelection` hook:

```typescript
const { isSelected } = useSelection();

return (
    <rect ... fill={isSelected ? "yellow": "white"} />
)
```

### Hit testing and useHitTest hook

Hit testing is a process of determining whether the cursor is over a given element. The InteractionController performs hit testing when a user clicks or move the mouse cursor over a diagram to select an element at the mouse position or update the mouse cursor. The library provides you ability to define a shape of the elements and some additional interactive parts using a `useHitTest` hook. The function accepts the following arguments:
* `callback: (point: DOMPointReadOnly, transform: DOMMatrixReadOnly) => boolean` It's a function determining whether a specific point belongs the given hit area. The `point` position is always contains client coordinates of the mouse position. To convert the client coordinates into your svg viewport coordinates you can use the second `transform` argument.
* `hitArea: HitArea<T>` This argument describes the properties of the given hit area. The `HitArea` type has the following fields:
  * `type: string` Use any string value to distinguish different hit areas
  * `index?: string` An optional field that can be used when you define similar hit areas in a loop (for example, if you define several vertices for your polyline element)
  * `cursor?: string` Here you can specify the css cursor value (e.g. `move`, `ew-resize` etc.) for the mouse pointer to help a user understand what will happen when the user start dragging the element at the given point. Optional.
  * `action?: string` Defines the action that will be dispatched to the element when a user starts dragging (see `useAction` documentation below). Optional.
  * `dblClickAction?: string` Similar to the previous field, but the action will be dispatched on double click event. Optional.
  * `data?: T` Allows to define any custom data for the specific hit area. Optional.
* `priority: number` An optional argument allowing to define a priority to a given hit area. The InteractionController when performs hit tesing does it starting from the highest priorities. Usually element controls (see below) must have higher priority that element inside area, so this parameter allows you to achive such behaviour. By default the priority is 0.
* `element?: DiagramElementNode` Allows to define which diagram element the hit area belongs to. If not specified the library consider using the current rendering element and this is what you need in the most cases, except calling the hook inside a `useControls` callback (see below) because this callback is being called after all elements are rendered and there is no current element defined in the rendering context.

Here is the example of using the hook for the element that represent a circle with a given center point and radius:
```typescript
import { useHitTest } from "@carnelian/interaction";
import { distance } from "@carnelian/interaction/geometry";

...

const { x, y, radius } = props;
useHitTest(
    (point, transform) => {
        const elemPoint = point.matrixTransform(transform);
        return distance(elemPoint, {x, y}) <= radius;
    },
    {
        type: "in",
        cursor: "move",
        action: "move"
    }
);
```

The library provides some helper functions for hit testing callbacks, so the same behaviour can be achived by using the following code:

```typescript
import { useHitTest, circleHitTest } from "@carnelian/interaction";

...

const { x, y, radius } = props;
useHitTest(
    circleHitTest(x, y, radius),
    {
        type: "in",
        cursor: "move",
        action: "move"
    }
);
```

The library also supports native hit testing, where the browser determines which svg element is under the mouse cursor. Although the use of the useHitTest hook is more flexible, you can attach a hit area to a specific svg node using `createHitTestProps` function:

``` typescript
import { createHitTestProps } from "@carnelian/interaction";

...

const hitTestProps = createHitTestProps({ type: "in", cursor: "move", action: "move" });

return (
    <rect ... {...hitTestProps} />
)
```

### Intersection testing and useIntersection hook

### Colliders and useColloder hook

### Actions and useAction hook

### Element controls and useControls hook

Controls are interactive parts of diagram elements that allow to manipulate (resize, change shape, etc) the element with mouse.

## Higher-order components

## Customizing InteractionController