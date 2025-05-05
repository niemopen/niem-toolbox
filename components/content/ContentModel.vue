
<template>
  <EntityContents :as="as" :entity="model">
    <template #versions>
      <ListVersions :versions="versions"/>
    </template>

  </EntityContents>
</template>

<script setup lang="ts">
import { Model } from '~/utils/niem/Model';

const { model } = defineProps<{
  as: ContentsAsType,
  model: Model
}>();

const toolbox = useToolboxStore();
let versions = await toolbox.versions(model);
model.versionsCount = versions.length;

</script>
