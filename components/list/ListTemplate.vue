
<template>
  <div>
    <UAccordion :items="entities" type="multiple" :ui="ui" :disabled="disableExpand">

      <!-- Accordion item header -->
      <template #default="{ item, index }" >

          <!-- Link to item -->
          <UBadge v-if="item.highlight" :color="item.highlight" variant="subtle">
            <ToolboxLink :link="{ label: item.label, to: item.to, labelClasses: 'align-middle text-sm' }"/>
          </UBadge>
          <ToolboxLink v-else :link="{ label: item.label, to: item.to, labelClasses: 'align-middle text-sm' }"/>

          <!-- Popover info -->
          <UPopover mode="hover" :content="{side: 'right'}" :open-delay="700">
            <UButton :icon="Icons.info" color="neutral" variant="ghost" class="align-middle text-muted"/>
            <template #content>
              <InfoTable :data="item.infoItems" width-class="w-[600px]"/>
            </template>
          </UPopover>

          <!-- Badge -->
          <UBadge v-if="item.badgeLabel" :label="item.badgeLabel" size="sm" :variant="item.badgeVariant || 'subtle'" :color="item.badgeColor || 'neutral'" class="ml-1 font-light align-middle"/>

          <span v-if="useLabelQualifier && item.labelQualifier" class="ml-1 align-middle">
            <span class="mr-1"> - </span>
            <span>{{ item.labelQualifier }}</span>
          </span>

      </template>

      <!-- Accordion item body -->
      <template #body="{ item, index }">
        <div class="ml-5 mb-2">

          <!-- Description -->
          <p v-if="item.documentation" class="mb-4">{{ item.documentation }}</p>

          <slot name="default" :item="item"/>

        </div>
      </template>

    </UAccordion>

    <!-- More button and loaded items count -->
    <div v-if="enableMore && entities.length >= API.PAGINATION_LIMIT">
      <USeparator class="py-4"/>
      <div class="flex justify-between">
        <div>
          <span>{{ entities.length }}</span>
          <span v-if="total"> of {{ total }}</span>
          <span> items loaded</span>
        </div>
        <UButton
            v-if="total==undefined || entities.length < total"
            label="More" :trailing-icon="Icons.down" @click="$emit('loadMore')"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends APIEntity">
import type { Entity } from '~/utils/niem/Entity';

const {
  entities,
  disableExpand=false,
  useLabelQualifier=false,
  enableMore=false
} = defineProps<{
  entities: Entity[],
  disableExpand?: boolean,
  useLabelQualifier?: boolean,
  enableMore?: boolean,
  total?: number
}>();

defineEmits(["loadMore"]);

let ui = {
  leadingIcon: "size-4",
  trailingIcon: disableExpand ? "invisible" : ""
}

</script>