
<template>
  <ListTemplate :entities="models" :use-label-qualifier="useLabelQualifier">
    <!-- @vue-expect-error -->
    <template #default="{ item: model }: { item: Model }">
      <ContentModel as="list-item" :model="model"/>
    </template>
  </ListTemplate>
</template>

<script setup lang="ts">
import type { Model } from '~/utils/niem/Model';

const { useLabelQualifier = false } = defineProps<{
  models: Model[],
  useLabelQualifier?: boolean
}>();

</script>
