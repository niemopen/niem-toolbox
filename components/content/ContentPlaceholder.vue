
<template>
  <UAlert :title="title" variant="subtle"/>
</template>

<script setup lang="ts">

const { label } = defineProps<{ label: string }>();

const title = `${ label.toUpperCase() } PLACEHOLDER`;

</script>