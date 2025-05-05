
<template>
  <Teleport defer to="#page-header">

    <div class="flex justify-between z-30">
      <!-- Header icon and title -->
      <ToolboxIconTitle :icon="page.icon || icons.error" :title="title" classes="page-header-title font-bold"/>

      <!-- Header buttons -->
      <span class="gap-1.5">
        <!-- LATER: Slot for NIEM version select box -->

        <!-- LATER: Slot for additional page buttons -->

        <UButtonGroup size="sm" id="page-header-buttons">
          <UTooltip v-for="panel in panels" :text="panel.label">

            <UButton
              color="neutral" variant="outline"
              :id="'btn-' + panel.value"
              :icon="panel.icon"
              :disabled="!$slots[panel.value]"
              :ui="ui"
              :class="[ activePanelID == panel.value ? 'open' : '', 'button-toggler']"
              @click="toggle"
            />
          </UTooltip>
        </UButtonGroup>
      </span>
    </div>

    <!-- Display user info, developer info, or preferences if clicked -->
    <div id="page-header-more" v-if="activePanel && activePanelID">
      <PageMore :icon="activePanel.icon || icons.error" :title="activePanel.label || ''" :slotName="activePanelID">
        <template #[activePanelID]>
          <slot :name="activePanelID"/>
        </template>
      </PageMore>
    </div>

  </Teleport>

</template>

<script setup lang="ts">

import { ref } from 'vue';

const { page, label = "" } = defineProps<{
  page: AppLinkType,
  label?: string
}>();

const title = label ? `[${ page.label }] ${ label }` : (page.label || "");

type PanelIDType = "user" | "developer" | "preferences";

const panels: AppLinkType[] = [
  {
    value: "user",
    label: "User information",
    icon: icons.info
  },
  {
    value: "developer",
    label: "Developer information",
    icon: icons.developer
  },
  {
    value: "preferences",
    label: "Page preferences",
    icon: icons.preferences
  }
]

const activePanelID: Ref<PanelIDType | undefined> = ref(undefined);

const activePanel: ComputedRef<AppLinkType|undefined> = computed(() => {
  return panels.find(panel => panel.value == activePanelID.value);
})

function toggle(e: Event) {
  const element = e.currentTarget as HTMLElement
  const selectedPanelID = element.id.replace("btn-", "") as PanelIDType;
  activePanelID.value = activePanelID.value == selectedPanelID ? undefined : selectedPanelID;
}

const ui = {
  base: "disabled:cursor-auto disabled:text-[var(--ui-text-dimmed)] disabled:hover:text-[var-(--ui-text-dimmed)] hover:text-[var(--ui-text-highlighted)]"
}

</script>

<style lang="scss">

// Style is unscoped to support styles on teleport.

#page-header {
  background-color: var(--ui-secondary);
  border: 1px solid gainsboro;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 10px 30px 10px 16px;
}

.page-header-title {
  margin-left: 12px;
}

#page-header button .button-toggler {
  background-color: white;
}

#page-header button.open {
  background-color: var(--ui-primary) !important;
}

#page-header button.open>.iconify {
  color: white;
}

</style>
