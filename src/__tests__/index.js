// @flow

import { mount } from "enzyme";
import React, { Component, Fragment } from "react";
import Ctrl, {
  getPropNameFromDefaultPropName,
  mapDefaultPropsToProps,
  mapPropsToState
} from "..";

const { expect, test } = global;

test("getStateNameFromDefaultPropName", () => {
  expect(getPropNameFromDefaultPropName("def")).toBe(null);
  expect(getPropNameFromDefaultPropName("default")).toBe(null);
  expect(getPropNameFromDefaultPropName("defaultP")).toBe("p");
  expect(getPropNameFromDefaultPropName("defaultPropName")).toBe("propName");
});

test("mapDefaultPropsToProps", () => {
  expect(
    mapDefaultPropsToProps(
      {
        def: 1,
        default: 2,
        defaultP: 3,
        defaultPropName: 4
      },
      {}
    )
  ).toEqual({
    p: 3,
    propName: 4
  });
});

test("mapPropsToState", () => {
  const props = { prop: true, notState: false };
  const state = { prop: false, state: true };
  expect(mapPropsToState(props, state)).toEqual({
    notState: false,
    prop: true,
    state: true
  });
});

test("withCtrl", () => {
  type Props = {
    defaultValue?: string,
    value?: string
  };
  type State = {
    value: string
  };
  class Comp extends Component<Props, State> {
    state = {
      value: "state"
    };
    render() {
      return (
        <Ctrl data={this}>{state => <Fragment>{state.value}</Fragment>}</Ctrl>
      );
    }
  }

  const comp1 = mount(<Comp />);
  const comp2 = mount(<Comp defaultValue="default" />);
  const comp3 = mount(<Comp value="prop" />);

  expect(comp1.text()).toEqual("state");
  expect(comp2.text()).toEqual("default");
  expect(comp3.text()).toEqual("prop");
});

test("customWithCtrl", () => {
  type Props = {
    defaultValue?: string,
    value?: string
  };
  type State = {
    value1: string,
    value2: string
  };

  function mapPropsToState(props: Props, state: State) {
    const merged = { ...state, ...props };
    const [value1, value2] = merged.value.split(" ");
    return { value1, value2 };
  }

  class Comp extends Component<Props, State> {
    state = {
      value1: "state1",
      value2: "state2"
    };
    render() {
      return (
        <Ctrl data={this} mapPropsToState={mapPropsToState}>
          {mapped => <Fragment>{`${mapped.value1}:${mapped.value2}`}</Fragment>}
        </Ctrl>
      );
    }
  }

  const comp1 = mount(<Comp />);
  const comp2 = mount(<Comp defaultValue="default1 default2" />);
  const comp3 = mount(<Comp value="prop1 prop2" />);

  expect(comp1.text()).toEqual("state1:state2");
  expect(comp2.text()).toEqual("default1:default2");
  expect(comp3.text()).toEqual("prop1:prop2");
});

test("initial render vs subsequent renders", () => {
  type Props = {
    defaultValue?: string,
    value?: string
  };
  type State = {
    value: string
  };
  class Comp extends Component<Props, State> {
    state = {
      value: "state"
    };
    render() {
      return (
        <Ctrl data={this}>{mapped => <Fragment>{mapped.value}</Fragment>}</Ctrl>
      );
    }
  }

  const comp1 = mount(<Comp defaultValue="default" />);

  // Initial render should show default value.
  expect(comp1.text()).toEqual("default");

  // Subsequent renders will show the state value.
  comp1.setState({ value: "state" });
  expect(comp1.text()).toEqual("state");
});

test("flow", () => {
  type Props = {
    defaultValue?: string,
    value?: string
  };
  type State = {
    value: string
  };
  class Comp extends Component<Props, State> {
    state = {
      value: "state"
    };
    render() {
      return (
        <Ctrl data={this}>
          {mapped => (
            <Fragment>
              {mapped.defaultValue}
              {mapped.value}
            </Fragment>
          )}
        </Ctrl>
      );
    }
  }
});
