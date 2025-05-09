
<template>
  <EntityContents :as="as" :entity="version">

    <template #namespaces>
      <ListNamespacesByCategory v-if="groupNamespacesByCategory"
          :namespaces="namespaces" :use-label-qualifier="showNamespaceNames"/>
      <ListNamespaces v-else :namespaces="namespaces" :use-label-qualifier="showNamespaceNames"/>
    </template>

    <template #properties>
      <ListProperties :properties="properties" :enable-more="hasMoreProperties"
          :total="propertyCount" @load-more="loadMoreProperties"/>
    </template>

    <template #types>
      <ListTypes :types="types" :enable-more="hasMoreTypes"
          :total="typeCount" @load-more="loadMoreTypes"/>
    </template>

    <template v-for="panel in ToolboxApp.PAGE_PANEL_NAMES" #[panel]>
      <slot :name="panel" v-if="panel in $slots"/>
    </template>

  </EntityContents>
</template>

<script setup lang="ts">
import type { Property } from '~/utils/niem/Property';
import type { Type } from '~/utils/niem/Type';
import { Version } from '~/utils/niem/Version';

const { version, groupNamespacesByCategory = false, showNamespaceNames = false } = defineProps<{
  as: ContentsAsType,
  version: Version,
  groupNamespacesByCategory?: boolean,
  showNamespaceNames?: boolean
}>();

const toolbox = useToolboxStore();

// Get the fixed list of namespaces for this version
const namespaces = await toolbox.namespaces(version);
version.namespacesCount = namespaces.length;

// Set up reactive component lists so values can be loaded later
const properties: Ref<Property[]> = ref([]);
const types: Ref<Type[]> = ref([]);

// Reactive indicator for if the version has more properties that could be loaded
const hasMoreProperties = computed<boolean>(() => {
  return !version.propertiesLoaded;
});

// Reactive indicator for if the version has more types that could be loaded
const hasMoreTypes = computed<boolean>(() => {
  return !version.typesLoaded;
});

version.propertiesCount = 0;
version.typesCount = 0;

// Reactive property count
const propertyCount = computed<number|undefined>(() => {
  return version.propertiesCount;
});

// Reactive type count
const typeCount = computed<number|undefined>(() => {
  return version.typesCount;
});

// Initial component load
await loadMoreProperties();
await loadMoreTypes();

/**
 * Load the next page of properties.
 */
async function loadMoreProperties() {
  if (version.propertiesLoaded) return;
  if (!version.propertiesCount) version.propertiesCount = 0;

  let page = await toolbox.propertiesFromVersion(version, properties.value.length);

  if (page.first) {
    version.propertiesCount = page.totalElements;
  }

  if (page.last) {
    console.log("PAGE LAST", page.last);
    version.propertiesLoaded = true;
  }

  properties.value.push(...page.content);
}

/**
 * Load the next page of types.
 */
async function loadMoreTypes() {
  if (version.typesLoaded) return;
  if (!version.typesCount) version.typesCount = 0;

  let page = await toolbox.typesFromVersion(version, types.value.length);

  if (page.first) {
    version.typesCount = page.totalElements;
  }

  if (page.last) {
    version.typesLoaded = true;
  }

  types.value.push(...page.content);
}

</script>
