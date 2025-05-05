
<template>
  <ListTemplate :entities="childProperties">
    <!-- @vue-expect-error -->
    <template #default="{ item: childProperty }: { item: ChildProperty}">
      {{ childProperty.property?.category }}
      {{ childProperty.property?.definition }}
      <ContentChildProperty as="list-item" :child-property="childProperty"/>
    </template>
  </ListTemplate>
</template>

<script setup lang="ts">
import type { ChildProperty } from '~/utils/niem/ChildProperty';

defineProps<{ childProperties: ChildProperty[]}>();

</script>
