
<template>
  <div>
    <ContentNamespace v-if="namespace" :namespace="namespace" as="page"/>
    <ContentProperty v-else-if="property" :property="property" as="page"/>
    <ContentType v-else-if="type" :type="type" as="page"/>
    <ContentNotFound v-else/>
  </div>
</template>

<script setup lang="ts">
import type { Namespace } from '~/utils/niem/Namespace';
import type { Property } from '~/utils/niem/Property';
import type { Type } from '~/utils/niem/Type';

const route = useRoute();

type RouteParamsType = APIVersionParams & {
  slug: string
}

const params = route.params as RouteParamsType;
const slug = params.slug as string;

let namespace: Namespace | undefined;
let property: Property | undefined;
let type: Type | undefined;

const toolbox = useToolboxStore();

if (slug.includes(":")) {
  let [prefix, qname] = slug.split(":");
  if (slug.endsWith("Type") || ToolboxApp.TYPE_PREFIXES.includes(prefix)) {
    type = await toolbox.type({...params, qname: slug});
  }
  else {
    property = await toolbox.property({...params, qname: slug});
  }
}
else {
  namespace = await toolbox.namespace({...params, prefix: slug});
}

</script>
