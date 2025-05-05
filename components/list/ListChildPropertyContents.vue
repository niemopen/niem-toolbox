
<template>
  <ContentChildProperty as="list-item" :child-property="childProperty"/>
</template>

<script setup lang="ts">
import type { ChildProperty } from '~/utils/niem/ChildProperty';

const { childProperty } = defineProps<{ childProperty: ChildProperty }>();


</script>
