// @flow

import { Component } from "react";

// Microbundle doesn't support object spreading.
function assign(...args) {
  const obj = {};
  args.forEach(arg => {
    Object.keys(arg || {}).forEach(key => {
      obj[key] = arg[key];
    });
  });
  return obj;
}

// Formats a defalut prop name using the React-convention
// for defaultValue. For example, defaultValue -> value.
function getStateNameFromDefaultPropName(name: string): string | void {
  const sub = name.substring(0, 7);
  if (sub === "default") {
    return name[7].toLowerCase() + name.substring(8);
  }
}

// Returns a default state object from default props.
function getDefaultProps(comp: any) {
  const { constructor, props } = comp;
  return Object.keys(props).reduce((prev, next) => {
    const stateName = getStateNameFromDefaultPropName(next);
    if (stateName) {
      prev[stateName] = props[next];
    }
    return prev;
  }, {});
}

// This is similar to { ...state, ...props } but it doesn't
// include prop values that aren't in the current state.
function getOverriddenState(comp: any) {
  const { _state, constructor, props } = comp;
  return Object.keys(_state).reduce((prev, next) => {
    prev[next] = next in props ? props[next] : _state[next];
    return prev;
  }, {});
}

export default (Base: any = Component) => {
  // We must declare the class and return it separately.
  // See: https://github.com/developit/microbundle/issues/76.
  class A extends Base {
    _state: Object;

    constructor(props: Object) {
      super(props);
      this._state = assign(this._state, getDefaultProps(this));
    }

    // $FlowFixMe - unsafe getter
    get state(): Object {
      return getOverriddenState(this);
    }

    // $FlowFixMe - unsafe setter
    set state(state: Object): void {
      this._state = state;
    }
  }
  return A;
};
