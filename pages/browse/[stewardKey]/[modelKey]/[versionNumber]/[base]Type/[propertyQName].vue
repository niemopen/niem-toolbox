
<template>
  <div>
    <ContentChildProperty v-if="childProperty" as="page" :child-property="childProperty"/>
    <ContentNotFound v-else/>
  </div>
</template>

<script setup lang="ts">

type Params = APIVersionParams & {
  base: string,
  propertyQName: string
}

const params = useRoute().params as Params;

const childProperty = await Data.childProperty({
  ...params,
  typeQName: params.base + "Type"
});

</script>
