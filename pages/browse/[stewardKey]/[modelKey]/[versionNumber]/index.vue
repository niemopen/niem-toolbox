
<template>
  <div>
    <ContentVersion v-if="version" as="page" :version="version" :group-namespaces-by-category="groupNamespacesByCategory">
      <template #preferences>
        <UCheckbox v-model="groupNamespacesByCategory" label="Group namespaces by category?" class="py-4"/>
      </template>
    </ContentVersion>
    <ContentNotFound v-else/>
  </div>
</template>

<script setup lang="ts">

const params = useRoute().params as APIVersionParams;

const groupNamespacesByCategory = ref(true);

const version = await Data.version(params);

</script>