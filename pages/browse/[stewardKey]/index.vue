
<template>
  <div>
    <ContentSteward v-if="steward" :steward="steward" as="page"/>
    <ContentNotFound v-else/>
  </div>
</template>

<script setup lang="ts">

const params = useRoute().params as APIStewardParams;

const steward = await useToolboxStore().steward(params);

</script>
