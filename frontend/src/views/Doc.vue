<template>
  <pre v-html="docHtml" />
</template>
<script>
import docText from "../assets/doc.md";
import { Converter } from "showdown";

export default {
  name: "Doc",
  components: {},
  data() {
    return {};
  },
  computed: {
    docHtml: {
      get() {
        const converter = new Converter();
        return converter.makeHtml(docText || "");
      }
    }
  }
};
</script>
