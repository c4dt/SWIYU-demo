<template>
  <div class="min-h-full bg-gray-100">
    <nav class="bg-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <!-- Logo and Desktop Navigation -->
          <div class="flex items-center">
            <NuxtImg
              src="/images/leo_inc_logo.svg"
              alt="Leo Inc Logo"
              class="w-60 mt-6"
            />
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

          <!-- Notification and Profile -->
          <div class="ml-4 flex items-center space-x-4">
            <!-- Notification Button -->
            <button
              class="relative p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white"
              type="button"
              aria-label="View notifications"
            >
              <BellIcon class="h-6 w-6" aria-hidden="true" />
            </button>

            <!-- Profile Menu -->
            <Menu as="div" class="relative ml-3">
              <MenuButton
                class="relative flex items-center rounded-full bg-gray-800 text-sm"
              >
                <span class="sr-only">Open user menu</span>
                <NuxtImg
                  :src="user.imageUrl"
                  alt=""
                  class="w-12 rounded-full"
                />
              </MenuButton>
              <MenuItems
                class="absolute right-0 z-10 mt-2 w-48 bg-white shadow-lg"
              >
                <MenuItem
                  v-for="item in userNavigation"
                  :key="item.name"
                  v-slot="{ active }"
                >
                  <a
                    :href="item.href"
                    :class="[
                      'block px-4 py-2 text-sm text-gray-700',
                      { 'bg-gray-100': active },
                    ]"
                  >
                    {{ item.name }}
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
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
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { BellIcon } from "@heroicons/vue/24/outline";

interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}
interface User {
  name: string;
  email: string;
  imageUrl: string;
}
interface UserNavItem {
  name: string;
  href: string;
}

const route = useRoute();

const navigation = computed<NavigationItem[]>(() => [
  { name: "Home", href: "/verifier", current: route.name === "verifier-home" },
  {
    name: "Employees",
    href: "/verifier/employees",
    current: route.name === "verifier-employees",
  },
  {
    name: "Hiring",
    href: "/verifier/verify",
    current: route.name === "verifier-verify",
  },
]);

const user: User = {
  name: "HR guy",
  email: "guy@leoinc.com",
  imageUrl: "https://flowbite.com/docs/images/people/profile-picture-1.jpg",
};
const userNavigation: UserNavItem[] = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

const navItemClass = (isCurrent: boolean) =>
  isCurrent
    ? "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
    : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium";
</script>
