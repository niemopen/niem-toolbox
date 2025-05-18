
<template>
  <div>
    <ContentLoading v-if="loading"/>

    <div v-else>
      <!-- Current path -->
      <div v-if="path.length > 1" class="p-2 rounded-lg bg-muted text-dimmed text-xs">
        <ToolboxCopy :text="path.map(ref => ref.qname).join(' > ')"/>
      </div>

      <!-- Contents -->
      <UAccordion :items="contentsItems" type="multiple" :defaultValue="[type.qname || '']">
        <template #trailing="{ item }">
          <!-- Type qname as link or text -->
          <span v-if="item.category == 'children'" class="font-semibold"> {{ item.type.qname }}</span>
          <ULink v-else :to="item.type.toolboxRoute" class="font-semibold">
            {{ item.type.qname }}
          </ULink>

          <!-- Subproperty count -->
          <span class="text-dimmed"> ({{ item.subproperties.length }})</span>
        </template>

        <template #content="{ item }">
          <ListSubproperties :subproperties="item.subproperties" :path="path" class="ml-6"/>
        </template>
      </UAccordion>

      <!-- <TableTypeFacets :type="type"/> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Property } from '~/utils/niem/Property';
import type { Subproperty } from '~/utils/niem/Subproperty';
import type { Type } from '~/utils/niem/Type';

const { type, path = [], highlightProperty, property } = defineProps<{
  type: Type
  path?: APIComponentRef[],
  highlightProperty?: Property,
  property?: Property
}>();

const emit = defineEmits(["setContentsCount"]);

const toolbox = useToolboxStore();

let contentsItems: Ref<ContentsItem[]> = ref([]);

const loading = ref(true);

type.contentsCount = 0;

// Add type to the path if this is the initial entrypoint
if (path.length == 0) {
  path.push(type.ref);
}

// Add inherited properties
let bases = await toolbox.bases(type.params);

for (let base of bases) {
  let subproperties = await toolbox.subproperties(base);
  loadContents(base, "inherited", subproperties, `Inherited properties from`);
  type.contentsCount += subproperties.length;
}


// Add immediate subproperties and set the background of the matching subproperty
let subproperties = await toolbox.subproperties(type);
highlightMatchingProperty(subproperties);
loadContents(type, "children", subproperties, `Properties from`);
type.contentsCount += subproperties.length;

// Add augmentation subproperties
let augmentations = await toolbox.augmentations(type);

for (let augmentation of augmentations) {
  let augmentationType = await toolbox.type({
    ...augmentation.params,
    qname: augmentation.qname + "Type"
  })
  if (!augmentationType) continue;

  let subproperties = await toolbox.subproperties(augmentationType);
  loadContents(augmentationType, "augmentation", subproperties, `Augmented properties from `);
  type.contentsCount += subproperties.length;
}

loading.value = false;
emit("setContentsCount", type.contentsCount);

if (property) {
  property.contentsCount = type.contentsCount;
}


/**
 * Adds a entry to the contentsItems array for the contents of a base type, the given type,
 * or an augmentation type.
 */
function loadContents(type: Type, category: ContentsCategory, subproperties: Subproperty[], label: string) {

  if (subproperties.length == 0) return;

  contentsItems.value.push({
    category,
    subproperties: subproperties,
    type,
    icon: Icons.contents,
    label: label,
    value: type.qname
  })

}


/**
 * For the given list of subproperties, set the background of the property
 * that matches the given property to highlight.
 *
 * Note: This helps to visually distinguish the occurrences of the original property
 * in the property usages tabs from the other properties the types also contain.
 */
function highlightMatchingProperty(subproperties: Subproperty[]) {
  // Reset in existing highlights and highlight the matching property if given
  for (let subproperty of subproperties) {
    subproperty.highlight = undefined;
    if (highlightProperty && subproperty.property?.route == highlightProperty.route) {
      subproperty.highlight = "warning";
    }
  }
}

</script>