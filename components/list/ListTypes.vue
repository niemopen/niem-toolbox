
<template>
  <ListTemplate :entities="types" :enable-more="enableMore" :total="total"
      @load-more="$emit('loadMore')"/>
</template>

<script setup lang="ts">
import { Type } from '~/utils/niem/Type';

const { enableMore = false } = defineProps<{
  types: Type[],
  enableMore?: boolean,
  total?: number
}>();

defineEmits(["loadMore"]);

</script>
