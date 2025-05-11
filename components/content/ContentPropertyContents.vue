
<template>
  <ContentTypeContents v-if="type" :type="type"/>
  <ListProperties v-else-if="property.category=='abstract_element'" :properties="substitutions"/>
  <UAlert v-else title="No contents" variant="subtle"/>
</template>

<script setup lang="ts">
import type { Property } from '~/utils/niem/Property';
import type { Type } from '~/utils/niem/Type';

const { property } = defineProps<{ property: Property}>();

const toolbox = useToolboxStore();

let type: Type | undefined;

let substitutions: Property[] = [];

if (property.type && property.type.route) {
  type = await toolbox.type(property.type?.route);
}

substitutions = await toolbox.substitutions(property.params);

</script>
