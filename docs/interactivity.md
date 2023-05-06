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
* useControls
* useHitTest
* useIntersectionTest
* useCollider
* useAction

### Selection and useSelection hook

The `InteractionController` holds the list of selected elements. Elements can be selected manually (by clicking the element or using selection rect tool) or programmatically by calling the `select` method of the InteractionController. It's possible to get a selection state of the element from the element function using a `useSelection` hook:

```typescript
const { isSelected } = useSelection();

return (
    <rect ... fill={isSelected ? "yellow": "white"} />
)
```

### Element controls and useControls hook

### Hit testing and useHitTest hook

### Intersection testing and useIntersection hook

### Colliders and useColloder hook

### Actions and useAction hook

## Higher-order components

## Customizing InteractionController