
<template>
  <EntityContents :as="as" :entity="namespace">

    <template #properties>
      <ListProperties :properties="properties" :enable-more="hasMoreProperties" @load-more="loadMoreProperties"/>
    </template>

    <template #types>
      <ListTypes :types="types" :enable-more="enableMoreTypes" @load-more="loadMoreTypes"/>
    </template>

  </EntityContents>
</template>

<script setup lang="ts">
import type { Namespace } from '~/utils/niem/Namespace';
import type { Property } from '~/utils/niem/Property';
import type { Type } from '~/utils/niem/Type';

const { namespace } = defineProps<{
  namespace: Namespace,
  as: ContentsAsType }>();

type Params = APINamespaceParams & {
  slug: string
}

const params = useRoute().params as Params;
params.prefix = params.slug;

const toolbox = useToolboxStore();

// Set up reactive component lists so values can be added later
const properties: Ref<Property[]> = ref([]);
const types: Ref<Type[]> = ref([]);

// Reactive indicator for if the namespace has more properties that could be loaded
const hasMoreProperties = computed<boolean>(() => {
  return !namespace.propertiesLoaded;
})

// Reactive indicator for if the namespace has more types that could be loaded
const enableMoreTypes = computed<boolean>(() => {
  return !namespace.typesLoaded;
});

namespace.propertiesCount = 0;
namespace.typesCount = 0;

// Initial load
await loadMoreProperties();
await loadMoreTypes();

/**
 * Load the next page of properties.
 */
async function loadMoreProperties() {
  if (namespace.propertiesLoaded) return;
  if (!namespace.propertiesCount) namespace.propertiesCount = 0;

  let page = await toolbox.propertiesFromNamespace(namespace, properties.value.length);

  if (page.first) {
    namespace.propertiesCount = page.totalElements;
  }

  if (page.last) {
    namespace.propertiesLoaded = true;
  }

  properties.value.push(...page.content);
}

/**
 * Load the next page of types.
 */
async function loadMoreTypes() {
  if (namespace.typesLoaded) return;
  if (!namespace.typesCount) namespace.typesCount = 0;

  let page = await toolbox.typesFromNamespace(namespace, types.value.length);

  if (page.first) {
    namespace.typesCount += page.totalElements;
  }

  if (page.last) {
    namespace.typesLoaded = true;
  }

  types.value.push(...page.content);
}

</script>
