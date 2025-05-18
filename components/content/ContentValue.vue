
<template>
    <!-- Type derivation -->
  <div class="text-sm text-muted">
    <div class="p-2">
      <UCard variant="subtle" :ui="{body: 'p-2 sm:p-2 bg-neutral'}">
        <template #default>
          <!-- Simple style -->
          <span v-if="pattern=='simple_value'">Value from </span>
          <span v-else-if="pattern=='simple_list'">List from </span>
          <span v-else-if="union">Union of [pending] </span>

          <!-- Current and base types -->
          <span v-for="(type, index) of types" class="pt-4">
            <ULink :to="type.toolboxRoute" class="text-xs font-medium">{{ type.qname }}</ULink>
            <span v-if="index < types.length - 1"> > </span>
          </span>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Type } from '~/utils/niem/Type';

const { type } = defineProps<{
  type: Type
}>();

const toolbox = useToolboxStore();

let bases = await toolbox.bases(type.params);
bases = bases.reverse();

const patterns = bases.map(base => base.pattern);
const pattern: APITypePattern = patterns.includes("simple_list") ? "simple_list" : "simple_value";

// TODO: Support unions
const union = patterns.includes("simple_union");

const types = [type, ...bases];

</script>