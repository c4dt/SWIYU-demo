<template>
  <section class="bg-white py-24 sm:py-8">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <header class="mx-auto max-w-2xl text-center">
        <h1 class="text-base leading-7 font-semibold text-indigo-600">
          E-ID Demo
        </h1>
        <p
          class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
        >
          A demo app portraying the process of Verifiable Credential exchange
        </p>
        <p class="mt-6 text-lg leading-8 text-gray-600">
          The demo includes a simple issuer and verifier built for the SWIYU
          project, part of the Swiss E-ID initiative by FOITT.
        </p>
      </header>

      <dl
        class="mx-auto mt-16 grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 sm:mt-20 lg:mt-24 lg:max-w-4xl lg:grid-cols-2 lg:gap-y-16"
      >
        <div v-for="f in features" :key="f.name" class="relative pl-16">
          <dt class="leading-7 font-semibold text-gray-900">
            <div
              class="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 transition-transform motion-safe:hover:scale-105"
            >
              <component
                :is="f.icon"
                class="h-6 w-6 text-white"
                aria-hidden="true"
              />
            </div>
            <NuxtLink
              :to="f.url"
              class="transition-colors outline-none hover:text-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              {{ f.name }}
            </NuxtLink>
          </dt>

          <dd class="mt-2 leading-7 text-gray-600">
            {{ f.description }}
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>
<script setup lang="ts">
  import {
    ArrowPathIcon,
    CloudArrowUpIcon,
    FingerPrintIcon,
    LockClosedIcon,
  } from '@heroicons/vue/24/outline';

  type ExternalUrl = `http${'s' | ''}://${string}`;
  type InternalUrl = `/${string}`;

  interface Feature {
    readonly name: string;
    readonly description: string;
    readonly url: ExternalUrl | InternalUrl;
    readonly icon: Component;
  }

  const features = [
    {
      name: 'Issuer',
      description: `An actor that issues credentials in a standard format and signs them.
       In this demo the issuer is C4DT. Public key + schemas live on-ledger.`,
      icon: CloudArrowUpIcon,
      url: '/issuer',
    },
    {
      name: 'Base & Trust Registries',
      description: `Stores public keys / DIDs and revocation registries.
       The trust registry certifies actor authenticity.`,
      icon: LockClosedIcon,
      url: 'https://swiyu-admin-ch.github.io/introduction/#registries',
    },
    {
      name: 'Wallet',
      description: `User application that stores and presents credentials.
       In this demo the wallet holds the student’s diplomas.`,
      icon: ArrowPathIcon,
      url: 'https://swiyu-admin-ch.github.io/open-source-components/#swiyu-android--ios-app',
    },
    {
      name: 'Verifier',
      description:
        'Actor that verifies credentials by connecting to the wallet, issuers, and the public registries.',
      icon: FingerPrintIcon,
      url: '/verifier',
    },
  ] as const satisfies ReadonlyArray<Feature>;

  definePageMeta({ title: 'E-ID Demo' });
  useSeoMeta({
    title: 'E-ID Demo',
    description:
      'A simple app portraying the process of Verifiable Credential exchange.',
  });
</script>
