
<template>
  <UCard :class="cardClasses" :ui="cardUI">

    <template #header>
      <div class="flex justify-between">
        <ToolboxIconTitle :title="title" :icon="icon"/>
        <UButton v-if="dismissible" :icon="Icons.close" @click="panelDisplay='hidden'" :class="closeButtonClasses"/>
      </div>
    </template>

    <template #default>
      <slot name="default"/>
    </template>

    <template #footer>
      <slot name="footer"/>
    </template>
  </UCard>

</template>

<script lang="ts" setup>

const { title, icon, color="neutral", dismissible=false } = defineProps<{
  title: string,
  icon: IconType,
  color?: ColorType,
  dismissible?: boolean
}>();


const panelDisplay: Ref<""|"hidden"> = ref("");

const cardClasses = computed(() => `mt-[var(--app-vertical-spacer)] ${panelDisplay.value}`);

const closeButtonClasses = `right-0 p-0.5 bg-transparent text-muted hover:text-default font-medium text-sm hover:bg-inherit align-sub`;

const cardUI = computed(() => {
  return {
    root: `ring ring-inset ring-${color}/25 mt-[var(--app-vertical-spacer)] p-0`,
    header: `p-2 px-8 text-sm font-medium bg-${color}/10 text-${color}`,
    body: "p-2 px-8",
    footer: "p-2 px-8 text-sm font-light"
  }
});

</script>
