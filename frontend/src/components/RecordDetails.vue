<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { IpRecord } from "@/types/ipRecord";
import { startCase } from "lodash";

export default defineComponent({
  props: {
    record: {
      type: Object as PropType<IpRecord>,
      required: true,
    },
  },
  computed: {
    detailsToShow() {
      const geo = this.record.geo;
      if (!geo) return [];

      const detailsToShow: [string, string][] = [];
      for (const key of [
        "country",
        "regionName",
        "city",
        "lat",
        "lon",
        "isp",
        "org",
        "as",
      ]) {
        const val = geo[key as keyof IpRecord["geo"]];
        detailsToShow.push([startCase(key), val]);
      }
      return detailsToShow;
    },
  },
});
</script>

<template>
  <div class="details">
    <div class="row">
      <div
        v-for="(detail, index) in detailsToShow"
        :key="index"
        class="col-12 col-md-6 row"
      >
        <div class="col col-3 key">{{ detail[0] }}</div>
        <div class="col col-9 value">{{ detail[1] }}</div>
      </div>
    </div>
  </div>
  <a class="btn btn-secondary btn-sm close-button" @click="$emit('close')"
    >Close</a
  >
</template>

<style scoped>
.details {
  background-color: #eee;
  border: 1px solid #aaa;
  border-radius: 0.3rem;
  padding: 1rem;
  position: absolute;
  left: 0.5rem;
  right: 0.5rem;
}
.key,
.value {
  font-size: 12pt;
}
.key {
  color: #555;
  font-weight: 600;
}
.value {
  font-weight: 200;
}
.close-button {
  position: absolute;
  right: 1.5rem;
  margin-top: 0.5rem;
}
</style>
