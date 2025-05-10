
<template>
  <ContentSubproperty as="list-item" :subproperty="subproperty"/>
</template>

<script setup lang="ts">
import type { Subproperty } from '~/utils/niem/Subproperty';

const { subproperty } = defineProps<{ subproperty: Subproperty }>();


</script>
