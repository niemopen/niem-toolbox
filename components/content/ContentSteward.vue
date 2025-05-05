
<template>
  <EntityContents :as="as" :entity="steward">
    <template #models>
      <ListModels :models="models"/>
    </template>

    <template #namespaces>
      <!-- TODO: Steward namespaces -->
      <ContentPlaceholder label="STEWARD NAMESPACES"/>
    </template>
  </EntityContents>
</template>

<script setup lang="ts">
import type { Steward } from '~/utils/niem/Steward';

const { steward } = defineProps<{
  as: ContentsAsType,
  steward: Steward
}>();

const toolbox = useToolboxStore();

let models = await toolbox.models(steward);
steward.modelsCount = models.length;

</script>
