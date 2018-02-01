// @flow

import { mount } from "enzyme";
import React, { Component, Fragment } from "react";
import withCtrl from "..";

const { expect, test } = global;

type Props = {
  defaultProp: string
};

type State = {
  prop: string
};

test("pulls the default state value from defaultProps", () => {
  const Comp = withCtrl(
    class extends Component<Props, State> {
      static defaultProps = {
        defaultProp: "default"
      };
      render() {
        return <div>{this.state.prop}</div>;
      }
    }
  );
  const wrapper = mount(<Comp />);
  expect(wrapper.text()).toBe("default");
});

test("overides default props with props", () => {
  const Comp = withCtrl(
    class extends Component<Props, State> {
      static defaultProps = {
        defaultProp: "default"
      };
      render() {
        return <div>{this.state.prop}</div>;
      }
    }
  );
  const wrapper = mount(<Comp prop="test" />);
  expect(wrapper.text()).toBe("test");
});

test("user-defined default overrides component-defined default", () => {
  const Comp = withCtrl(
    class extends Component<Props, State> {
      state = {
        prop: "default"
      };
      render() {
        return <div>{this.state.prop}</div>;
      }
    }
  );
  const wrapper = mount(<Comp defaultProp="test" />);
  expect(wrapper.text()).toBe("test");
});
