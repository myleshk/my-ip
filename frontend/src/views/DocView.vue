<script setup lang="ts">
import { marked } from "marked";
import docMarkdown from "../assets/doc.md?raw";

const docHtml = marked.parse(docMarkdown);
</script>

<template>
  <section v-html="docHtml"></section>
</template>
