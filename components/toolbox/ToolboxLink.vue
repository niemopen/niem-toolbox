
<template>

  <!-- Link -->
  <ULink :to="link.to" :target="link.target" >
    <!-- Leading icon if available -->
    <UIcon v-if="link.icon" :name="link.icon" :class="leadingIconClasses"/>

    <span :class="link.labelClasses || ''">{{ link.label }}</span>
  </ULink>

  <!-- Trailing external link icon if applicable -->
  <UIcon v-if="link.target" :name="icons.externalLink" :class="trailingIconClasses"/>

</template>

<script setup lang="ts">

defineProps<{ link: AppLinkType }>();

const leadingIconClasses = "size-4 align-middle mr-1";

const trailingIconClasses = "size-3 align-top text-[var(--ui-text-dimmed)]";

</script>
