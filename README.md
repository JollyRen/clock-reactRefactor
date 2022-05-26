# Clock Nano-React-App Refactor

- [The Premise](https://github.com/JollyRen/clock-reactRefactor/tree/gh-pages#the-premise)
- [The Project](https://github.com/JollyRen/clock-reactRefactor/tree/gh-pages#the-project)
- [Ready! Set! Go!](https://github.com/JollyRen/clock-reactRefactor/tree/gh-pages#ready-set-go)
- [It's All Relative](https://github.com/JollyRen/clock-reactRefactor/tree/gh-pages#its-all-relative)
- ["We're Going Back... To the Future!"](https://github.com/JollyRen/clock-reactRefactor/tree/gh-pages#were-going-back-to-the-future)
  - [Quantumly Entangled](https://github.com/JollyRen/clock-reactRefactor/tree/gh-pages#quantumly-entangled-nodes)

- [The End of Time](https://github.com/JollyRen/clock-reactRefactor/tree/gh-pages#the-end-of-time)

## The Premise

First off, I want to point out that this project is from the 30 Javascript apps in 30 days challenge / course from Wes Bos which you can [find here](https://javascript30.com/).

While Wes Bos' original project is a very straightforward and concise app, I'm on a journey to go through the course using nano-react-app or create-react-app to convert these usually small projects into a framework.

Yes, it's impractical. No, the projects don't warrant the overhead of all the boilerplate. Yes, I will likely go back through and do the projects in MUI or Tailwind CSS for practice.

And that's the crux of it. Practice. It's practice while I'm between projects and work. ABC and keep sharp!

Now onto the project!

## The Project

This project focuses around these main points:

- Animation using:
  - Classes
  - DOM Element selection by ID

- setTimeout() to keep track of a single NOW

Animation is a rotation of a div element positioned absolutely inside the clock to act as a clock hand.

I changed it a little by adding a splash of color to the hour-hand and changing the thicknesses of the divs between all three, as well as the width and absolute position of the hour hand.

It just looked better to me to have it kind of like the old clocks of my yesteryear. I might change the CSS again later to swap the colors, or maybe I'll add numbers around the border of the clock — who knows!

## Ready! Set! Go!

Right from the start, I knew the most difficult part of this was going to be the DOM selection.

using `getElementById` doesn't work within the React app due to a lack of actual HTML or DOM. It's a synthetic DOM with [synthetic events](https://reactjs.org/docs/handling-events.html).

Instead of eating the frog on this one, I set that aside for last. First up I wanted to get a context for "now" and a way to keep it updating at the right time, and not too often.

I didn't want to have a new `Date()` instance in every component, since that could get messy. I also wanted each hand to be its own div because... Well, it's a small app and I needed a challenge.

I wanted to do a `useContext` app since I haven't really had a chance to use it before (and I don't really like the `useReducer` so much for something like this)

First off, I created the components, created an index for them (something I'm trying to get into the habit of doing), imported them into the index, and re-exported them.

After that, I imported the Min, Hour, and Second components into the main `App.jsx` file. I moved the divs for the hands into the components.

The components will each handle the logic for the rotation, which we'll get to in a bit. First, I needed to set up my context.

## It's All Relative

This is a really small app. I wanted to demonstrate the `useContext` usage to myself, so I decided I'd look at how others have done it.

Interestingly, they wrap the whole `App.jsx` in the Provider component. I decided that makes a lot of sense for me too. I'll try to segment my contexts another time as needed in different siblings, but for now it isn't necessary.

```jsx
import React, { useState, useEffect, createContext } from 'react'

export const NowContext = createContext()

export default ({ children }) => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(intervalId)
  }, [now])

  return <NowContext.Provider value={{ now, setNow }}>{children}</NowContext.Provider>
}
```

I started things off by making a component called `NowContextProvider` and importing `useState`, `useEffect`, and `createContext` in it, along with `React`.

I made sure to export the `NowContext` I create, since I'll need that later.

Next I instantiate the newDate by default for first render (it'll happen so fast no one will notice, but there are better ways to do it, for sure)

Next, I set up the useEffect to take `now` as a dependency, always setting now to the current time every second.

make sure to simulate an onUnmount lifecycle event by returning a `clearInterval(intervalId)` for your setInterval. If you don't do this, you'll just have a bunch of dates ticking and memory leaks, etc.

Next, return an object of `<NowContext.Provider>` wrapping its children

We make a component that works this way because otherwise there's a good chance that just putting `NowContext.Provider` around your `<App />` will be undefined. You want to set it to a default value, which is now the current date and time.

The `index.jsx` should now look like:

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import NowContextProvider from './NowContextProvider'

ReactDOM.render(
  <NowContextProvider>
    <App />
  </NowContextProvider>,
  document.getElementById('root')
)
```

Now in the individual components:

```jsx
import React, { useContext, useState, useEffect } from 'react'
import { NowContext } from '../NowContextProvider.jsx'

export default () => {
  const { now } = useContext(NowContext)

  return <div className="hand hour-hand"/>
}
```

## "We're Going Back... To the Future!"

Now that we're passing time down to children from the Provider at the beginning of time, it's time to do something with it!

So what are we trying to do, really? Well we need to get the degree of rotation from the time itself. The way Wes Bos did it was by dividing time by its base after using `getSeconds()` or `getMinutes()` (12 for hours, 60 for minutes, 60 for seconds). That works fine for my purposes as well.

Keep in mind that degrees are base 360, time is base 60 or base 12, which are all divisible by 4 and each of those are divisible by 3. Kind of a small thing in principle, but somewhat powerful in application.

Sumerians invented our time scale by virtue of inventing the base-60 mathematics that is its foundation. The Babylonians did a bunch of work with that system, to likely give us our idea of "degrees" that we use today.

Next time you use a clock, it's simple function might amaze you.

The formula to convert this in JS is:
`seconds / 60 * 360` but we need to add `+ 90`. This is because the top of the div is already at 0°.

If you want to simplify this math, you can actually do a bit of a flip in the CSS. But this requires a bit of extra math, so in the end it's probably just easier to add 90° and be done with it.

It does, though, create a bit of an issue we'll see later.

Our Hour, Minute, and Second components COULD be a single component, which I might do another time. However, for now, they're just very similar siblings.

```jsx
import React, { useContext, useState, useEffect, useRef } from 'react'
import { NowContext } from '../NowContextProvider.jsx'

export default () => {
  const { now } = useContext(NowContext)
  const [hourDegrees, setHourDegrees] = useState(90)
  const [hourHand, setHourHand] = useState(useRef())

  useEffect(() => {
    setHourDegrees((now.getMinutes() / 12) * 360 + 90)
  }, [now])

  useEffect(() => {
    const rotationByRef = () => {
      hourHand.current.style.transform = `rotate(${hourDegrees}deg)`
    }
    rotationByRef()
  }, [hourDegrees])

  return <div className="hand hour-hand" ref={(node) => (hourHand.current = node)} />
}
```

Carrying on from before, we start our degrees at a default of +90 on first render with a `useState` for `hourDegrees`.

We also have a `useEffect` that updates with `setHourDegrees` with the current time, every time that `now` changes. Remember, `now` is gotten from the `NowContext` we set up.

Now, that's great, but how do we select the div? You can't just do a `getElementById`, afterall.

Well, we can use a handy little guy called `useRef`.

What happens is that we end up making a ref of `hourHand` similarly to doing `const hourHand = document.getElementById('.hour-hand')` because we pass the node to the ref as the div is built.

We do that with `ref={(node) => hourHand.current = node}`

### Quantumly Entangled Nodes

If you wanted to find out what this does, you can `console.log(hourHand)` in either `useEffect` for an initial render.

Inside of the `hourHand` object, you'll have a property called `current`. The object looks something like:

```js
const hourHand = {
  // current: div.hand.hour-hand
  current: {
    accessKey: "",
    align: "",
    classList: { //DOMTokenist(2)
      0: "hand",
      1: "hour-hand",
      length: 2,
      value: "hand hour-hand"
    },
    className: "hour hour-hand",
    localName: "div",
    nodeName: "DIV",
    outerHTML: "<div class="hand hour-hand" style="transform: rotate(120deg);"></div>",
    //and dozens more, until...
    style: { // CSSStyleDeclaration
      //dozens and dozens of styles
      transform: "rotate(450deg)" //or whatever
    }
  }
}
```

Why does this work?! How can we change the `<div>` through changing the property of this object?!

Simply through passing data by reference, rather than pass by value. If we did a `hourHand.current = {...node}` it would get a copy of the node, not the node's reference in memory. Cool huh?

So since it's now like these bits are [quantumly entangled](https://en.wikipedia.org/wiki/Quantum_entanglement), we can change one and the other will change.

So that's what we do with the second `useEffect` tied to `hoursDegrees`. Every time it updates, it updates the string on our target node, without having an event to target it, like a click or keypress. There's nothing to change, either.

However, now that you're changing the node, if you wanted to add an `onChange` listener, it would find something that's changing. Would this be handy in any other project? I think so.

We do this for each hand and voila! We have our clock, ticking away.

## The End of Time

Did you enjoy this? "Like" the repo, [favorite the guide](https://readme-c72e5.web.app/guide/2sgbhEZoR3diydSRZxut), try to replicate it yourself, join Wes Bos' Javascript30 challenge or course.

Check out my [personal website](https://JollyRen.github.io), [LinkedIn](https://www.linkedin.com/in/jeremy-daniel-rogers/), or [GitHub](https://github.com/JollyRen) page for more like this.
