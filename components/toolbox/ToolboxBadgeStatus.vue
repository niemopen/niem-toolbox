
<template>
  <UBadge v-if="as=='badge'" :icon="icon" :color="color" :variant="variant" class="mr-2">
    {{ text }}
  </UBadge>

  <ToolboxIcon v-else-if="icon" :icon="icon" :color="color" :size="6"/>
</template>

<script setup lang="ts">

const { test, status, display = "both", as = "badge", variant = "subtle" } = defineProps<{
  test?: APITypes.Test,
  status?: APITypes.ResultStatusCode,
  as?: "badge" | "icon",
  display?: "icon" | "text" | "both",
  variant?: "solid" | "outline" | "soft" | "subtle"
}>();

const color = computed(() => {
  if (test) return API.statusColor(test.severity)
  return status == "passed" ? "success" : status;
});

const text = computed(() => {
  if (display == "icon") return "";
  return color.value == "success" ? "passed" : color.value;
});

const icon = computed(() => {
  if (display == "text" || !color.value) return undefined;
  return Icons[color.value];
});

</script>
