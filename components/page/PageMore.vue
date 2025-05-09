<template>
  <div>
    <USeparator :decorative="true" class="my-2"/>

    <!-- Panel title -->
    <ToolboxIconTitle :icon="icon" :title="title" classes="page-header-title font-semibold ml-3 text-primary"/>

    <!-- Panel contents passed in from parent component -->
    <div class="ml-[33px] mt-2 text-sm spaced-sm">
      <slot :name="slotName"/>
    </div>
  </div>
</template>

<script setup lang="ts">

const { icon, title, slotName } = defineProps<{
  icon: string,
  title: string,
  slotName: string
}>();

</script>
