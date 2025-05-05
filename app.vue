
<template>
  <NuxtRouteAnnouncer />
  <UApp>
    <NuxtLayout>
      <ClientOnly>
        <NuxtPage/>
      </ClientOnly>
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">

await callOnce(async () => {
});

</script>

<style>
  @import "tailwindcss";
  @import "@nuxt/ui";

  :root {
    --ui-primary: #297DB3;
    --ui-secondary: whitesmoke;
  }

  @theme {
    --color-primary: var(--ui-primary);
    --color-secondary: var(--ui-secondary);
  }

</style>
