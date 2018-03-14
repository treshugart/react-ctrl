// @flow

type Options = {
  mapDefaultPropsToProps: Object => Object,
  mapPropsToState: (Object, Object) => Object,
  /* If not null, restricts only props in whitelist to be mapped to state.
     Note that only state names need to be passed in, not default prop names. */
  propsWhitelist: string[] | null
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

// Filter props to only those in whitelist
function filterProps(props: Object, whitelist: string[] | null) {
  const obj = {};
  if (whitelist === null) {
    return props;
  }
  whitelist.forEach( name => {
    if (props.hasOwnProperty(name)) {
      obj[name] = props[name];
    }
  });
  return obj;
}

// Formats a default prop name using the React-convention for defaultValue. For
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
  mapPropsToState,
  propsWhitelist: null
};

export default function(Comp: any, opts?: Object): Class<any> {
  const { mapDefaultPropsToState, mapPropsToState, propsWhitelist } = assign(defs, opts);
  class Temp extends Comp {
    __state: Object;
    constructor(props: Object) {
      super(props);

      // Default props only override state on construction, so we map the
      // defaults to their corresponding prop names, using the default values.
      const mappedDefaultProps = mapDefaultPropsToProps(props);

      // Filter the mapped default props based on the props whitelist so only props in the whitelist
      // are mapped to state. This is done after mapping default props so that we don't have to add
      // both props and defaultProps to the props whitelist.
      const filteredDefaultProps = filterProps(mappedDefaultProps, propsWhitelist);

      // When we apply default state, we also want it to be mapped, otherwise
      // you have to put your mapping logic in two spots. This is why we map
      // the defaultProps to props first, then use the mapped result as the
      // props to map to the state.
      const mappedProps = mapPropsToState(filteredDefaultProps, this.__state);

      // The initial mapped state is a result of any existing state merged with
      // the mapped defaultProps / props.
      this.__state = assign(this.__state, mappedProps);
    }
  };

  // Flow complains about getters and setters, so we use defineProperty to get
  // around it.
  Object.defineProperty(Temp.prototype, 'state', ({
    configurable: true,
    get(): Object {
      const { props: allProps, __state } = this;
      const props = filterProps(allProps, propsWhitelist);
      return assign(__state, mapPropsToState(props, __state));
    },
    set(state: Object) {
      this.__state = state;
    }
  }: Object));

  return Temp;
}
