
<template>
  <UTabs :items="items" color="neutral" variant="link">

    <template #default="{ item }">
      <span>{{ item.label }}</span>
    </template>

    <template #trailing="{ item }">
      <span class="text-dimmed text-sm" v-if="item.count">({{ item.count }})</span>
    </template>

    <template #substitutions>
      <ListProperties :properties="substitutions"/>
    </template>

    <template #properties>
      <ContentTypeContents v-if="type" :type="type" :property="property"
          @set-contents-count="setContentsCount" :path="path"/>
    </template>

    <template #facets>
      <TableTypeFacets v-if="type" :type="type"/>
    </template>

    <template #value>
      <ContentValue v-if="type" :type="type"/>
    </template>

  </UTabs>
</template>

<script setup lang="ts">
import type { Property } from '~/utils/niem/Property';
import type { Type } from '~/utils/niem/Type';

const { property, path = [] } = defineProps<{
  property: Property,
  path?: APIComponentRef[]
}>();

const emit = defineEmits(["setContentsCount"]);

path.push(property.ref);

const items: Ref<ToolboxTabsItem[]> = ref([]);

const toolbox = useToolboxStore();

let type: Type | undefined;

let substitutions: Property[] = [];

// Show substitutions
if (property.category == "abstract_element") {
  substitutions = await toolbox.substitutions(property.params);
  property.substitutionsCount = substitutions.length;
  items.value.push({
    label: "Substitutions",
    icon: Icons.substitution,
    slot: "substitutions",
    count: substitutions.length
  });
}

// Load property's type
if (property.type && property.type.route) {
  type = await toolbox.type(property.type?.route);
}

if (type) {
  // Show subproperties
  property.contentsCount = await toolbox.countSubproperties(type);
  if (property.contentsCount > 0) {
    items.value.push({
      label: "Properties",
      icon: Icons.property,
      slot: "properties"
    })
  }

// Show facets
  property.facetsCount = await toolbox.countFacets(type);
  if (property.facetsCount > 0) {
    items.value.push({
      label: "Facets",
      icon: Icons.facet,
      slot: "facets",
      count: property.facetsCount
    });
  }
}

// Show value
if (type && type.isSimpleContent && property.facetsCount == 0) {
  items.value.push({
    label: "Value",
    icon: Icons.value,
    slot: "value"
  })
}

if (substitutions.length == 0 && property.contentsCount == 0 && (!type || type.isComplexContent)) {
  // No content
  items.value.push({
    label: "Contents",
    icon: Icons.empty,
    slot: "empty",
    count: 0
  })
}

/**
 * Set the contents count, including the counts of properties in base and augmentation types.
 */
function setContentsCount(count: number) {
  emit("setContentsCount", count);
  let item = items.value.find(item => item.slot == "properties");
  if (item) {
    item.count = count;
  }
}

</script>
