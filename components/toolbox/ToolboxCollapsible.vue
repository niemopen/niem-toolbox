
<template>
  <UCollapsible class="mt-3" :default-open="defaultOpen" @update:open="$emit('open')">

    <UButton :label="label" color="neutral" variant="subtle" :leading-icon="icons.down" class="justify-start" block/>

    <template #content>
      <div class="mt-3 ml-8">
        <slot name="default"/>
      </div>
    </template>

  </UCollapsible>
</template>

<script setup lang="ts">

const { defaultOpen = true } = defineProps<{
  label: string,
  defaultOpen?: boolean
}>();

defineEmits(["open"]);

</script>
