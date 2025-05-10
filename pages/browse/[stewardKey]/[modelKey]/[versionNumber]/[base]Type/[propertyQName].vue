
<template>
  <div>
    <ContentSubproperty v-if="subproperty" as="page" :subproperty="subproperty"/>
    <ContentNotFound v-else/>
  </div>
</template>

<script setup lang="ts">

type Params = APIVersionParams & {
  base: string,
  propertyQName: string
}

const params = useRoute().params as Params;

const subproperty = await Data.subproperty({
  ...params,
  typeQName: params.base + "Type"
});

</script>
