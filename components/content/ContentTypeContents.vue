
<template>
  <UAccordion :items="contentsItems" type="multiple" :defaultValue="[type.qname || '']">
    <template #content="{ item }">
      <ListChildProperties :child-properties="item.childProperties" class="ml-6"/>
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
import type { ChildProperty } from '~/utils/niem/ChildProperty';
import type { Type } from '~/utils/niem/Type';

const { type } = defineProps<{ type: Type }>();

const toolbox = useToolboxStore();

let contentsItems: Ref<ContentsItem[]> = ref([]);

function loadContents(type: Type, category: ContentsCategory, childProperties: ChildProperty[], label: string) {

  if (childProperties.length == 0) return;
  if (!type.contentsCount) type.contentsCount = 0;

  type.contentsCount += childProperties.length;

  contentsItems.value.push({
    category,
    childProperties,
    type,
    icon: icons.contents,
    label: `${ label } (${ childProperties.length })`,
    value: type.qname
  })

}


// Add inherited properties
let bases = await toolbox.bases(type);

for (let base of bases) {
  let childProperties = await toolbox.childPropertiesOfType(base);
  loadContents(base, "inherited", childProperties, `Properties inherited by ${ base.qname }`);
}


// Add child properties
let childProperties = await toolbox.childPropertiesOfType(type);

loadContents(type, "inherited", childProperties, `Properties in ${ type.qname }`);


// Add augmentation properties
let augmentations = await toolbox.augmentations(type);

for (let augmentation of augmentations) {
  let augmentationType = await toolbox.type({
    ...augmentation.params,
    qname: augmentation.qname + "Type"
  })
  if (!augmentationType) continue;

  let childProperties = await toolbox.childPropertiesOfType(augmentationType);

  loadContents(augmentationType, "augmentation", childProperties, `Properties augmented by ${ augmentation.qname }`);
}


</script>