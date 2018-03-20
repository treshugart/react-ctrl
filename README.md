# react-ctrl

ReactCtrl is a component that automates the tedium of mapping props to state for stateless / controlled / uncontrolled behaviour from a stateful component.

```
npm install react-ctrl
```

## Why

Managing controlled / uncontrolled values can be tedious, and maintaining the duplication between stateful and stateless components can be exhausting.

## An example

An example of a common pattern is a controlled input that takes `value` plus an `onChange` handler, or an uncontrolled one that takes `defaultValue`. By default React implements this for native controls, however, we often write custom controls and repeat this logic manually.

```js
import React, { Component } from "react";

class Input extends Component {
  state = {
    value: this.props.defaultValue || ""
  };
  onChange = e => {
    const { value } = e.target;
    this.onChange(value);
    this.setState({ value });
  };
  render() {
    const { props, state } = this;
    const value = "value" in props ? props.value : state.value;
    return <input onChange={this.onChange} value={value} />;
  }
}

export default Input;
```

With `react-ctrl`, we simply wrap render logic with it, passing in the `props` and `state` we want it to control, including props that are explicitly passed as default `props` to the component like `defaultValue`.

```js
import React, { Component } from "react";
import Ctrl from "react-ctrl";

export default class extends Component {
  state = {
    value: ""
  };
  onChange = e => {
    const { value } = e.target;
    this.onChange(value);
    this.setState({ value });
  };
  render() {
    return (
      <Ctrl data={this}>
        (mapped => (
        <input onChange={this.onChange} value={mapped.value} />
        ))
      </Ctrl>
    );
  }
}
```

Both of these components can be used like:

```js
<Input />
<Input defaultValue="yay" onChange={fn} />
<Input value="yay" onChange={fn} />
```

However, we've saved a bit of effort and conventionalised the controlled / uncontrolled pattern in the process. This adds up in more complex components where you do this with multiple values.

What's nice about this is that you end up only really having to worry about defining your default state and then accessing it where you want everything to be properly merged together. You don't have to worry about mapping default props, props and the order they should be in to give you the correct values.

## Flow types

This component takes care of the flow typing and even infers the `mapped` props from both your `props` and `state` types, so you don't have to worry about annotating inside the render prop. Just make sure you type your host component and things will just work.
