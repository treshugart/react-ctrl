// @flow

import map, {
  getStateNameFromDefaultPropName,
  mapper,
  mapDefaultPropsToState,
  mapPropsToState
} from "..";

const { expect, test } = global;

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
  const obj = { test: true };
  expect(mapPropsToState(obj)).not.toBe(obj);
  expect(mapPropsToState(obj)).toMatchObject(obj);
});

test("map", () => {
  expect(
    map({
      props: {
        defaultProp: "props.defaultProp",
        defaultState: "props.defaultState",
        prop: "props.prop",
        shouldBeInMerged: "props.shouldBeInMerged"
      },
      state: {
        prop: "state.prop",
        state: "state.state"
      }
    })
  ).toMatchObject({
    prop: "props.prop",
    state: "props.defaultState",
    shouldBeInMerged: "props.shouldBeInMerged"
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
