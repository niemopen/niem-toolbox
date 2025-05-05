
<template>
  <EntityContents :as="as" :entity="type">

    <template #contents>
      <ContentTypeContents :type="type"/>
    </template>

    <template #usages>
      <!-- TODO: Type usages -->
      <ContentPlaceholder label="type usages"/>
    </template>

  </EntityContents>
</template>

<script setup lang="ts">
import type { Type } from '~/utils/niem/Type';

const { type } = defineProps<{
  type: Type,
  as: ContentsAsType
}>();

const toolbox = useToolboxStore();

</script>
