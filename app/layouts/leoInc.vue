<template>
  <div class="min-h-full bg-gray-100">
    <nav class="bg-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo and Desktop Navigation -->
          <div class="flex items-center">
            <a href="/">
              <NuxtImg
                src="/images/leo_inc_logo.svg"
                alt="Leo Inc Logo"
                class="mt-6 w-60"
              />
            </a>
            <div class="ml-10 flex space-x-4">
              <a
                v-for="item in navigation"
                :key="item.name"
                :href="item.href"
                :class="navItemClass(item.current)"
                :aria-current="item.current ? 'page' : undefined"
              >
                {{ item.name }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router';

  interface NavigationItem {
    name: string;
    href: string;
    current: boolean;
  }
  const route = useRoute();

  const navigation = computed<NavigationItem[]>(() => [
    {
      name: 'Home',
      href: '/',
      current: route.name === 'home',
    },
    {
      name: 'Hiring',
      href: '/verifier/verify',
      current: route.name === 'verifier-verify',
    },
  ]);

  const navItemClass = (isCurrent: boolean) =>
    isCurrent
      ? 'bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium'
      : 'text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium';
</script>
