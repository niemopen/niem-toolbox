
<template>
  <EntityContents :as="as" :entity="property">

    <template #contents>
      <ContentTypeContents v-if="type" :type="type"/>
    </template>

    <template #usages>
      <!-- TODO: Property usages -->
      <ContentPlaceholder label="PROPERTY USAGES"/>
      <ul>
        <li v-for="usage of usages">
          {{ usage.type?.qname }} > {{ usage.property?.qname }}
        </li>
      </ul>
    </template>

  </EntityContents>
</template>

<script setup lang="ts">
import type { ChildProperty } from '~/utils/niem/ChildProperty';
import type { Property } from '~/utils/niem/Property';
import type { Type } from '~/utils/niem/Type';

const { property } = defineProps<{
  property: Property,
  as: ContentsAsType
}>();

const toolbox = useToolboxStore();

let type: Type | undefined;

if (property.type) {
  type = await toolbox.type({...property.params, qname: property.type?.qname});
}

let usages: ChildProperty[] = await toolbox.childPropertiesWithProperty(property);

property.usagesCount = usages.length;

</script>
