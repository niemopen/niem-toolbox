
<template>
  <UCard :ui="cardUI" class="mb-2 -ml-5">
    <template #header>
      <ToolboxCopy :title="title" :text="code"/>
    </template>

    <pre class="whitespace-pre-wrap"><code>{{ code }}</code></pre>

    <template #footer>
      Fill out fields in the form below to see a request.
    </template>
  </UCard>
</template>

<script setup lang="ts">

const { color="neutral" } = defineProps<{
  code: string,
  title?: string
  color?: string
}>();

const cardUI = {
  root: `ring ring-inset ring-[var(--ui-${color})]/25 mt-[var(--app-vertical-spacer)] p-0 `,
  header: `p-2 px-8 text-sm font-medium text-[var(--ui-text-muted)]`,
  body: "p-2 px-8 bg-gray-600 text-white",
  footer: "p-2 px-8 text-sm font-light"
}

</script>
