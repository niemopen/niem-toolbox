
<template>
  <div v-if="facets.length > 0">

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

    <!-- Facet table -->
    <UTable :data="facets" :columns="columns" :sticky="true" :ui="ui" class="pt-2"/>

    <!-- More button and loaded items count -->
    <div>
      <USeparator class="py-4"/>
      <div class="flex justify-between">
        <div class="text-dimmed text-sm">
          <span>{{ facets.length }}</span>
          <span v-if="total"> of {{ total }}</span>
          <span> items loaded</span>
        </div>
        <UButton v-if="!loaded" label="More" :trailing-icon="Icons.down" @click="loadMoreFacets"/>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { UBadge } from '#components';
import type { TableColumn } from '@nuxt/ui';
import type { Facet } from '~/utils/niem/Facet';
import type { Type } from '~/utils/niem/Type';

const { type } = defineProps<{
  type: Type
}>();

const toolbox = useToolboxStore();

const facets: Ref<Facet[]> = ref([]);

const total = ref(0);
const loaded = ref(false);

let bases = await toolbox.bases(type.params);
bases = bases.reverse();

const patterns = bases.map(base => base.pattern);
const pattern: APITypePattern = patterns.includes("simple_list") ? "simple_list" : "simple_value";

// TODO: Support unions
const union = patterns.includes("simple_union");

const types = [type, ...bases];

let currentType: Type | undefined = type;

const ui = {

}

const columns: TableColumn<Facet>[] = [
  {
    accessorKey: 'category',
    header: "Category",
    cell({ row }) {
      return h(UBadge, {
        color: row.original.badgeColor,
        variant: row.original.badgeVariant
      }, () => row.original.category);
    }
  },
  {
    accessorKey: 'value',
    header: "Value",
    meta: {
      class: {
        td: "text-xs text-wrap break-normal whitespace-normal"
      }
    }
  },
  {
    accessorKey: 'definition',
    header: "Definition",
    meta: {
      class: {
        td: "text-xs text-wrap break-normal whitespace-normal"
      }
    }
  },
]

// Initial load
await loadMoreFacets();

/**
 * Load the next page of facets.
 */
async function loadMoreFacets() {
  if (loaded.value == true || !currentType) return;

  let page = await toolbox.facetsFromType(currentType, facets.value.length);

  // If no facets found, check bases or mark search as ended
  if (facets.value.length == 0 && page.empty) {

    if (type.base) {
      // Check base type for facets
      currentType = await toolbox.type(type.base.route);
      if (currentType) {
        // Try again with the base type
        await loadMoreFacets();
      }
    }
    else {
      // No more bases
      loaded.value = true;
    }
  }

  if (!page.empty && page.first) {
    total.value = page.totalElements;
    type.contentsCount = total.value;
    if (currentType) {
      currentType.contentsCount = total.value;
    }
  }

  if (!page.empty && page.last) {
    loaded.value = true;
  }

  facets.value.push(...page.content);
}

</script>
