<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

useSeoMeta({
  title: "My Amazing Site",
  ogTitle: "My Amazing Site",
  description: "This is my amazing site, let me tell you all about it.",
  ogDescription: "This is my amazing site, let me tell you all about it.",
  ogImage: "https://example.com/image.png",
  twitterCard: "summary_large_image",
});

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
