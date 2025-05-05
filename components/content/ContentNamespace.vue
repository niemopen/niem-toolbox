
<template>
  <EntityContents :as="as" :entity="namespace">

    <template #properties>
      <ListProperties :properties="properties" :enable-more="enableMoreProperties" @load-more="loadMoreProperties"/>
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

const properties: Ref<Property[]> = ref([]);
const types: Ref<Type[]> = ref([]);

const enableMoreProperties = computed<boolean>(() => {
  return !namespace.propertiesLoaded;
})

const enableMoreTypes = computed<boolean>(() => {
  return !namespace.typesLoaded;
});

namespace.propertiesCount = 0;
namespace.typesCount = 0;

// Initial load
await loadMoreProperties();
await loadMoreTypes();

async function loadMoreProperties() {
  if (namespace.propertiesLoaded) return;
  if (!namespace.propertiesCount) namespace.propertiesCount = 0;

  let results = await toolbox.propertiesFromNamespace(namespace, properties.value.length);
  if (results.length < API.PAGINATION_LIMIT) {
    namespace.propertiesLoaded = true;
  }
  namespace.propertiesCount += results.length;
  properties.value.push(...results);
}

async function loadMoreTypes() {
  if (namespace.typesLoaded) return;
  if (!namespace.typesCount) namespace.typesCount = 0;

  let results = await toolbox.typesFromNamespace(namespace, types.value.length);
  if (results.length < API.PAGINATION_LIMIT) {
    namespace.typesLoaded = true;
  }
  namespace.typesCount += results.length;
  types.value.push(...results);
}

</script>
