
<template>
  <div>
    <ListTypes :types="types" :enable-more="false" :highlight-property="property"/>
  </div>
</template>

<script setup lang="ts">
import type { Subproperty } from '~/utils/niem/Subproperty';
import type { Property } from '~/utils/niem/Property';
import { Type } from '~/utils/niem/Type';

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

types = types.sort(Type.sort);

property.usagesCount = subproperties.length;

</script>
