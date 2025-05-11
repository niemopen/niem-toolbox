
<template>
  <EntityContents :as="as" :entity="property">

    <template #contents>
      <ContentPropertyContents :property="property"/>
    </template>

    <template #usages>
      <ListSubpropertiesAsTable :property="property"/>
    </template>

  </EntityContents>
</template>

<script setup lang="ts">
import type { Subproperty } from '~/utils/niem/Subproperty';
import type { Property } from '~/utils/niem/Property';

const { property } = defineProps<{
  property: Property,
  as: ContentsAsType
}>();

const toolbox = useToolboxStore();

let usages: Subproperty[] = await toolbox.subpropertiesWithProperty(property);

property.usagesCount = usages.length;

</script>
