
<template>
  <ListTemplate :entities="namespaces" :disableExpand="true" :useLabelQualifier="useLabelQualifier"/>
</template>

<script setup lang="ts">
import { Namespace } from '~/utils/niem/Namespace';

const { namespaces = [], useLabelQualifier = false } = defineProps<{
  namespaces?: Namespace[],
  useLabelQualifier?: boolean
}>();

</script>
