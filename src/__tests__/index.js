// @flow

import map, {
  getStateNameFromDefaultPropName,
  mapper,
  mapDefaultPropsToState,
  mapPropsToState
} from "..";

const { expect, test } = global;

type Props = {
  defaultProp: string
};

type State = {
  prop: string
};

test("getStateNameFromDefaultPropName", () => {
  expect(getStateNameFromDefaultPropName("def")).toBe(null);
  expect(getStateNameFromDefaultPropName("default")).toBe(null);
  expect(getStateNameFromDefaultPropName("defaultP")).toBe("p");
  expect(getStateNameFromDefaultPropName("defaultPropName")).toBe("propName");
});

test("mapDefaultPropsToState", () => {
  expect(
    mapDefaultPropsToState({
      def: 1,
      default: 2,
      defaultP: 3,
      defaultPropName: 4
    })
  ).toMatchObject({
    p: 3,
    propName: 4
  });
});

test("mapPropsToState", () => {
  expect(
    mapPropsToState(
      {
        prop: true,
        shouldNotBeInState: false
      },
      {
        prop: false,
        state: true
      }
    )
  ).toMatchObject({
    prop: true,
    state: true
  });
});

test("map", () => {
  expect(
    map({
      props: {
        defaultProp: "props.defaultProp",
        defaultState: "props.defaultState",
        prop: "props.prop",
        shouldNotBeInState: "props.shouldNotBeInState"
      },
      state: {
        prop: "state.prop",
        state: "state.state"
      }
    })
  ).toMatchObject({
    prop: "props.prop",
    state: "props.defaultState"
  });
});

test("mapper", () => {
  const customMap = mapper({
    mapDefaultPropsToState() {
      return { defaultProp: true };
    },
    mapPropsToState() {
      return { prop: true };
    }
  });
  expect(customMap({})).toMatchObject({
    defaultProp: true,
    prop: true
  });
});

test("sanity", () => {
  map({});
  mapper()({});
});
