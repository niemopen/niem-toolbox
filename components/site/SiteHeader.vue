
<template>
  <UNavigationMenu :items="items" class="" variant="link" :ui="ui"/>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const siteMenuItems = [
  AppItems.login,
  AppItems.preferences,
  AppItems.releaseNotes,
  AppItems.help
];


const items = [
  // Brand on left
  [ AppItems.brand ],

  // Menu items on right
  [ AppMenuItem(undefined, Icons.menu, siteMenuItems) ]
] as NavigationMenuItem[];

const ui = {
  root: "flex justify-between h-12 bg-[var(--ui-primary)] p-4",
  // Display drop-down as single small (not full width) column on right
  viewportWrapper: "w-48 right-0 left-auto",
  childList: "grid-cols-1 ",
  linkLabel: "text-white text-lg",
  link: "text-white",
  linkLeadingIcon: "text-white",
  linkTrailingIcon: "hidden",
  childLinkIcon: "text-[var(--ui-text)]",
  variants: {
    disabled: {
      true: {
        link: "text-red-500 opacity-25"
      }
    }
  }
};

</script>
