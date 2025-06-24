<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <a href="/">
                <NuxtImg class="w-60" src="/images/c4dt.svg" alt="C4DT logo" />
              </a>
            </div>
            <div class="ml-10 flex items-baseline space-x-4">
              <NuxtLink
                v-for="item in navigation"
                :key="item.name"
                :to="item.path"
                :class="[
                  isActiveRoute(item.routeName)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'rounded-md px-3 py-2 text-sm font-medium',
                ]"
                :aria-current="
                  isActiveRoute(item.routeName) ? 'page' : undefined
                "
              >
                {{ item.name }}
              </NuxtLink>
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
  interface NavItem {
    name: string;
    path: string;
    routeName: string;
  }

  const route = useRoute();

  const navigation: NavItem[] = [
    { name: 'Home', path: '/', routeName: 'home' },
    {
      name: 'E-ID workshop Certificate',
      path: '/issuer/from-identity/verify',
      routeName: 'issuer-from-identity',
    },
  ];

  const isActiveRoute = (routeName: string): boolean => {
    return route.name.startsWith(routeName);
  };
</script>
