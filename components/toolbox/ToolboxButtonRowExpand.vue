
<template>
  <UButton color="neutral" variant="ghost" :icon="icon" :square="true" class="bg-transparent flex-1" :onclick="toggle"/>
</template>

<script setup lang="ts">

import type { Row } from '@tanstack/vue-table'

const { row } = defineProps<{ row: Row<any> }>();

const icon = computed(() => row.getIsExpanded() ? Icons.down : Icons.right);

function toggle() {
  row.toggleExpanded()
}

</script>