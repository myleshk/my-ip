<script lang="ts">
import { defineComponent, ref } from "vue";
import type { Ref } from "vue";
import axios from "axios";
import type { IpRecord } from "@/types/ipRecord";
import RecordDetails from "./RecordDetails.vue";
import { displayedClientLocation } from "@/utils/display";

export default defineComponent({
  components: {
    RecordDetails,
  },
  setup() {
    const locationApis = [
      "https://asia-east2-myip-21bb8.cloudfunctions.net/hk",
      "https://asia-northeast1-myip-21bb8.cloudfunctions.net/jp",
      "https://europe-west2-myip-21bb8.cloudfunctions.net/uk",
      "https://us-east1-myip-21bb8.cloudfunctions.net/us",
      "https://service-ph5xxk5m-1251959541.gz.apigw.tencentcs.com/test/myip",
    ];

    const records: Ref<IpRecord[]> = ref([]);

    for (const locationApi of locationApis) {
      axios.get(locationApi).then((response) => {
        records.value.push(response.data);
      });
    }

    return {
      records,
      displayedClientLocation,
    };
  },

  methods: {
    showRecordDetails(record: IpRecord) {
      this.recordToShowDetails = record;
    },
    hideRecordDetails() {
      this.recordToShowDetails = null;
    },
  },

  data() {
    return {
      recordToShowDetails: null as IpRecord | null,
    };
  },
});
</script>

<template>
  <div>
    <h3>Your IPs viewed from different servers</h3>

    <RecordDetails
      v-if="recordToShowDetails"
      :record="recordToShowDetails"
      @close="hideRecordDetails"
      class="details"
    />

    <table class="table table-sm table-bordered">
      <thead>
        <th>Server Location</th>
        <th>Your IP</th>
        <th>Your IP Location</th>
        <th>More Details</th>
      </thead>
      <tbody>
        <tr v-for="(record, recordIndex) of records" :key="recordIndex">
          <td>{{ record.serverName }}</td>
          <td>{{ record.clientIp }}</td>
          <td>{{ displayedClientLocation(record.geo) }}</td>
          <td>
            <button class="btn btn-link" @click="showRecordDetails(record)">
              Show
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.details {
  margin-bottom: 1rem;
}

table td {
  vertical-align: middle;
}
</style>
