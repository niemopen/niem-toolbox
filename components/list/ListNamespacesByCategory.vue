
<template>
  <UAccordion type="multiple" :items="namespaceCategoryItems">
    <template #default="{ item }">
      <div class="capitalize">
        {{ item.label }}
      </div>
    </template>

    <template #body="{ item }">
      <ListTemplate :entities="item.namespaces" class="pl-4" :disableExpand="true" :useLabelQualifier="true"/>
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
import { Namespace } from '~/utils/niem/Namespace';
import type { AccordionItem } from '@nuxt/ui';

const { namespaces = [] } = defineProps<{ namespaces?: Namespace[] }>();

// Unique list of namespace categories
const namespaceCategories = [
  ...new Set(namespaces.map(namespace => namespace.category))
]
.filter(namespaceCategory => namespaceCategory != undefined)
.sort(Namespace.sortCategories);

type NamespaceCategoryItem = AccordionItem & {
  namespaces: Namespace[]
}

// Accordion items for each namespace category
const namespaceCategoryItems: NamespaceCategoryItem[] = namespaceCategories.map(category => {
  let filteredNamespaces = namespaces
    .filter(namespace => namespace.category == category)
    .sort(Namespace.sort)

  return {
    icon: icons.namespace,
    label: `${category} (${filteredNamespaces.length})`,
    namespaces: filteredNamespaces
  }
})

// Additional accordion item for namespaces with an undefined category
const undefinedNamespaces = namespaces.filter(namespace => namespace.category == undefined);

if (undefinedNamespaces.length > 0) {
  namespaceCategoryItems.push({
    icon: icons.namespace,
    label: `[undefined] ${undefinedNamespaces.length}`,
    namespaces: undefinedNamespaces
  })
}


</script>
