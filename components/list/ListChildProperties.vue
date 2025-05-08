
<template>
  <ListTemplate :entities="childProperties">
    <!-- @vue-expect-error -->
    <template #default="{ item: childProperty }: { item: Subproperty}">
      {{ childProperty.property?.category }}
      {{ childProperty.property?.definition }}
      <ContentChildProperty as="list-item" :child-property="childProperty"/>
    </template>
  </ListTemplate>
</template>

<script setup lang="ts">
import type { Subproperty } from '~/utils/niem/Subproperty';

defineProps<{ childProperties: Subproperty[]}>();

</script>
