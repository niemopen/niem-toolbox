
<template>
  <div>
    <UTable :data="data" :columns="columns"/>
    <ListTypes :types="types" :enable-more="false" :highlight-property="property"/>
  </div>
</template>

<script setup lang="ts">
import type { Subproperty } from '~/utils/niem/Subproperty';
import type { Property } from '~/utils/niem/Property';
import type { TableColumn } from '@nuxt/ui';
import type { Type } from '~/utils/niem/Type';

const { property } = defineProps<{
  property: Property
}>();

const toolbox = useToolboxStore();

let subproperties: Subproperty[] = await toolbox.subpropertiesWithProperty(property);
let types: Type[] = [];

for (let subproperty of subproperties) {
  if (subproperty.type) {
    let type = await toolbox.type(subproperty.type.route);
    if (type) {
      types.push(type);
    }
  }
}

property.usagesCount = subproperties.length;


console.log("SUBPROPERTY OCCURRENCES", property.params, subproperties);

const columns: TableColumn<SubpropertyTableRow>[] = [
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "property",
    header: "Property"
  },
  {
    accessorKey: "min",
    header: "Min"
  },
  {
    accessorKey: "max",
    header: "Max"
  }
]

type SubpropertyTableRow = {
  type: string | undefined,
  property: string | undefined,
  min: string | undefined,
  max: string | undefined
}

const data: SubpropertyTableRow[] = subproperties.map(subproperty => {
  return {
    type: subproperty.type?.qname,
    property: subproperty.property?.qname,
    min: subproperty.min ,
    max: subproperty.max
  }
})

console.log("DATA", data);

</script>
