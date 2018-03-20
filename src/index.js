// @flow

import React, { Component, type ComponentType, type Node } from "react";

// Microbundle doesn't support object spreading.
function assign<A: {}, B: {}>(a: A, b: B): { ...$Exact<A>, ...$Exact<B> } {
  const obj = {};
  [a, b].forEach(arg => {
    for (const key in arg) {
      obj[key] = arg[key];
    }
  });
  return obj;
}

// Formats a defalut prop name using the standard React convention for default
// props: defaultValue -> value.
export function getPropNameFromDefaultPropName(name: string): string | null {
  return name.length > 7 && name.indexOf("default") === 0
    ? name[7].toLowerCase() + name.substring(8)
    : null;
}

// Transforms keys from the default prop values into prop values.
//
// Behaviour with props: The return value from this function is *always* merged
// with, and overridden by, props.
//
// Behaviour with state: The return value overrides state on the initial render.
// On subsequent renders state overrides the defaults. This is to do the same
// thing as the following, which only works on initial render, and after that
// state values take over because of setState() possibly being called.
//
// ```
// state = {
//   value: props.defaultValue || 'default state'
// }
// ```
export function mapDefaultPropsToProps<A: {}, B: {}>(
  props: A,
  state: B
): { ...$Exact<A> } {
  return Object.keys(props).reduce((prev, next) => {
    const name = getPropNameFromDefaultPropName(next);
    if (name) {
      prev[name] = props[next];
    }
    return prev;
  }, {});
}

// Returns the props that should be merged with state.
export function mapPropsToState<A: {}, B: {}>(
  props: A,
  state: B
): { ...$Exact<A>, ...$Exact<B> } {
  return assign(state, props);
}

type Props<P: {}, S: {}, V: {}, Z: {}> = {
  children: (mapped: Z) => Node,
  data: { props: P, state: S },
  mapDefaultPropsToProps: (props: P, state: S) => V,
  mapPropsToState: (props: P, state: S) => Z
};

type State = {};

export default class<P: {}, S: {}, V: {}, Z: {}> extends Component<
  Props<P, S, V, Z>,
  State
> {
  static defaultProps = {
    mapDefaultPropsToProps,
    mapPropsToState
  };
  __initialState: V;
  __isInitiallyRendered: boolean = false;
  constructor(props: Props<P, S, V, Z>) {
    super(props);
    const { data } = props;
    this.__initialState = this.props.mapDefaultPropsToProps(
      data.props,
      data.state
    );
  }
  render() {
    let { props, state } = this.props.data;

    if (this.__isInitiallyRendered) {
      state = assign(this.__initialState, state);
    } else {
      state = assign(state, this.__initialState);
      this.__isInitiallyRendered = true;
    }

    return this.props.children(
      assign(state, this.props.mapPropsToState(props, state))
    );
  }
}
