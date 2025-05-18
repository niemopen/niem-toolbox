
<template>
  <div v-if="facets.length > 0">

    <!-- Show type restriction chain -->
    <ContentValue :type="type"/>

    <!-- Facet table -->
    <UTable :data="facets" :columns="columns" :sticky="true" :ui="ui" class="pt-2 table-facets"/>

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

<style lang="scss">

.table-facets td:nth-child(3) {
  width: 60%;
}
</style>