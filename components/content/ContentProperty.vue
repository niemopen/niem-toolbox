
<template>
  <EntityContents :as="as" :entity="property">

    <template #contents>
      <ContentPropertyContents :property="property" @set-contents-count="setContentsCount"/>
    </template>

    <template #usages>
      <ListSubpropertiesWithProperty :property="property"/>
      <ListProperties :properties="groups" :total="groups.length"/>
    </template>

  </EntityContents>
</template>

<script setup lang="ts">
import type { Subproperty } from '~/utils/niem/Subproperty';
import type { Property } from '~/utils/niem/Property';

const { property } = defineProps<{
  property: Property,
  as: ContentsAsType
}>();

const toolbox = useToolboxStore();

let usages: Subproperty[] = await toolbox.subpropertiesWithProperty(property);

let groups: Property[] = await toolbox.groups(property.params);

property.usagesCount = usages.length + groups.length;

const count = computed<number | undefined>(() => {
  return property.contentsCount;
});

function setContentsCount(count: number) {
  property.contentsCount = count;
  // @ts-ignore
  let item = property.tabsItems.find(item => item.slot == "contents");
  if (item) {
    item.count = count;
  }
}

</script>
