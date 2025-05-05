
<template>
  <ListTemplate :entities="versions" :disableExpand="true"/>
</template>

<script setup lang="ts">
import { Version } from '~/utils/niem/Version';

defineProps<{
  versions: Version[]
}>();

</script>