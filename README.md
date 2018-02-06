# react-ctrl

ReactCtrl is a set of functions that automates the tedium of mapping props to state for stateless / controlled / uncontrolled behaviour from a statefull component.

It's based on the React programming model and API, but it can be used with anything that has `props` and `state` like Preact.

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
```

With `react-ctrl`, we can use the `map()` function to automatically map `props` to `state`, including props that are explicitly passed as default `props` to the component like `defaultValue`.

```js
import React, { Component } from "react";
import map from "react-ctrl";

class Input extends Component {
  state = {
    value: ""
  };
  onChange = e => {
    const { value } = e.target;
    this.onChange(value);
    this.setState({ value });
  };
  render() {
    const { value } = map(this);
    return <input onChange={this.onChange} value={value} />;
  }
}
```

Notice the diff:

```js
+ import map from 'react-ctrl';

// ...

- value: this.props.defaultValue || ""
+ value: ""

// ...

- const { props, state } = this;
- const value = "value" in props ? props.value : state.value;
+ const { value } = map(this);
```

Both of these components can be used like:

```js
<Input />
<Input defaultValue="yay" onChange={fn} />
<Input value="yay" onChange={fn} />
```

However, we've saved a bit of effort and conventionalised the controlled / uncontrolled pattern in the process. This adds up in more complex components where you do this with multiple values.

What's nice about this is that you end up only really having to worry about defining your default state and then calling `map()` where you want everything to be properly merged together. You don't have to worry about mapping default props, props and the order they should be in to give you the correct values.
