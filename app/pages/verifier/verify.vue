<script setup lang="ts">
import { useHead } from "nuxt/app";

definePageMeta({ layout: "leo-inc" });
useHead({
  title: "Leo Inc. HR - Verify",
  meta: [
    {
      name: "description",
      content:
        "Verifies the authenticity of the credentials of the applicants.",
    },
  ],
});
</script>

<template>
  <NotImplemented homePageURL="/verifier" />
</template>
