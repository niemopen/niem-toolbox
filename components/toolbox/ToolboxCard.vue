
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

const closeButtonClasses = `right-0 p-0.5 bg-transparent text-[var(--ui-text-muted)] hover:text-[var(--ui-text)] font-medium text-sm hover:bg-inherit align-sub`;

const cardUI = computed(() => {
  return {
    root: `ring ring-inset ring-[var(--ui-${color})]/25 mt-[var(--app-vertical-spacer)] p-0`,
    header: `p-2 px-8 text-sm font-medium bg-[var(--ui-${color})]/10 text-[var(--ui-${color})]`,
    body: "p-2 px-8",
    footer: "p-2 px-8 text-sm font-light"
  }
});

</script>
