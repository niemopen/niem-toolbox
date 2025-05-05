
<template>
  <ListTemplate :entities="namespaces" :disableExpand="true" :useLabelQualifier="true"/>
</template>

<script setup lang="ts">
import { Namespace } from '~/utils/niem/Namespace';

const { namespaces = [] } = defineProps<{
  namespaces?: Namespace[]
}>();

</script>
