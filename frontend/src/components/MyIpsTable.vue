<template>
  <div>
    <h3>Your IPs viewed from different servers</h3>
    <table class="table table-sm table-bordered">
      <thead>
        <th>Server Location</th>
        <th>Your IP</th>
        <th>Your IP Geolocation</th>
      </thead>
      <tbody>
        <tr v-for="(record, recordIndex) of records" :key="recordIndex">
          <td>{{ record.server.location }}</td>
          <td>{{ record.client.ip }}</td>
          <td>{{ displayedClientLocation(record) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

export default {
  name: "MyIpsTable",
  setup() {
    const locationApis = [
      "https://asia-east2-myip-21bb8.cloudfunctions.net/hk",
      "https://asia-northeast1-myip-21bb8.cloudfunctions.net/jp",
      "https://europe-west1-myip-21bb8.cloudfunctions.net/be",
      "https://europe-west2-myip-21bb8.cloudfunctions.net/uk",
      "https://us-east1-myip-21bb8.cloudfunctions.net/us",
      "https://service-ph5xxk5m-1251959541.gz.apigw.tencentcs.com/test/myip"
    ];

    const records = ref([]);

    for (const locationApi of locationApis) {
      axios.get(locationApi).then(response => {
        records.value.push(response.data);
      });
    }

    return {
      records
    };
  },

  methods: {
    displayedClientLocation(record) {
      return [record.client.city, record.client.country_name]
        .filter(v => v)
        .join(", ");
    }
  }
};
</script>
