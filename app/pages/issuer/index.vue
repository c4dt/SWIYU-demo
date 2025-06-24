<template>
  <div class="relative sm:px-6 lg:py-16">
    <div class="mx-auto max-w-xl text-center">
      <div class="mx-auto inline-flex rounded-full px-4 py-1.5">
        <p class="text-g text-4xl font-semibold tracking-widest">
          C4DT Hands-on Workshop HR system
        </p>
      </div>
      <p
        class="mt-4 text-base leading-relaxed text-gray-600 group-hover:text-white"
      >
        This platform provides different activities for C4DT Hands-on Workshop.
      </p>
    </div>
    <div class="mt-12 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:mt-20">
      <nuxt-link
        v-for="page in pages"
        :key="page.title"
        :href="page.url"
        class="group relative z-40 m-2 bg-white p-4 transition-all duration-1000 hover:bg-blue-500 hover:shadow-xl"
      >
        <div
          class="absolute top-0 left-0 z-30 h-1 w-24 bg-blue-500/50 transition-all duration-200 group-hover:w-1/2 group-hover:bg-white"
        />
        <div class="relative px-9 py-2">
          <h3
            class="mt-8 text-lg font-semibold text-black group-hover:text-white"
          >
            {{ page.title }}
          </h3>
          <p class="mt-4 text-base text-gray-600 group-hover:text-white">
            {{ page.description }}
          </p>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ layout: 'c4dt' });
  const pages = ref([
    {
      title: 'C4DT Hands-On Workshop on E-ID',
      url: '/issuer/from-identity/verify',
      description: 'Issues credentials for the C4DT hands-on workshop.',
    },
    {
      title: 'Certificate Issuance',
      url: '/issuer/certification',
      description:
        'Issue certificates upon request by students.\n' +
        'These certificates can be verified by third parties.',
    },
  ]);
</script>
