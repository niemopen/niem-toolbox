
<template>
  <EntityContents :as="as" :entity="childProperty">
    <template #contents>
      {{ childProperty.property?.category }}
      <ContentTypeContents v-if="type" :type="type"/>
    </template>
  </EntityContents>
</template>

<script setup lang="ts">
import { ChildProperty } from '~/utils/niem/ChildProperty';
import type { Property } from '~/utils/niem/Property';
import type { Type } from '~/utils/niem/Type';

const { childProperty } = defineProps<{
  as: ContentsAsType,
  childProperty: ChildProperty
}>();

const toolbox = useToolboxStore();

let property: Property | undefined;
let type: Type | undefined;

if (childProperty.property?.route) {
  property = await toolbox.property(childProperty.property.route);
  if (property && property.type && property.type.route) {
    type = await toolbox.type(property.type.route);
  }
}


</script>
