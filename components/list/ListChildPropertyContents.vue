
<template>
  <ContentChildProperty as="list-item" :child-property="childProperty"/>
</template>

<script setup lang="ts">
import type { Subproperty } from '~/utils/niem/Subproperty';

const { childProperty } = defineProps<{ childProperty: Subproperty }>();


</script>
