
<template>
  <ToolboxCard v-if="results.request != 'unsent'"
  :title="title" :icon="icon" :color="color" :dismissible="true">

    <template #default v-if="!results.report">
      <span class="whitespace-pre-line">
        <div>{{ results.message }}</div>
      </span>
    </template>

    <template #default v-else>
      <div class="spaced">

        <UAccordion v-model="activeSummaryItem" :items="summaryItems">
          <template #body>
            <UTable :data="resultCountData" :ui="{base: 'min-w-80'}"/>
          </template>
        </UAccordion>

        <UAccordion :default-value="activeReportItems" :items="testItems" type="multiple">
          <template #default="{ item }">
            <span class="mr-2">{{ item.label }}</span>
            <!-- <UBadge :label="item.status" :color="item.color" variant="subtle"/> -->
          </template>

          <template #body="{ item }">
            <APIResponseReportNDR v-if="item.kind=='ndr'" :tests="item.tests"/>
            <APIResponseReportDefault v-else :test="item.tests[0]"/>
          </template>
        </UAccordion>

      </div>
    </template>

    <template #footer v-if="results.request == 'returned'">
      <p>Request returned in {{ results.time }} seconds</p>
    </template>

  </ToolboxCard>
</template>

<script setup lang="ts">

import type { AccordionItem, TableData } from '@nuxt/ui';

const { results } = defineProps<{ results: APITypes.Results }>();

const activeSummaryItem = ref("0");
const activeReportItems = ref<string[]>([]);

const title = computed(() => {
  return results.title || results.status.toUpperCase();
});

const icon = computed(() => Icons[results.status]);

const color = computed(() => {
  return results.status == 'pending' ? "warning" : results.status;
});

const summaryItems = computed<AccordionItem[]>(() => {
  return [
    {
      label: results.message,
      icon: Icons.download
    }
  ]
});

const resultCountData = computed<TableData[]>(() => {
  if (!results.report) return [];
  return [
    {
      summary: "Info",
      count: results.report.info
    },
    {
      summary: "Warnings",
      count: results.report.warnings
    },
    {
      summary: "Errors",
      count: results.report.errors
    },
  ]
});

const reportTests = computed(() => {
  return results.report?.tests || [];
});

const ndrTests = computed(() => {
  return  reportTests.value.filter(test => test.id.startsWith("validate-ndr"));
});

const otherTests = computed(() => {
  return reportTests.value.filter(test => !test.id.startsWith("validate-ndr"));
});

type TestAccordionItem = Partial<AccordionItem> & {
  kind?: "ndr",
  status: string,
  color: ColorType,
  tests: APITypes.Test[]
}

const testItems = computed<TestAccordionItem[]>(() => {

  // Add other tests individually
  let items: TestAccordionItem[] = otherTests.value.map(test => {

    let tests = otherTests.value.filter(item => item.id == test.id);
    let status = API.testsStatus(tests);

    return {
      label: test.id,
      icon: Icons.checklist,
      tests,
      status,
      color: API.statusColor(status)
    }
  });

  // Add NDR tests bundled together as one
  if (ndrTests.value.length > 0) {
    let status = API.testsStatus(ndrTests.value);

    items.push({
      label: "NDR validation report",
      icon: Icons.checklist,
      kind: "ndr",
      tests: ndrTests.value,
      status,
      color: API.statusColor(status)
    })
  }

  // Add array indices to report active items to open each accordion item by default
  let index = 0;
  items.forEach(item => {
    activeReportItems.value.push(index.toString());
    index++;
  });

  return items;
});

</script>
