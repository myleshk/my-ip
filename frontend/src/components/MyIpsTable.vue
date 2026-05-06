<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import axios from "axios";
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

type RequestStatus = "loading" | "success" | "error";

interface MyIpTableRow {
  serverName: string;
  serverFlag: string;
  url: string;
  clientIp: string;
  myIpStatus: RequestStatus;
  geoStatus: RequestStatus;
}

type IpGeoCacheValue = IpGeoRecord | Promise<IpGeoRecord> | null;

export default defineComponent({
  components: {
    RecordDetails,
  },

  setup() {
    const serverFlagByName: Record<string, string> = {
      HK: "🇭🇰",
      JP: "🇯🇵",
      UK: "🇬🇧",
      US: "🇺🇸",
      CN: "🇨🇳",
    };

    const rows = reactive<MyIpTableRow[]>(
      myipApis.map(({ serverName, url }) => ({
        serverName,
        serverFlag: serverFlagByName[serverName] ?? "🌐",
        url,
        clientIp: "",
        myIpStatus: "loading",
        geoStatus: "loading",
      })),
    );
    const ipGeoDict = reactive<Record<string, IpGeoCacheValue>>({});
    const ipToShowDetails = ref<string | null>(null);

    const isGeoRecord = (
      value: IpGeoCacheValue | undefined,
    ): value is IpGeoRecord =>
      !!value && typeof (value as IpGeoRecord).status === "string";

    const getGeoRecord = (ip: string): IpGeoRecord | null => {
      const value = ipGeoDict[ip];
      return isGeoRecord(value) ? value : null;
    };

    rows.forEach((row) =>
      axios
        .get(row.url)
        .then(({ data }) => {
          const { clientIp } = data;
          if (clientIp) {
            row.clientIp = clientIp;
            row.myIpStatus = "success";

            // /myip now includes geo fields; use it first.
            if (data.status === "success") {
              ipGeoDict[clientIp] = data;
              row.geoStatus = "success";
              return;
            }

            row.geoStatus = "loading";
            const cachedGeoValue = ipGeoDict[clientIp];
            if (isGeoRecord(cachedGeoValue)) {
              row.geoStatus = "success";
              return;
            }

            // Reuse ipGeoDict as cache for both in-flight and completed geo lookups.
            if (!(clientIp in ipGeoDict) || cachedGeoValue === null) {
              ipGeoDict[clientIp] = axios
                .get(`https://ip.myles.hk/geo/${clientIp}`)
                .then(({ data: geoData }) => {
                  if (geoData.status === "success") {
                    ipGeoDict[clientIp] = geoData;
                    return geoData;
                  }
                  throw new Error("Geo API returned non-success status");
                })
                .catch((error) => {
                  delete ipGeoDict[clientIp];
                  throw error;
                });
            }

            const geoRequest = ipGeoDict[clientIp];
            if (
              geoRequest &&
              typeof (geoRequest as Promise<IpGeoRecord>).then === "function"
            ) {
              (geoRequest as Promise<IpGeoRecord>)
                .then((geoData) => {
                  ipGeoDict[clientIp] = geoData;
                  row.geoStatus = "success";
                })
                .catch((error) => {
                  row.geoStatus = "error";
                  console.error(`Error geo info for IP ${clientIp}`, error);
                });
            }
          } else {
            row.myIpStatus = "error";
            row.geoStatus = "error";
          }
        })
        .catch((error) => {
          row.myIpStatus = "error";
          row.geoStatus = "error";
          console.error(`Error getting my IP from ${row.serverName}`, error);
        }),
    );

    return {
      rows,
      ipGeoDict,
      ipToShowDetails,
      displayedClientLocation,
      getGeoRecord,
    };
  },

  methods: {
    async showRecordDetails(clientIp: string) {
      this.ipToShowDetails = clientIp;
    },
    hideRecordDetails() {
      this.ipToShowDetails = null;
    },
  },

  computed: {
    geoRecordToShowDetails(): IpGeoRecord | null {
      return this.ipToShowDetails
        ? this.getGeoRecord(this.ipToShowDetails)
        : null;
    },
  },
});
</script>

<template>
  <section class="myips-table-section">
    <div class="table-header">
      <h4>Your IP viewed from different locations</h4>
      <p class="table-subtitle">
        Each row stays visible while requests load; errors are shown per server.
      </p>
    </div>

    <RecordDetails
      v-if="ipToShowDetails && geoRecordToShowDetails"
      :ip="ipToShowDetails"
      :geo-record="geoRecordToShowDetails"
      @close="hideRecordDetails"
    />

    <div class="table-responsive">
      <table class="table table-striped align-middle">
        <thead class="thead-light">
          <tr>
            <th>Server Location</th>
            <th>Your IP</th>
            <th>Your IP Location</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.serverName">
            <td>
              <span class="server-location">
                <span class="server-flag">{{ row.serverFlag }}</span>
                <span>{{ row.serverName }}</span>
              </span>
            </td>
            <td>
              <template v-if="row.myIpStatus === 'loading'">
                <span class="status-inline">
                  <span class="loading-dot" aria-hidden="true"></span>
                  <span>Loading...</span>
                </span>
              </template>
              <template v-else-if="row.myIpStatus === 'error'">
                <span class="status-inline error-status">⚠ API error</span>
              </template>
              <template v-else>
                <code class="ip-code">{{ row.clientIp }}</code>
              </template>
            </td>
            <td>
              <template v-if="row.geoStatus === 'loading'">
                <span class="status-inline">
                  <span class="loading-dot" aria-hidden="true"></span>
                  <span>Loading...</span>
                </span>
              </template>
              <template v-else-if="row.geoStatus === 'error'">
                <span class="status-inline error-status">⚠ API error</span>
              </template>
              <template v-else>
                <a href="#" @click.prevent="showRecordDetails(row.clientIp)">
                  {{ displayedClientLocation(getGeoRecord(row.clientIp)!) }}
                </a>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.myips-table-section {
  width: 100%;
}

.table-header {
  margin-bottom: 0.75rem;
}

.table-subtitle {
  margin: 0;
  color: #6c757d;
  font-size: 0.925rem;
}

table th,
table td {
  text-align: center;
}

table td {
  vertical-align: middle;
}

.server-location {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-weight: 600;
}

.server-flag {
  font-size: 1.1rem;
  line-height: 1;
}

.status-inline {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #495057;
  font-size: 0.95rem;
}

.error-status {
  color: #c92a2a;
  font-weight: 600;
}

.loading-dot {
  width: 0.9rem;
  height: 0.9rem;
  border: 2px solid #ced4da;
  border-top-color: #0d6efd;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.75s linear infinite;
}

.ip-code {
  white-space: nowrap;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  table th,
  table td {
    padding: 0.55rem 0.45rem;
    font-size: 0.92rem;
  }

  .table-subtitle {
    font-size: 0.86rem;
  }
}
</style>
