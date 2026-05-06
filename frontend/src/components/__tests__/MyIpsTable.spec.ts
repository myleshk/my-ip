import { beforeEach, describe, expect, it, vi } from "vitest";

import { mount } from "@vue/test-utils";
import MyIpsTable from "../MyIpsTable.vue";
import axios from "axios";

vi.mock("axios");

const mockedAxiosGet = vi.mocked(axios.get);

describe("MyIpsTable", () => {
  beforeEach(() => {
    mockedAxiosGet.mockReset();
  });

  it("always shows all server rows and state indicators", async () => {
    mockedAxiosGet.mockImplementation(() => new Promise(() => {}));

    const wrapper = mount(MyIpsTable);
    await wrapper.vm.$nextTick();

    const rows = wrapper.findAll("tbody tr");
    expect(rows).toHaveLength(5);
    expect(wrapper.text()).toContain("Loading...");
    expect(wrapper.text()).toContain("HK");
    expect(wrapper.text()).toContain("US");
  });
});
