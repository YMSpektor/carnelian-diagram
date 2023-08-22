# Creating custom interactive elements

In this tutorial, we will demonstrate the process of creating interactive custom elements using the **Carnelian Diagram** library. To showcase its capabilities, we will create a character reminiscent of the well-known Pac-Man. The interactivity of this character will include the following actions:

* Resizing
* Moving
* Opening its mouth
* Modifying the eye radius

## Creating the element template

Similar to the React library, to create a custom element we need to define a function that returns JSX. But unlike the React, that JSX functionality must be imported from the *@carnelian-diagram/core* package. This can be accomplished using the *@jsxImportSource* TypeScript pragma:

```typescript
/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";

export interface PacmanProps {
    // TODO: define the element props
}

export const Pacman: DiagramElement<PacmanProps> = function(props) {
    // TODO: implement the element
}
```

## Drawing the element

To draw a Pac-Man character we need to pass some properties to the element function:
* Center point position
* Radius
* Mouth angle
* Eye radius

These properties should be declared inside the *PacmanProps* interface. We can also extend the *CircleBaseProps* interface that contains an element center and radius as well as element style properties like stroke and fill:

```typescript
import { CircleBaseProps } from "@carnelian-diagram/shapes";
import { NumberOrPercentage } from "@carnelian-diagram/shapes/utils";

export interface PacmanProps extends CircleBaseProps {
    mouthAngle: number;
    eyeRadius: NumberOrPercentage;
}
```

Please note that we are using the NumberOrPercentage type from the *@carnelian-diagram/shapes/utils*. This type allows us defining the values both using the absolute numbers or percentage values, like "10%" (considering 100% is the character radius). In the second case the eye will be scaled together with the character.

Now we can draw the element using the SVG *path* tag. We will also define some helper functions to calculate parameters needed for drawing:

```typescript
import { clamp, degToRad, Point } from "@carnelian-diagram/interaction/geometry";
import { convertPercentage, NumberOrPercentage } from "@carnelian-diagram/shapes/utils";

const MAX_MOUTH_ANGLE = 120;

function getPointOnCircle(x: number, y: number, radius: number, angle: number): Point {
    return {
        x: x + radius * Math.cos(degToRad(angle)),
        y: y + radius * Math.sin(degToRad(angle))
    }
}

// Restricts the eye radius to be not more than 1/4 of the element radius
function clampEyeRadius(value: number, radius: number) {
    return clamp(value, 0, radius / 4);
}

function calcEyeRadius(props: PacmanProps): number {
    return clampEyeRadius(convertPercentage(props.eyeRadius, props.radius), props.radius);
}

function getEyeCenter(props: PacmanProps): Point {
    return {
        x: props.x,
        y: props.y - props.radius / 2
    }
}

export const Pacman: DiagramElement<PacmanProps> = function(props) {
    let { onChange, x, y, radius, mouthAngle, eyeRadius, ...rest } = props;

    mouthAngle = clamp(mouthAngle, 0.001, MAX_MOUTH_ANGLE);
    const mouthStart = getPointOnCircle(x, y, radius, mouthAngle / 2);
    const mouthEnd = getPointOnCircle(x, y, radius, -mouthAngle / 2);

    const eyeCenter = getEyeCenter(props);
    eyeRadius = calcEyeRadius(props);

    let path = `
        M${mouthStart.x} ${mouthStart.y} A${radius},${radius} 0 1 1 ${mouthEnd.x} ${mouthEnd.y} L${x} ${y}Z
        M${eyeCenter.x - eyeRadius} ${eyeCenter.y} a${eyeRadius},${eyeRadius} 0 1 0 ${eyeRadius * 2} 0 a${eyeRadius} ${eyeRadius} 0 1 0 -${eyeRadius * 2} 0`;

    return (
        <path d={path} {...rest} />
    );
}
```

## Interactivity

Now we can add interactivity to our element

### Moving and resizing

The easiest way to implement moving and resizing is just using the standard *withInteractiveCircle* higher-order component (HOC) function:

```typescript
import { withInteractiveCircle } from "@carnelian-diagram/interaction";

export const InteractivePacman = withInteractiveCircle(Pacman);
```

But we can improve its behaviour. If we declare our InteractivePacman like above, a user will be able to click inside the character mouth or eye and select or move it, but these areas are technically outside the element and should be transparent for the mouse pointer events. This can be accomplished using *Colliders*:

```typescript
function PacmanCollider(props: PacmanProps) {
    // TODO: implement the element collider
}

export const InteractivePacman = withInteractiveCircle(
    Pacman,
    { collider: PacmanCollider }
);
```

### Implementing collider function

The library provides set of functions allowing to create colliders of different shapes and combine them using set operations like intersection, union and difference. Firstly, lets define a shape that includes the outer circle excluding the eye:

```typescript
import { CircleCollider, DiffCollider, withInteractiveCircle } from "@carnelian-diagram/interaction";

function PacmanCollider(props: PacmanProps) {
    let { x, y, radius, mouthAngle } = props;
    
    return DiffCollider(
        CircleCollider({center, radius}),
        CircleCollider({center: getEyeCenter(props), radius: calcEyeRadius(props)})
    );
}
```

To exclude the mouth we can leverage the *HalfPlaneCollider*. As its name suggests, it contains half of the plane defined by two points. Firstly, we need to combine two half-plane colliders using the *union* operation so that the result will contain the whole space excluding the mouth angle, and then we *intersect* it with the collider implemented in the previous step:

```typescript
import { CircleCollider, DiffCollider, HalfPlaneCollider, IntersectionCollider, UnionCollider, withInteractiveCircle } from "@carnelian-diagram/interaction";

function PacmanCollider(props: PacmanProps) {
    let { x, y, radius, mouthAngle } = props;

    mouthAngle = clamp(mouthAngle, 0, MAX_MOUTH_ANGLE);
    const center = {x, y};
    const start = getPointOnCircle(x, y, radius, mouthAngle / 2);
    const end = getPointOnCircle(x, y, radius, -mouthAngle / 2);
    
    return IntersectionCollider(
        DiffCollider(
            CircleCollider({center, radius}),
            CircleCollider({center: getEyeCenter(props), radius: calcEyeRadius(props)})
        ),
        UnionCollider(
            HalfPlaneCollider({a: center, b: start}),
            HalfPlaneCollider({a: end, b: center})
        )
    );
}
```

### Eye radius

To manipulate eye radius we need to add a specific handle called *knob*. Once it's done, we can use *withKnob* HOC to wrap our element. To define how the knob will behave we need to implement an interface called *KnobController* that contains 3 members:
* hitArea - specifies the knob handle hitting area
* getPosition - returns the knob position based on element properties
* setPosition - updates the element properties when the knob is moved to a new position.

```typescript
import { convertPercentage, isPercentage, NumberOrPercentage } from "@carnelian-diagram/shapes/utils";
import { CircleCollider, DiffCollider, HalfPlaneCollider, IntersectionCollider, KnobController, UnionCollider, withInteractiveCircle, withKnob } from "@carnelian-diagram/interaction";

const eyeKnobController: KnobController<PacmanProps> = {
    hitArea: {
        type: "eye_knob_handle",
        cursor: "default",
        action: "eye_knob_move",
    },
    getPosition(props) {
        const eyeCenter = getEyeCenter(props);
        return {
            x: eyeCenter.x,
            y: eyeCenter.y - calcEyeRadius(props)
        }
    },
    setPosition(props, {rawPosition: position}) {
        const eyeCenter = getEyeCenter(props);
        let eyeRadius: NumberOrPercentage = clampEyeRadius(eyeCenter.y - position.y, props.radius);
        eyeRadius = isPercentage(props.eyeRadius)
            ? props.radius > 0 ? `${eyeRadius / props.radius * 100}%` : props.eyeRadius
            : eyeRadius;
        return {
            ...props,
            eyeRadius
        }
    }
}

export const InteractivePacman = withInteractiveCircle(
    withKnob(Pacman, eyeKnobController),
    { collider: PacmanCollider }
);
```

### Mouth angle

Let's add mouth behaviour also using a knob handle. We also change *withKnob* HOC to *withKnobs* that allows passing multiple knob controllers. Also we leverage grid snapping feature to snap the mouth angle to a value defined for the InteractionController.

```typescript
import { CircleCollider, DiffCollider, HalfPlaneCollider, IntersectionCollider, KnobController, UnionCollider, withInteractiveCircle, withKnobs } from "@carnelian-diagram/interaction";
import { clamp, degToRad, Point, radToDeg } from "@carnelian-diagram/interaction/geometry";

const mouthKnobController: KnobController<PacmanProps> = {
    hitArea: {
        type: "mouth_knob_handle",
        cursor: "default",
        action: "mouth_knob_move",
    },
    getPosition(props) {
        const mouthAngle = clamp(props.mouthAngle, 0, MAX_MOUTH_ANGLE);
        return getPointOnCircle(props.x, props.y, props.radius, mouthAngle / 2);
    },
    setPosition(props, {rawPosition: position, snapAngle, snapToGrid}) {
        let angle = radToDeg(Math.atan2(position.y - props.y, position.x - props.x));
        angle = snapToGrid ? snapToGrid(angle, snapAngle) : angle;
        return {
            ...props,
            mouthAngle: clamp(angle * 2, 0, MAX_MOUTH_ANGLE)
        }
    }
}

export const InteractivePacman = withInteractiveCircle(
    withKnobs(Pacman, mouthKnobController, eyeKnobController),
    { collider: PacmanCollider }
);
```

## See also
* [Interactivity documentation](https://github.com/YMSpektor/carnelian-diagram/blob/main/docs/interactivity.md)
* [Full source code](https://github.com/YMSpektor/carnelian-diagram/blob/main/examples/react-example/src/examples/pacman.tsx) of the element
* [Demo application](https://ymspektor.github.io/carnelian-diagram) where you can see and test the Pacman element (on the *Examples* element tab) and more.
