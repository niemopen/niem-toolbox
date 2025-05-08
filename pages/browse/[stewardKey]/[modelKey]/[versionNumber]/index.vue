
<template>
  <div>
    <ContentVersion v-if="version" as="page" :version="version"
        :group-namespaces-by-category="groupNamespacesByCategory"
        :show-namespace-names="showNamespaceNames">
      <template #preferences>
        <UCheckbox v-model="groupNamespacesByCategory" label="Group namespaces by category?" class="pt-2"/>
        <UCheckbox v-model="showNamespaceNames" label="Show namespace names?" class="py-1"/>
      </template>
    </ContentVersion>
    <ContentNotFound v-else/>
  </div>
</template>

<script setup lang="ts">

const params = useRoute().params as APIVersionParams;

const groupNamespacesByCategory = ref(true);
const showNamespaceNames = ref(false);

const version = await Data.version(params);

</script>