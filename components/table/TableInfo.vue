
<template>
  <div>
    <UTable :data="data" :columns="columns" :ui="ui" class="table-info-items"/>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import ToolboxLink from '../toolbox/ToolboxLink.vue';
import ToolboxCopy from '../toolbox/ToolboxCopy.vue';

const UBadge = resolveComponent("UBadge");

const { widthClass } = defineProps<{
  data: InfoItem[],
  widthClass?: string
}>();

const ui = {
  root: widthClass,
  thead: "hidden",
  td: "whitespace-normal text-wrap"
}

const columns: TableColumn<InfoItem>[] = [
  {
    accessorKey: "field",
  },
  {
    accessorKey: "value",
    cell: ({ row, getValue }) => {

      // External link, internal route, or email cell
      if (row.original.format == "link" || row.original.format == "email" || row.original.format == "route") {
        let link: AppLinkType = {
          to: (row.original.format == "email" ? "mailto:" : "") + (row.original.link ? row.original.link : getValue()),
          label: getValue() as string,
          target: row.original.format == "route" ? "" : "_blank"
        }
        return h(ToolboxLink, { link });
      }

      // Format value as badge
      else if (row.original.badgeColor) {
        return h(UBadge, {
          label: row.original.value,
          color: row.original.badgeColor,
          variant: row.original.badgeVariant || "subtle"
        });
      }

      // Text cell
      else {
        return h(ToolboxCopy, { text: getValue() as string });
      }

    }
  }
]

</script>

<style lang="scss">

.table-info-items td:nth-child(1) {
  white-space: nowrap !important;
}

.table-info-items td:nth-child(2) {
  width: 100%;
  white-space: normal !important;
}

.table-info-items tr:first-child td:nth-child(2) {
  font-weight: bold;
}

</style>