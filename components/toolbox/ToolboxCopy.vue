
<template>
  <div class="flex justify-between">
    <span class="mt-1">{{ title || text }}</span>
    <UButton v-if="isSupported" @click="copyValue" :icon="icon" :class="{ copied }" :ui="UI.button_icon"/>
  </div>
</template>

<script setup lang="ts">

import { useClipboard } from "@vueuse/core";
const { copy, copied, isSupported } = useClipboard();

const { text } = defineProps<{text: string, title?: string}>();

const icon = ref<IconType>(Icons.copy);

async function copyValue() {
  copy(text);
  icon.value = Icons.copied;
  setTimeout(() => icon.value = Icons.copy, 1500);
}

</script>
