
<template>
  <div>
    <ContentModel v-if="model" :model="model" as="page"/>
    <ContentNotFound v-else/>
  </div>
</template>

<script setup lang="ts">

const params = useRoute().params as APIModelParams;

const model = await useToolboxStore().model(params);

</script>
