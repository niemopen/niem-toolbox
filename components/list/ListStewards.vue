
<template>
  <ListTemplate :entities="stewards">
    <!-- @vue-expect-error -->
    <template #default="{ item }: { item: Steward }">
      <ContentSteward as="list-item" :steward="item"/>
    </template>
  </ListTemplate>
</template>

<script setup lang="ts">
import { Steward } from '~/utils/niem/Steward';

defineProps<{ stewards: Steward[] }>();

</script>
