<template>
  <section class="bg-white py-24 sm:py-8">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <header class="mx-auto max-w-2xl lg:text-center">
        <h1 class="text-base font-semibold leading-7 text-indigo-600">
          E-ID Demo
        </h1>
        <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          A demo app portraying the process of Verifiable Credential exchange
        </p>
        <p class="mt-6 text-lg leading-8 text-gray-600">
          The demo includes simple issuer and verifier developed specifically for the
          SWIYU project, which is a part of the E-ID initiative by the Swiss Federal Office of Information Technology,
          Systems and Telecommunication (FOITT).
        </p>
      </header>

      <dl
        class="mx-auto mt-16 grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 sm:mt-20 lg:mt-24 lg:max-w-4xl lg:grid-cols-2 lg:gap-y-16">
        <div v-for="feature in features" :key="feature.name" class="relative pl-16">
          <dt class="font-semibold leading-7 text-gray-900">
            <div class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
              <component :is="feature.icon" class="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <NuxtLink :to="feature.url" class="hover:text-indigo-600 transition-colors">
              {{ feature.name }}
            </NuxtLink>
          </dt>
          <dd class="mt-2 leading-7 text-gray-600">
            {{ feature.description }}
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>
<script setup>
import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  FingerPrintIcon,
  LockClosedIcon,
} from "@heroicons/vue/24/outline";

useHead({
  title: "E-ID Demo",
  meta: [
    {
      name: "description",
      content:
        "A simple app portraying the process of Verifiable Credential exchange.",
    },
  ],
});
const features = [
  {
    name: "Issuer",
    description:
      "An actor that issues the credentials by sharing them in a standard format" +
      " signing them. In our example, the issuer is C4DT." +
      "The public key and the schemas used by the issuer are stored on the ledger.",
    icon: CloudArrowUpIcon,
    url: "/issuer",
  },
  {
    name: "Base & Trust Registries",
    description:
      "Reposible for storing the public keys/ DIDs of the actors, and revocation registries." +
      "The trust registry is responsible for certifying the authenticity of the actors.",
    icon: LockClosedIcon,
    url: "https://swiyu-admin-ch.github.io/introduction/#registries",
  },
  {
    name: "Wallet",
    description:
      "The wallet is an application installed by the user which stores their credentials." +
      "It also prepares the credentials and presents them to the verifier." +
      "In our example, the wallet holds the diplomas of the student.",
    icon: ArrowPathIcon,
    url: "https://swiyu-admin-ch.github.io/open-source-components/#swiyu-android--ios-app",
  },
  {
    name: "Verifier",
    description:
      "An actor that verifies credentials. In our example, the verifier is Leo Inc.",
    icon: FingerPrintIcon,
    url: "/verifier",
  },
];
</script>
