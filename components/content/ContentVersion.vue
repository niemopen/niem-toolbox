
<template>
  <EntityContents :as="as" :entity="version">

    <template #namespaces>
      <ListNamespacesByCategory v-if="groupNamespacesByCategory" :namespaces="namespaces"/>
      <ListNamespaces v-else :namespaces="namespaces"/>
    </template>

    <template #properties>
      <ListProperties :properties="properties" :enable-more="enableMoreProperties" @load-more="loadMoreProperties"/>
    </template>

    <template #types>
      <ListTypes :types="types" :enable-more="enableMoreTypes" @load-more="loadMoreTypes"/>
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

const { version, groupNamespacesByCategory = false } = defineProps<{
  as: ContentsAsType,
  version: Version,
  groupNamespacesByCategory?: boolean
}>();

const toolbox = useToolboxStore();

const namespaces = await toolbox.namespaces(version);
version.namespacesCount = namespaces.length;

const properties: Ref<Property[]> = ref([]);
const types: Ref<Type[]> = ref([]);

const enableMoreProperties = computed<boolean>(() => {
  return !version.propertiesLoaded;
});

const enableMoreTypes = computed<boolean>(() => {
  return !version.typesLoaded;
});

version.propertiesCount = 0;
version.typesCount = 0;

// Initial load
await loadMoreProperties();
await loadMoreTypes();

async function loadMoreProperties() {
  if (version.propertiesLoaded) return;
  if (!version.propertiesCount) version.propertiesCount = 0;

  let results = await toolbox.propertiesFromVersion(version, properties.value.length);
  if (results.length < API.PAGINATION_LIMIT) {
    version.propertiesLoaded = true;
  }
  version.propertiesCount += results.length;
  properties.value.push(...results);
}

async function loadMoreTypes() {
  if (version.typesLoaded) return;
  if (!version.typesCount) version.typesCount = 0;

  let results = await toolbox.typesFromVersion(version, types.value.length);
  if (results.length < API.PAGINATION_LIMIT) {
    version.typesLoaded = true;
  }
  version.typesCount += results.length;
  types.value.push(...results);
}

</script>
