
<template>
  <ContentTypeContents v-if="type" :type="type"/>
  <UAlert v-else title="No contents" variant="subtle"/>
</template>

<script setup lang="ts">
import type { Property } from '~/utils/niem/Property';
import type { Type } from '~/utils/niem/Type';

const { property } = defineProps<{ property: Property}>();

const toolbox = useToolboxStore();

let type: Type | undefined;

if (property.type && property.type.route) {
  type = await toolbox.type(property.type?.route);
}

</script>
