import { beforeEach, describe, expect, it, vi } from "vitest";

import { flushPromises, mount } from "@vue/test-utils";
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
    expect(rows).toHaveLength(6);
    expect(rows.some((row) => row.text().includes("UK"))).toBe(false);
    expect(wrapper.text()).toContain("Loading...");
    expect(wrapper.text()).toContain("HK");
    expect(wrapper.text()).toContain("US");
    expect(wrapper.text()).toContain("OpenAI");
    expect(wrapper.text()).toContain("Claude");
  });

  it("reads service trace IPs and reuses their geo lookup", async () => {
    mockedAxiosGet.mockImplementation((url) => {
      if (String(url).endsWith("/cdn-cgi/trace")) {
        return Promise.resolve({ data: "fl=abc\nip=203.0.113.7\nloc=US\n" });
      }
      if (String(url).includes("/geo/")) {
        return Promise.resolve({ data: { status: "success", country: "US" } });
      }
      return new Promise(() => {});
    });
    const wrapper = mount(MyIpsTable);
    await flushPromises();
    const rows = wrapper.findAll("tbody tr");
    expect(rows[4].text()).toContain("203.0.113.7");
    expect(rows[5].text()).toContain("203.0.113.7");
    expect(mockedAxiosGet.mock.calls.filter(([url]) => String(url).includes("/geo/"))).toHaveLength(1);
  });

  it("does not treat a challenge page as a service IP", async () => {
    mockedAxiosGet.mockResolvedValue({ data: "<html>Challenge</html>" });
    const wrapper = mount(MyIpsTable);
    await flushPromises();
    for (const row of wrapper.findAll("tbody tr").slice(4)) {
      expect(row.text()).toContain("API error");
      expect(row.find("code").exists()).toBe(false);
    }
  });
});
