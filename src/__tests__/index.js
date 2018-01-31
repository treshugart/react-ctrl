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

test("pulls the default state value from defaultProps", () => {
  const wrapper = mount(<Comp />);
  expect(wrapper.text()).toBe("default");
});

test("overides default props with props", () => {
  const wrapper = mount(<Comp prop="test" />);
  expect(wrapper.text()).toBe("test");
});
