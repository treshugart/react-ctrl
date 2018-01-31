# react-ctrl

A higher-order component for authoring components that can be both stateful and stateless for certain props, using the controlled / uncontrolled pattern.

```
npm install react-ctrl
```

## Usage

ReactCtrl is designed to turn any working stateful component into a stateless one simply by passing props that correspond to a state key.

```js
import React, { Component } from "react";

class Toggle extends Component {
  static defaultProps = {
    isOpenByDefault: false,
    onClose() {},
    onOpen() {}
  };
  state = {
    isOpen: this.props.isOpenByDefault
  };
  handleToggle = () => {
    this.setState(
      state => ({ isOpen: !state.isOpen }),
      () => (this.state.isOpen ? this.props.onOpen() : this.props.onClose())
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

Currently, the `Toggle` component maintains its state internally and cannot accept external props to override `isOpen` to be come stateless. For example `<Toggle isOpen />` will not work.

In order to get this to work, you'd have to override `state.isOpen` with `props.isOpen` manually. Simply by doing `withCtrl(Toggle)`, your state will reflect their corresponding props automatically and you don't have to do anything.
