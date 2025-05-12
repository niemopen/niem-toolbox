
<template>
  <ListTemplate :entities="subproperties">
    <!-- @vue-expect-error -->
    <template #default="{ item: subproperty }: { item: Subproperty }">
        <ContentSubproperty :subproperty="subproperty" :path="path" :h/>
      </template>
    </ListTemplate>
</template>

<script setup lang="ts">
import { Subproperty } from '~/utils/niem/Subproperty';

defineProps<{
  subproperties: Subproperty[],
  path: APIComponentRef[]
}>();

</script>
