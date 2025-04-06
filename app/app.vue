<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: "До проектів",
      icon: "i-lucide-book-open",
      to: "/",
    },
  ],
]);
</script>

<template>
  <UApp>
    <UContainer>
      <UNavigationMenu color="neutral" :items="items" class="w-full" />
    </UContainer>
    <USeparator />
    <NuxtPage />
  </UApp>
</template>
