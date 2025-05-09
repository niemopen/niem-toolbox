
<template>
  <p class="font-light mb-4">{{ test.description }}</p>

  <UTable :data="test.results.sort(sortTestResults)" :columns="resultColumns" class="table-generic-validation-results" sticky>
    <template #expanded="{ row }">
      <h3>Path:</h3>
      <p class="mb-3">{{ row.original.location }}</p>
      <div v-if="row.original.status != 'passed'">
        <h3>Details:</h3>
        <p class="text-wrap mb-3">{{ row.original.message }}</p>
      </div>
    </template>
  </UTable>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'

const UBadge = resolveComponent('UBadge')
import type { TableColumn } from '@nuxt/ui';
import ToolboxButtonRowExpand from '../toolbox/ToolboxButtonRowExpand.vue';


const { test } = defineProps<{ test: APITypes.Test }>();


/**
 * Sort test results by filename and line.
 */
function sortTestResults(a: APITypes.TestResult, b: APITypes.TestResult) {
  let aFilename = a.location.split("/").pop() || "";
  let bFilename = b.location.split("/").pop() || "";

  let filenameComparison = aFilename.localeCompare(bFilename,undefined,{sensitivity: 'base'});
  if (filenameComparison != 0) return filenameComparison;
  return parseInt(a.line) - parseInt(b.line);
}

function testUI(status: APITypes.ResultStatusCode) {
  let color = getResultColorClass(status);
  return {
    root: `ring-${color}/25`,
    header: `bg-${color}/10 text-${color}`
  }
}

function getResultIcon(severity: APITypes.ResultSeverityCode | APITypes.ResultStatusCode) {
  switch (severity) {
    case "error" : return Icons.error;
    case "info": return Icons.info;
    case "warning": return Icons.warning;
    case 'passed': return Icons.success;
  }
}

function getResultColorClass(severity: APITypes.ResultSeverityCode | APITypes.ResultStatusCode) {
  switch (severity) {
    case "error" : return "error";
    case "info": return "info";
    case "warning": return "warning";
    case 'passed': return "success";
  }
}

const resultColumns: TableColumn<APITypes.TestResult>[] = [
  {
    id: 'expand',
    cell: ({ row }) => h(ToolboxButtonRowExpand, { row })
  },
  // TODO: Refactor status badge
  {
    accessorKey: "status",
    header: "Status",
    size: 100,
    cell: ({ row }) => {
      const color = {
        passed: 'success' as const,
        error: 'error' as const,
        warning: 'warning' as const
      }[row.getValue('status') as string]

      return h(UBadge, { variant: 'subtle', color }, () =>
        row.getValue('status')
      )
    }
  },
  {
    accessorKey: "entityCategory",
    header: "Category",
    cell({ getValue }) {
      if (!getValue()) return;
      return h(UBadge, { color: "neutral", variant: "subtle"}, getValue);
    },

    size: 150,
    maxSize: 150
  },
  {
    accessorKey: "entity",
    header: "Entity",
    cell: ({ getValue}) => h("span", {class: 'w-[100px]'}, getValue),
    size: 200,
    maxSize: 200
  },
  {
    accessorKey: "location",
    header: "File",
    cell: ({ row }) => row.original.location.split("/")?.pop()
  },
  {
    accessorKey: "line",
    header: "Line",
    size: 75,
    maxSize: 75
  },
  {
    accessorKey: "column",
    header: "Column",
    size: 75,
    maxSize: 75
  }
];


</script>

<style lang="scss">

.table-generic-validation-results td:nth-child(4) {
  width: 100%;
  white-space: normal !important;
}

.table-generic-validation-results td:nth-child(5) {
  white-space: no-wrap;
}

</style>
