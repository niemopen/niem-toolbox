
<template>
  <UIcon :name="icon" :class="classes"/>
</template>

<script setup lang="ts">

const { icon, color, size=5 } = defineProps<{
  icon: IconType,
  color?: ColorType
  size?: number
}>();

const classes = computed(() => {
  let value = "";

  if (color) {
    value += `text-${color} `;
  }

  if (size) {
    value += `size-${size}`;
  }

  return value;
});

</script>