# Interactivity

The `@carnelian-diagram/interactivity` package provides several tools to make your diagram and elements interactive - in other words, they will respond to a user's input

## Interactive root and InteractionController

The first thing you need to make your diagram interactive is to pass a specific root component to the `DiagramDOM.createRoot` using the `withInteractivity` function and pass an instance of `InteractionController` there. The `withInteractivity` function wraps all diagram elements to a container that makes interactivity work by providing several context objects (similar to React context) to child elements and the elements can consume them using useContext and higher-level hooks described below in this document.

```typescript
import { Diagram, DiagramDOM, DiagramRoot } from "@carnelian-diagram/core";
import { InteractionController, withInteractivity } from "@carnelian-diagram/interactivity";

const diagram = new Diargam();
const controller = new InteractionController();
const root = DiagramDOM.createRoot(diagram, rootElement, withInteractivity(DiagramRoot, controller));
```

The InteractionController is a central element of the interaction system. It's responsible to handle the user input and perform corresponding actions to diagram elements. Once created the interaction controller must be attached to a DOM element (usually the `<svg>` element or its container) that will receive the input events and treat them as interaction with diagram.

```typescript
controller.attach(rootElement);
```

## Hooks

Receiving and dispatching the input events is not enought for interactivity. Different elements can process the same user action differently. For some elements dragging a vertex handle will resize the element, for others it will change the position of this particular vertext. In other words, the elements must know how to respond to a particular action. It's possible by using some specific hooks provided by @carnelian-diagram/interactivity package:
* useSelection
* useHitTest
* useIntersectionTest
* useCollider
* useAction
* useControls
* useTransform

### Selection and useSelection hook

The `InteractionController` holds the list of selected elements. Elements can be selected manually (by clicking the element or using selection rect tool) or programmatically by calling the `select` method of the InteractionController. It's possible to get a selection state of the element from the element function using a `useSelection` hook:

```typescript
const { isSelected } = useSelection();

return (
    <rect ... fill={isSelected ? "yellow": "white"} />
)
```

### Hit testing and useHitTest hook

Hit testing is a process of determining whether the cursor is over a given element. The InteractionController performs hit testing when a user clicks or move the mouse cursor over a diagram to select an element at the mouse position or update the mouse cursor. The library provides you ability to define a shape of the elements and for additional interactive parts using a `useHitTest` hook. The function accepts the following arguments:
* `callback: (point: DOMPointReadOnly, tolerance: number) => boolean` - It's a function determining whether a specific point belongs the given hit area. The `point` contains the mouse position converted to the element coordinates. The second `tolerance` parameter contains the corresponding value passed to the `useHitTest` function (see below) also converted to the element coordinate space. The function must return true if the point belongs the given area (considering the `tolerance` if needed) and false if it doesn't.
* `bounds: Rect | null` - Specifying the shape bounds allows to avoid expensive computations for some shapes if the cursor is far away from your element. If bounds are set the library performs hit testing in two phases: broad phase and narrow phase. During the broad phase it discards all the elements which bounds doesn't contain the cursor position. And during the narrow phase it only calls the callbacks for the elements that passed broad phase or doesn't specified any bounds at all.
* `hitArea: HitArea<T>` - This argument describes the properties of the given hit area. The `HitArea` type has the following fields:
  * `type: string` - Use any string value to distinguish different hit areas
  * `index?: number` - An optional field that can be used when you define similar hit areas in a loop (for example, if you define several vertices for your polyline element)
  * `cursor?: string` - Here you can specify the css cursor value (e.g. `move`, `ew-resize` etc.) for the mouse pointer to indicate to the user expected behavior when they start dragging the element at the given point. Optional.
  * `action?: string` - Defines the action that will be dispatched to the element when a user starts dragging (see `useAction` documentation below). Optional.
  * `dblClickAction?: string` - Similar to the previous field, but the action will be dispatched on double click event. Optional.
  * `data?: T` - Allows to define any custom data for the specific hit area. Optional.
* `tolerance: number` - An optional argument that is used to expand the hit testing area by some screen pixels. It's useful for small or narrow hit areas like points or line segments to make it easier for users to click. The value is 0 by default.
* `priority: number` - An optional argument allowing to define a priority to a given hit area. The InteractionController when performs hit tesing does it starting from the highest priorities. Usually element controls (see below) must have higher priority that the element inner area, so this parameter allows you to achive such behaviour. By default the priority is 0.
* `element?: DiagramElementNode` - Allows to define which diagram element the hit area belongs to. If not specified the library consider using the current rendering element and this is what you need in the most cases, except calling the hook inside a `useControls` callback (see below) because this callback is being called after all elements are rendered and there is no current element defined in the rendering context.

Here is the example of using the hook for the element that represent a circle with a given center point and radius:
```typescript
import { useHitTest } from "@carnelian-diagram/interactivity";
import { distance } from "@carnelian-diagram/interactivity/geometry";

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
import { useHitTest, circleHitTest } from "@carnelian-diagram/interactivity";

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

The library also supports native hit testing based on the browser pointer events for svg elements. Although the use of the useHitTest hook is more flexible, you can attach a hit area to a specific svg node using `createHitTestProps` function:

``` typescript
import { createHitTestProps } from "@carnelian-diagram/interactivity";

...

const hitTestProps = createHitTestProps({ type: "in", cursor: "move", action: "move" });

return (
    <rect ... {...hitTestProps} />
)
```

### Intersection testing and useIntersection hook

Intersection testing is similar to hit testing. The first difference is the intersection testing checks if the element intersects with a given rectangle (instead of a point). The InteractionController performs intersection tests to define which elements should be selected when a user selects elements using a selection rect tool. The second difference is the element doesn't need to specify any hit areas. The only purpose of the intersection testing is to determine whether the object intersects the given selection rectangle or not. 

To respond to intersection testing your element can use a `useIntersectionTest` hook. The hook accepts the following arguments:
* `callback: (selection: Collider<any>) => boolean` - The function should return true if the given element intersects with the selection. The `selection` value is defined using svg viewport coordinate system, so you don't have to convert it from the mouse event client coordinates.
* `bounds: Rect | null` - Similar to hit testing, specifying the shape bounds allows to avoid expensive computations for some shapes if the selection rectangle is far away from your element. The library performs intersection testing in two phases: broad phase and narrow phase. During the broad phase it discards all the elements which bounds doesn't intersect with the selection rectangle. And during the narrow phase it only calls the callbacks for the elements that passed broad phase or doesn't specified any bounds at all.

Here is the example of using the `useIntersectionTest` hook:

```typescript
import { useIntersectionTest, CollisionFunctions } from "@carnelian-diagram/interactivity";
import { circleBounds } from "@carnelian-diagram/interactivity/geometry";

...

const { x, y, radius } = props;
useIntersectionTest(
    (selectionRect) => {
        return !!CollisionFunctions.circleRect({ center: {x, y}, radius }, selectionRect);
    },
    circleBounds({ center: {x, y}, radius })
);
```

### Colliders and useCollider hook

The `useHitTest` and `useIntersectionTest` hooks together allow to define an element shape. But the library provides one more tool to do this using a single hook: `useCollider`. A collider is an object that describes an element geometry and the library can compute intersections (collisions) between different colliders. The `useCollider` hook combines `useHitTest` and `useIntersectionTest` calls let the collision detection system to check intersections.

The hook accepts the following arguments:
* `collider: Collider<T>` - A collider object to define the element shape. The library allows to create colliders for some basic shapes (point, line segment, circle, ellipse, rectangle, polygon etc), combine colliders with logical operations (union, intersection, difference, inversion) and create custom colliders.
* `hitArea: HitArea` - Hit area object used for hit testing.
* `tolerance: number` - An optional argument that is used to expand the hit testing area by some screen pixels. It's useful for small or narrow hit areas like points or line segments to make it easier for users to click. The value is 0 by default.
* `priority: number` - An optional argument for the hit test area priority. By default the value is 0.
* `element?: DiagramElementNode` - Defines the element the hitting area belongs to. If not specified, the library uses the current rendering element.

Here is a simple example of using the `useCollider` hook:
```typescript
import { CircleCollider, useCollider } from "@carnelian-diagram/interactivity";

...

const { x, y, radius } = props;
useCollider(CircleCollider({center: {x, y}, radius}), { type: "in", cursor: "move", action: "move" });
```

For more complex examples of colliders see implementation of [Donut](https://github.com/YMSpektor/carnelian-diagram/blob/main/packages/carnelian-shapes/src/basic/donut.tsx) or [Pie](https://github.com/YMSpektor/carnelian-diagram/blob/main/packages/carnelian-shapes/src/basic/pie.tsx) elements.

Using the `useCollider` hook can replace the use of `useHitTest` and `useIntersectionTest` to define an element inner area, but the `useHitTest` function is still useful for active areas of your elements (like element controls - see later). Also keep in mind that using complex accurate colliders can negatively affect performance, consider using simplistic shapes like element bounds rectangle if you have performance issues.

### Actions and useAction hook

Actions are the mechanism to respond the user input. Different elements and even different parts of the same element can respond to the same user action (like dragging or double click) differently. Once this kind of action occurs the InteractionController dispatches the action defined in the hit area to the element it belongs to. The element receives the action with some kind of payload specific to the action type and can provide a callback to handle the action and update the element properties or state. It's possible using the `useAction` hook that accepts the following arguments:
* `actionType: string` - The name (or type) of the action that the element should handle.
* `callback: <T>(payload: T) => void` - The callback function that will be called when the action is dispatched to the element. You can update the element here.
* `element?: DiagramElementNode` - Defines the element handling the action. If not specified, the library uses the current rendering element. This argument is mostly needed to use in element controls (see later) as they are being rendered after and above all the diagram elements and don't belong to them.

Here is the example of using the hook:

```typescript
import { CircleCollider, DragActionPayload, useAction, useCollider } from "@carnelian-diagram/interactivity";

const { x, y, radius, onChange } = props;
useCollider(CircleCollider({center: {x, y}, radius}), { type: "in", cursor: "move", action: "move" });
useAction("move", (payload: DragActionPayload) => {
    onChange((props) => ({
        ...props,
        x: props.x + payload.deltaX,
        y: props.y + payload.deltaY
    }))
});
```

The library provides some standard action types that the InteractionController treats in a special way, one of them is ACT_MOVE. The main distinction of this action is the InteractionController dispatches it to all selected elements allowing to move the whole selection when the user performs dragging. You can rewrite the example above as following:

```typescript
import { ACT_MOVE, CircleCollider, DragActionPayload, useAction, useCollider } from "@carnelian-diagram/interactivity";

const { x, y, radius, onChange } = props;
useCollider(CircleCollider({center: {x, y}, radius}), { type: "in", cursor: "move", action: ACT_MOVE });
useAction(ACT_MOVE, (payload: DragActionPayload) => {
    onChange((props) => ({
        ...props,
        x: props.x + payload.deltaX,
        y: props.y + payload.deltaY
    }))
});
```

### Element controls and useControls hook

Controls are interactive parts of diagram elements that allow to manipulate (resize, change shape, etc) the element with a mouse and also have some visual presentation (e.g. small yellow squares at the position of the shape corners). Controls are usually visible when the element they belong to is selected. The library renders controls on a separate layer on top of the elements that makes controls visible even if they are overlapped with other elements. To add controls to the element use a `useControls` hook. It accepts a single argument:
* `callback: (transform: DOMMatrixReadOnly, element: DiagramElementNode) => JSX.Element` - Inside this callback you can render all needed controls and return them as JSX similar to how you render element itself. Usually controls must have fixed size in screen pixels that doesn't depend on a svg viewport settings, so the control layer defines it's own coordinates system where the pixel size equals to a screen pixel. The `transform` argument allows to convert diagram viewport coordinates to this controls coordinate system. As said above, the library renders controls after the elements, so when the callback has been called it does not have the element reference in the render context, so the hooks like `useHitTest` or `useAction` (that are called in standard control components - see below) won't work inside the callback if you don't pass the element reference there manually.

The library provides two standard control components, so you can use them instead of implementing controls on your own:
* `HandleControl` - A small box (or circle or other shape) that can be dragged to alter the element properties, such a size, position etc.
* `EdgeControl` - Allows to drag the whole edge to resize the element.

Here is the example of using the `useControls` hook for the line segment element:
```typescript
import { DragActionPayload, HandleControl, useAction, useControls } from "@carnelian-diagram/interactivity";

...

const { x1, y1, x2, y2, onChange } = props;

function moveVertex(payload: DragActionPayload) {
    onChange(props => ({
        ...props,
        x1: payload.hitArea.index === 0 ? payload.position.x : props.x1,
        y1: payload.hitArea.index === 0 ? payload.position.y : props.y1,
        x2: payload.hitArea.index === 1 ? payload.position.x : props.x2,
        y2: payload.hitArea.index === 1 ? payload.position.y : props.y2,
    }));
}

useAction("vertex_move", moveVertex);

function createHandleControl(
    index: number, 
    x: number, y: number, 
) {
    return {
        x, y,
        hitArea: {
            type: "vertex_handle",
            index,
            cursor: "move",
            action: "vertex_move"
        }
    }
}

useControls((transform, element) => {
    const handles = [
        createHandleControl(0, x1, y1),
        createHandleControl(1, x2, y2)
    ];

    return (
        <>
            { handles.map((control) => (
                <HandleControl
                    key={control.hitArea.index}
                    kind="default"
                    x={control.x} y={control.y} hitArea={control.hitArea}
                    transform={transform} 
                    element={element}
                />
            )) }
        </>
    );
});
```

### Element transformations and useTransforms hook

The `useTransform` hook allows to apply 2D transformation (such rotation) to an element. Calling this hook will not transform your svg element itself, but once called the library will use transformed coordinates to be passed to `useHitTest`, `useIntersectionTest`, `useControls`, etc. To transform the svg element itself, wrap it to the `<g transform="...">` tag (or use `withRotation` HOC from the `@carnelian-diagram/shapes` package).

The `useTransform` hook called with an argument allows to set the element transformation:
* `transform?: DOMMatrixReadOnly` - Specifies the transformation matrix to be applied

```typescript
import { rotateTransform, useTransform } from "@carnelian-diagram/interactivity";

...

const transform = rotateTransform(props.rotation);
useTransform(transform);
```

If the function is called with no arguments, it just returns the current transformation and don't modify it:

```typescript
const currentTransform = useTransform();
```

## Higher-order components

The library provides some higher-order components (or just HOCs) built using the hooks described above to implement standard behaviour for common elements:
* `withInteractiveRect` - implements interactivity for rectangle-like elements (requires `x`, `y`, `width` and `height` fields in the element props):
  * Four resize handles on the corners
  * Four edges allowing to resize the element in one direction
  * Interactive inner area allowing to drag the element itself
* `withInteractiveSquare` - similar to the previous HOC, but always keeps the width and the height of the element equal. Requires `x`, `y` and `size` fields in the element props.
* `withInteractiveCircle` - similar to the previous HOC, but requires `x`, `y` (which define the circle center point) and `radius` fields in the element props.
* `withInteractiveLine` - implements interactivity for the line segment elements (defined with two points. Requires `x1`, `y1`, `x2`, `y2` fields in the element props):
  * Two vertex handles allowing to drag the vertex
  * Interactive inner area allowing to drag the element itself
* `withInteractivePolyline` - allows to make interactive polyline/polygon elements (requires the `points` field in the element props containing an array of the polyline/polygon vertices):
  * Vertex handles allowing to drag the vertex or remove it on double clicking
  * Edges allowing to insert new vertex on double clicking
  * Interactive inner area allowing to drag the element itself
* `withInteractiveText` - allows to show inplace text editor (on double click event) to edit the element text (requires the `text` field to be defined in the element props)
* `withInteractiveRotation` - adds a rotation handle allowing to rotate the element around some origin.
* `withKnob` - adds customizable handle control to suit a particular task (e.g. border radius for rounded rectangle). See [RoundedRect](https://github.com/YMSpektor/carnelian-diagram/blob/main/packages/carnelian-shapes/src/basic/rounded-rect.tsx) or [Parallelogram](https://github.com/YMSpektor/carnelian-diagram/blob/main/packages/carnelian-shapes/src/basic/parallelogram.tsx) elements for example.

Here is the example using the `withInteractiveRect` HOC:

```typescript
/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { withInteractiveRect } from "@carnelian-diagram/interactivity";

interface RectProps {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const Rect: DiagramElement<RectProps> = function(props) {
    const { onChange, ...rest } = props;

    return (
        <rect {...rest} />
    );
};

export const InteractiveRect = withInteractiveRect(Rect);
```

## Customizing InteractionController

The `InteractionController` implements many actions by default but it can be configured to suit your needs. It contains a collection of interaction services and allows you to configure, replace or implement your own services that will handle the user's input. For more information see the [standard services implementation](https://github.com/YMSpektor/carnelian-diagram/tree/main/packages/carnelian-interaction/src/services).

Here is the example allowing to configure the diagram paper and grid snapping:
```typescript
import { InteractionController, isGridSnappingService, isPaperService } from "@carnelian-diagram/interactivity";

const controller = new InteractionController(diagram, (services) => {
    services.configure(isPaperService, (service) => {
        service.paper = {
            x: 0,
            y: 0,
            width: 2100,
            height: 2970,
            majorGridSize: 200,
            minorGridSize: 50
        };
    });

    services.configure(isGridSnappingService, (service) => {
        service.snapGridSize = 50;
        service.snapAngle = 5;
    });
});
```