<template>
  <div class="home">
    <MyIpsTable />
  </div>
</template>

<script>
import MyIpsTable from "../components/MyIpsTable.vue";
export default {
  name: "Home",
  components: {
    MyIpsTable
  }
};
</script>
