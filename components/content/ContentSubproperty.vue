
<template>
    <ContentPropertyContents v-if="property" :property="property" :path="path"/>
    <ContentTypeContents v-else-if="type" :type="type" :path="forkedPath"/>

</template>

<script setup lang="ts">
import { Subproperty } from '~/utils/niem/Subproperty';
import type { Property } from '~/utils/niem/Property';
import type { Type } from '~/utils/niem/Type';

const { subproperty, path } = defineProps<{
  subproperty: Subproperty,
  path: APIComponentRef[]
}>();

const toolbox = useToolboxStore();

let property: Property | undefined;
let type: Type | undefined;

let forkedPath = [...path];

if (subproperty.property?.route) {
  property = await toolbox.property(subproperty.property.route);

  if (property && property.type && property.type.route) {
    forkedPath.push(property.ref);
    type = await toolbox.type(property.type.route);
  }
}

</script>
