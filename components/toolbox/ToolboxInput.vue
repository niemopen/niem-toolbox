
<template>
  <UInput v-model="value" :placeholder="placeholder" :name="name" :ui="ui">
    <template v-if="true" #trailing>
      <UButton color="neutral" variant="link" size="sm" :icon="Icons.close" aria-label="Clear input" @click="value=''"/>
    </template>
  </UInput>
</template>

<script setup lang="ts">

let value = defineModel({
  required: true,
  type: String
});

let { placeholder, name } = defineProps({
  placeholder: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true
  }
})

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
