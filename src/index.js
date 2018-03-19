// @flow
import { Component, type ComponentType } from "react";

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

type Props = {
  children: Function,
  component: Object,
  mapDefaultPropsToProps: Object => Object,
  mapPropsToState: (Object, Object) => Object
};

type State = {};

export default class extends Component<Props, State> {
  static defaultProps = {
    mapDefaultPropsToProps,
    mapPropsToState
  };
  initialState: Object = {};
  isInitiallyRendered: boolean = false;
  constructor(props: Props) {
    super(props);
    const { component } = props;
    const mappedDefaultProps = this.props.mapDefaultPropsToProps(
      component.props
    );
    const mappedProps = this.props.mapPropsToState(
      mappedDefaultProps,
      component.state
    );
    this.initialState = assign(component.state, mappedProps);
  }
  render() {
    let { props, state = {} } = this.props.component;

    if (this.isInitiallyRendered) {
      state = assign(this.initialState, state);
    } else {
      state = assign(state, this.initialState);
      this.isInitiallyRendered = true;
    }

    return this.props.children(
      assign(state, this.props.mapPropsToState(props, state))
    );
  }
}
