<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import axios from "axios";
import type { MyIpRecord } from "@/types/myIpRecord";
import type { IpGeoRecord } from "@/types/ipGeoRecord";
import RecordDetails from "./RecordDetails.vue";
import { displayedClientLocation } from "@/utils/display";

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
    url: "https://my-ip-ip-kcobqzfkvk.cn-hangzhou.fcapp.run/myip",
  },
];

export default defineComponent({
  components: {
    RecordDetails,
  },

  setup() {
    const myIpRecords = reactive<MyIpRecord[]>([]);
    const ipGeoDict = reactive<Record<string, IpGeoRecord | null>>({});
    const ipToShowDetails = ref<string | null>(null);

    // get IP and geo info from APIs
    myipApis.map(({ serverName, url }) =>
      axios
        .get(url)
        .then(({ data: { clientIp } }) => {
          if (clientIp) {
            myIpRecords.push({
              serverName,
              clientIp,
            });
            console.log(51, serverName, "finished", Object.keys(ipGeoDict));

            if (clientIp in ipGeoDict) {
              // already exists, finish
              return;
            }
            // get IP geo info
            // set placeholder first so this won't be duplicately called
            ipGeoDict[clientIp] = null;
            axios
              .get(`https://ip.myles.hk/geo/${clientIp}`)
              .then(({ data }) => {
                if (data.status === "success") {
                  ipGeoDict[clientIp] = data;
                }
              })
              .catch((error) => {
                console.error(`Error geo info for IP ${clientIp}`, error);
              });
          }
        })
        .catch((error) => {
          // display and error and continue
          console.error(`Error getting my IP from ${serverName}`, error);
        })
    );

    return {
      myIpRecords,
      ipGeoDict,
      ipToShowDetails,
      displayedClientLocation,
    };
  },

  methods: {
    async showRecordDetails(myIpRecord: MyIpRecord) {
      this.ipToShowDetails = myIpRecord.clientIp;
    },
    hideRecordDetails() {
      this.ipToShowDetails = null;
    },
  },

  computed: {
    geoRecordToShowDetails(): IpGeoRecord | null {
      return this.ipToShowDetails ? this.ipGeoDict[this.ipToShowDetails] : null;
    },
  },
});
</script>

<template>
  <div>
    <h4>Your IP viewed from different locations</h4>

    <RecordDetails
      v-if="ipToShowDetails && geoRecordToShowDetails"
      :ip="ipToShowDetails"
      :geo-record="geoRecordToShowDetails"
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
        <tr v-for="(myIpRecord, index) of myIpRecords" :key="index">
          <td>{{ myIpRecord.serverName }}</td>
          <td>
            {{ myIpRecord.clientIp }}
          </td>
          <td>
            <a href="#" @click="showRecordDetails(myIpRecord)">
              {{
                ipGeoDict[myIpRecord.clientIp] && displayedClientLocation(ipGeoDict[myIpRecord.clientIp]!)
              }}
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
