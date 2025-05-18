
<template>
  <EntityContents :as="as" :entity="type">

    <template #contents>
      <ContentTypeContents :type="type"/>
    </template>

    <template #usages>
      <ListProperties :properties="properties" :enable-more="hasMoreUsages"
          :total="usagesCount" @load-more="loadMoreUsages"/>
    </template>

    <template #children>
      <ListTypes v-if="type.childrenLoaded" :types="children" :total="children.length"/>
    </template>

  </EntityContents>
</template>

<script setup lang="ts">
import type { Property } from '~/utils/niem/Property';
import type { Type } from '~/utils/niem/Type';

const { type } = defineProps<{
  type: Type,
  as: ContentsAsType
}>();

const toolbox = useToolboxStore();

let properties: Ref<Property[]> = ref([]);

let children: Ref<Type[]> = ref([]);

children.value = await toolbox.children(type.params);
type.childrenCount = children.value.length;
type.childrenLoaded = true;

// Reactive indicator for if the type has more property usages that could be loaded
const hasMoreUsages = computed<boolean>(() => {
  return !type.usagesLoaded;
})

type.usagesCount = 0;

// Reactive usages count
const usagesCount = computed<number|undefined>(() => {
  return type.usagesCount;
})

// Initial load
await loadMoreUsages();

// Load the next page of property usages of this type
async function loadMoreUsages() {
  if (type.usagesLoaded) return;
  if (!type.qname) return;

  let page = await toolbox.usages(type.params, properties.value.length);

  if (page.first) {
    type.usagesCount = page.totalElements;
  }

  if (page.last) {
    type.usagesLoaded;
  }

  properties.value.push(...page.content);
}

</script>
