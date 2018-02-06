// @flow

type Mappable = {
  props?: Object,
  state?: Object
};

type Mapper = Mappable => Object;

type Options = {
  mapDefaultPropsToState?: Object => Object,
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
export function mapDefaultPropsToState(props: Object) {
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
  return Object.keys(state).reduce((prev, next) => {
    prev[next] = next in props ? props[next] : state[next];
    return prev;
  }, {});
}

const defs = {
  mapDefaultPropsToState,
  mapPropsToState
};

export function mapper(opts?: Options): Mapper {
  const { mapDefaultPropsToState, mapPropsToState } = assign(defs, opts);
  return ({ props, state }: Mappable) => {
    const defaults = mapDefaultPropsToState(props || {});
    props = assign(defaults, props);
    state = assign(defaults, state);
    return assign(state, mapPropsToState(props, state));
  };
}

export default mapper();
