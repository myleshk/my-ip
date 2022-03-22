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
    const myipApis = [
      {
        serverName: "HK",
        url: "https://asia-east2-myip-21bb8.cloudfunctions.net/hk/myip",
      },
      {
        serverName: "JP",
        url: "https://asia-northeast1-myip-21bb8.cloudfunctions.net/jp/myip",
      },
      {
        serverName: "UK",
        url: "https://europe-west2-myip-21bb8.cloudfunctions.net/uk/myip",
      },
      {
        serverName: "US",
        url: "https://us-central1-myip-21bb8.cloudfunctions.net/us/myip",
      },
      {
        serverName: "CN",
        url: "https://service-ph5xxk5m-1251959541.gz.apigw.tencentcs.com/test/myip",
      },
    ];

    const records: Ref<IpRecord[]> = ref([]);

    // get IP and geo info from APIs
    Promise.all(
      myipApis.map(({ serverName, url }) =>
        axios
          .get(url)
          .then(({ data: { clientIp } }) => {
            if (clientIp) {
              records.value.push({
                serverName,
                clientIp,
              });
            }
            return (clientIp ?? "") as string;
          })
          .catch((error) => {
            // display and error and continue
            console.error(`Error getting my IP from ${serverName}`, error);
          })
      )
    ).then((clientIps) => {
      new Set(clientIps).forEach((clientIp) => {
        axios
          .get(`https://ip.myles.hk/geo/${clientIp}`)
          .then(({ data }) => {
            if (data.status === "success") {
              records.value = records.value.map((record) =>
                record.clientIp === clientIp ? { ...record, geo: data } : record
              );
            }
          })
          .catch((error) => {
            console.error(`Error geo info for IP ${clientIp}`, error);
          });
      });
    });

    return {
      records,
      displayedClientLocation,
    };
  },

  methods: {
    async showRecordDetails(record: IpRecord) {
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
    <h4>Your IP viewed from different locations</h4>

    <RecordDetails
      v-if="recordToShowDetails"
      :record="recordToShowDetails"
      @close="hideRecordDetails"
    />

    <table class="table table-striped">
      <thead class="thead-light">
        <tr>
          <th>Server Location</th>
          <th>Your IP</th>
          <th>Your IP Location</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, recordIndex) of records" :key="recordIndex">
          <td>{{ record.serverName }}</td>
          <td>
            {{ record.clientIp }}
          </td>
          <td>
            <a href="#" @click="showRecordDetails(record)">
              {{ displayedClientLocation(record.geo) }}
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table th,
table td {
  text-align: center;
}
table td {
  vertical-align: middle;
}
</style>
