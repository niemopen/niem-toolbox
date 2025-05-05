
<template>
  <div>

    <!-- Entity not found -->
    <div v-if="!entity">
      <ContentNotFound/>
    </div>

    <!-- Entity as page -->
    <EntityPage v-else-if="as=='page'" :entity="entity">

      <template v-for="tabsItem in entity.tabsItems" #[tabsItem.slot]>
        <slot :name="tabsItem.slot"/>
      </template>

      <template v-for="panel in ToolboxApp.PAGE_PANEL_NAMES" #[panel]>
        <slot :name="panel"/>
      </template>

    </EntityPage>

    <!-- Entity as list item -->
    <UTabs v-else-if="as=='list-item'" :items="entity.tabsItems" color="neutral" variant="link">
      <template #trailing="{ item }">
        <span v-if="item.count">({{ item.count }}{{ item.more ? "+" : "" }})</span>
      </template>

      <template #default="{ item, index }">
        {{ entity.tabsItems[index].label }}
      </template>
      <template v-for="tabsItem in entity.tabsItems" #[tabsItem.slot]>
        <slot :name="tabsItem.slot"/>
      </template>
    </UTabs>

    <!-- Entity as tree -->
    <ContentTypeContents v-else-if="as=='tree' && entity['@type']=='Type'" :type="entity as Type"/>

  </div>

</template>

<script setup lang="ts">
import type { Entity } from '~/utils/niem/Entity';
import type { Type } from '~/utils/niem/Type';

const { entity, as } = defineProps<{
  as: ContentsAsType,
  entity: Entity
}>();

</script>
