// @flow
import { Component } from "react";

type Options = {
  mapDefaultPropsToProps?: Object => Object,
  mapPropsToState?: (Object, Object) => Object
};

// Microbundle doesn't support object spreading.
function assign(...args) {
  const obj = {};
  args.forEach(arg => {
    for (const key in arg) {
      obj[key] = arg[key];
    }
  });
  return obj;
}

// Formats a defalut prop name using the React-convention for defaultValue. For
// example, defaultValue -> value.
export function getStateNameFromDefaultPropName(name: string): string | null {
  return name.length > 7 && name.indexOf("default") === 0
    ? name[7].toLowerCase() + name.substring(8)
    : null;
}

// Maps default props to their state counterparts.
export function mapDefaultPropsToProps(props: Object) {
  return Object.keys(props).reduce((prev, next) => {
    const stateName = getStateNameFromDefaultPropName(next);
    if (stateName) {
      prev[stateName] = props[next];
    }
    return prev;
  }, {});
}

// Maps the current props into a state object that is merged with the current
// state.
export function mapPropsToState(props: Object, state: Object): Object {
  return Object.keys(state).reduce((prev, curr) => {
    prev[curr] = curr in props ? props[curr] : state[curr];
    return prev;
  }, {});
}

// Default HOC options.
const defs: Options = {
  mapDefaultPropsToProps,
  mapPropsToState
};

export default function<Props: {}, State: {}>(
  Comp: Class<Component<Props, State>>,
  opts?: Object
): Class<Component<Props, State>> {
  const { mapDefaultPropsToState, mapPropsToState } = assign(defs, opts);
  class Temp extends Comp {
    __state: State;
    constructor(props: Props) {
      super(props);

      // Default props only override state on construction, so we map the
      // defaults to their corresponding prop names, using the default values.
      const mappedDefaultProps = mapDefaultPropsToProps(props);

      // When we apply default state, we also want it to be mapped, otherwise
      // you have to put your mapping logic in two spots. This is why we map
      // the defaultProps to props first, then use the mapped result as the
      // props to map to the state.
      const mappedProps = mapPropsToState(mappedDefaultProps, this.__state);

      // The initial mapped state is a result of any existing state merged with
      // the mapped defaultProps / props.
      this.__state = ((assign(this.__state, mappedProps): any): State);
    }
  }

  // Flow complains about getters and setters, so we use defineProperty to get
  // around it.
  Object.defineProperty(
    Temp.prototype,
    "state",
    ({
      configurable: true,
      get(): State {
        const { props, __state } = this;
        return ((assign(__state, mapPropsToState(props, __state)): any): State);
      },
      set(state: State) {
        this.__state = state;
      }
    }: Object)
  );

  return Temp;
}
