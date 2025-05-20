
<template>
  <UFormField :label="label" :help="help">
    <UInput v-model="value" :placeholder="placeholder" :name="name" :icon="icon"
        :ui="ui" class="w-full">
      <template v-if="true" #trailing>
        <UButton color="neutral" variant="link" size="sm" :icon="Icons.close"
            aria-label="Clear input" @click="value=''" class="hover:bg-elevated"/>
      </template>
    </UInput>
  </UFormField>
</template>

<script setup lang="ts">

let value = defineModel({
  required: true,
  type: String
});

let { name, } = defineProps<{
  name: string,
  icon: string,
  label?: string
  placeholder?: string,
  help?: string
}>();

defineShortcuts({
  "escape": {
    usingInput: name,
    handler: () => value.value = ""
  },
  "alt_x": () => console.log("CLICKED")
})

const ui = {
  trailing: "pr-0.5"
}

</script>
