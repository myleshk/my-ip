<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { IpGeoRecord } from "@/types/ipGeoRecord";

export default defineComponent({
  props: {
    ip: {
      type: String,
      required: true,
    },
    geoRecord: {
      type: Object as PropType<IpGeoRecord>,
      required: true,
    },
  },
  computed: {
    extraDetailsToShow() {
      if (!this.geoRecord) return [];

      const extraDetailsToShow: [string, string | number][] = [];
      for (const [key, name] of [
        ["zip", "Zip"],
        ["isp", "ISP"],
        ["org", "Org"],
        ["as", "ASN"],
      ]) {
        const val = this.geoRecord[key as keyof IpGeoRecord];
        extraDetailsToShow.push([name, val]);
      }

      return extraDetailsToShow.filter(([, val]) => val);
    },
  },
});
</script>

<template>
  <div class="details">
    <div class="d-flex justify-content-between">
      <div class="title flex-grow-1">{{ ip }}</div>
      <a
        href="#"
        class="close-button text-decoration-none"
        @click="$emit('close')"
      >
        Close
      </a>
    </div>
    <div class="row no-gutters body">
      <div class="col-12 col-md-6 row">
        <div class="col col-3 key">Location</div>
        <div class="col col-9 value">
          {{ geoRecord.city }}, {{ geoRecord.regionName }},
          {{ geoRecord.country }}
        </div>
      </div>
      <div class="col-12 col-md-6 row">
        <div class="col col-3 key">Lat/Long</div>
        <div class="col col-9 value">
          <a
            :href="`https://maps.google.com/?q=${geoRecord.lat},${geoRecord.lon}`"
            target="_blank"
            class="google-map-link"
          >
            {{ geoRecord.lat }}, {{ geoRecord.lon }}
          </a>
        </div>
      </div>
      <div
        v-for="(detail, index) in extraDetailsToShow"
        :key="index"
        class="col-12 col-md-6 row"
      >
        <div class="col col-3 key">{{ detail[0] }}</div>
        <div class="col col-9 value">{{ detail[1] }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.details {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 0.5rem 0.5rem 0 0;
  overflow: hidden;
}
.title {
  font-weight: 800;
  font-size: 14pt;
  background-color: #555;
  color: #fff;
  padding: 0.5rem 1rem;
}
.close-button {
  font-weight: 800;
  font-size: 14pt;
  background-color: #555;
  color: #fff;
  border-radius: 0 0.5rem 0 0;
  padding: 0.5rem 1rem;
}
.close-button:hover {
  background-color: #eee;
  color: #555;
}
.body {
  padding: 0.5rem 1rem;
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
</style>
