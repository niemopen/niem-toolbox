
<template>
  <ListTemplate :entities="types" :enable-more="enableMore" :total="total"
   @load-more="$emit('loadMore')">

    <template #default="{ item }">
      <ContentTypeContents :type="(item as Type)" :highlight-property="highlightProperty"/>
    </template>

  </ListTemplate>
</template>

<script setup lang="ts">
import type { Property } from '~/utils/niem/Property';
import { Type } from '~/utils/niem/Type';

const { enableMore = false } = defineProps<{
  types: Type[],
  enableMore?: boolean,
  total?: number,
  highlightProperty?: Property
}>();

defineEmits(["loadMore"]);

</script>
