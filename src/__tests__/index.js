// @flow

import { mount } from "enzyme";
import React, { Component, Fragment } from "react";
import withCtrl from "..";

const { expect, test } = global;

const Comp = withCtrl(
  class extends Component<any, { prop: string }> {
    constructor(props) {
      super(props);
      this.state = {
        prop: props.prop || ""
      };
    }
    render() {
      return <div>{this.state.prop}</div>;
    }
  }
);

test("overides state with props", () => {
  const wrapper = mount(<Comp prop="test" />);
  expect(wrapper.text()).toBe("test");
});
