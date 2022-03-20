import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import MyIpsTable from "../MyIpsTable.vue";

describe("MyIpsTable", () => {
  it("renders properly", () => {
    const wrapper = mount(MyIpsTable, { props: { msg: "Hello Vitest" } });
    expect(wrapper).toMatchSnapshot();
  });
});
