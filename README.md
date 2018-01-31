# react-ctrl

A higher-order component for authoring components that can be both stateful and stateless for certain props, using the controlled / uncontrolled pattern.

```
npm install react-ctrl
```

## Why

ReactCtrl is designed to turn any working stateful component into a stateless one simply by passing props that correspond to a state key.

Let's take the following component that implements the following patterns:

* Toggling the state of `isOpen` using a state callback.
* Provides a default state of `false` for `isOpen` using the `isOpenByDefault` default property.
* When `isOpen` is `true`, the `onOpen` callback is called.
* When `isOpen` is `false`, the `onClose` callback is called.

```js
import React, { Component } from "react";

class Toggle extends Component {
  static defaultProps = {
    onClose() {},
    onOpen() {}
  };
  state = {
    isOpen: false
  };
  handleToggle = () => {
    const { onClose, onOpen } = this.props;
    this.setState(
      state => ({ isOpen: !state.isOpen }),
      () => (this.state.isOpen ? onOpen() : onClose())
    );
  };
  render() {
    return (
      <button onClick={this.handleToggle}>
        Toggle ({this.state.isOpen ? "open" : "closed"})
      </button>
    );
  }
}
```

You'll notice that `render()` never reaches into `props` to get the `isOpen` value, which means that this component cannot take `isOpen` as a prop to be open.

### Making state opt-in stateless via props

Let's say you want to then be able to make the `isOpen` state value stateless by having a corresponding `isOpen` prop. You'd then have to do something like:

```js
const isOpen = `isOpen` in props ? props.isOpen : state.isOpen;
```

This can get tedious to do for every single piece of state you want to implement this pattern for. You could write your own abstractions that automate this, or you could use `react-ctrl`.

## Usage

ReactCtrl automates the tedium of mapping props to state for stateless behaviour.

```js
import withCtrl from "react-ctrl";

// ...

export default withCtrl(Toggle);
```

When you access `state`, the `isOpen` value will refelct the value from `props` if it is specified by the consumer.

### Automating default state from default props

In the `Toggle` component above, we've had to initialise default state to ensure a valid value can be used. However, a consumer cannot yet pass in what that default state should be. In a standard uncontrolled component, such as an `<input />`, the established pattern is to provide a `defaultValue` to initialise the default `value` of the element.

Ignoring the other props for a moment, we could do this manually by doing something like:

```js
static defaultProps = {
  defaultIsOpen: false
};
state = {
  isOpen: this.props.defaultIsOpen
};
```

However, that can become a little tedious. If you don't mind the convention of a prefixed `default`, then you could simply remove the setting of `state` altogether and ReactCtrl will pull the default state value from `static defaultProps`.

The final component would look like:

```js
import React, { Component } from "react";

class Toggle extends Component {
  static defaultProps = {
    defaultIsOpen: false,
    onClose() {},
    onOpen() {}
  };
  handleToggle = () => {
    const { onClose, onOpen } = this.props;
    this.setState(
      state => ({ isOpen: !state.isOpen }),
      () => (this.state.isOpen ? onOpen() : onClose())
    );
  };
  render() {
    return (
      <button onClick={this.handleToggle}>
        Toggle ({this.state.isOpen ? "open" : "closed"})
      </button>
    );
  }
}
```

And it could be used like:

```js
/* Uncontrolled (defaults) */
<Toggle />

/* Uncontrolled (user-defined) */
<Toggle defaultIsOpen />

/* Controlled. */
<Toggle isOpen />
```
