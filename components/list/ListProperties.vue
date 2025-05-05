
<template>
  <ListTemplate :entities="properties" :enable-more="enableMore" @load-more="$emit('loadMore')">
    <!-- @vue-expect-error -->
    <template #default="{ item }: { item: Property }">
      <ContentPropertyContents :property="item"/>
    </template>
  </ListTemplate>
</template>

<script setup lang="ts">
import { Property } from '~/utils/niem/Property';

const { enableMore = false } = defineProps<{
  properties: Property[],
  enableMore?: boolean
}>();

defineEmits(["loadMore"]);

</script>
