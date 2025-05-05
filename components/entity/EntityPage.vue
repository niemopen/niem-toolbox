
<template>
  <div>
    <PageHeader :page="entity.page" :label="entity.label">
      <template #user v-if="$slots.user">
        <slot name="user"/>
      </template>
      <template #developer v-if="$slots.developer">
        <slot name="developer"/>
      </template>
      <template #preferences v-if="$slots.preferences">
        <slot name="preferences"/>
      </template>
    </PageHeader>

    <UCard>

      <UBreadcrumb v-if="entity.breadcrumbs" :items="entity.breadcrumbs" class="-mt-2 mb-5 ml-3">
        <template #separator>
          <span class="mx-1 text-[var(--ui-text-muted)]">/</span>
        </template>
      </UBreadcrumb>

      <div v-if="entity">
        <UTabs :items="updatedTabsItems" color="neutral" variant="link">

          <template #trailing="{ item }">
            <span v-if="item.count">({{ item.count }}{{ item.more ? "+" : "" }})</span>
          </template>

          <template #details>
            <InfoTable :data="entity.infoItems"/>
          </template>

          <template v-for="tabsItem in entity.tabsItems" #[tabsItem.slot]>
            <slot :name="tabsItem.slot"/>
          </template>
        </UTabs>

      </div>

      <div v-else>
        <ContentNotFound/>
      </div>

    </UCard>

    <div class="flex justify-between mt-2 pl-6 pr-2">
      <span>
        <UButton v-if="previousInList" :to="previousInList.to" :leading-icon="icons.left" :label="previousInList.label" color="neutral" variant="link" class="hover:bg-transparent"/>
      </span>

      <span>
        <UButton v-if="nextInList" :to="nextInList.to" :trailing-icon="icons.right" :label="nextInList.label" color="neutral" variant="link" class="hover:bg-transparent"/>
      </span>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { Entity } from '~/utils/niem/Entity';

const { entity } = defineProps<{
  entity: Entity
}>();

const updatedTabsItems: ToolboxTabsItem[] = [
  {
    icon: icons.info,
    label: "Details",
    slot: "details"
  },
  ...entity?.tabsItems || []
];


const router = useRouter();
const historyState = router.options.history.state as HistoryState;

const toolbox = useToolboxStore();

let { previousInList, nextInList } = await navigationLinks();

async function navigationLinks() {
  let previousInList: Entity | undefined;
  let nextInList: Entity | undefined;

  if (entity['@type'] == "Steward" && "stewardKey" in entity) {
    // Entity is steward in list of all stewards
    const stewards = await toolbox.stewards();
    let index = stewards.findIndex(steward => steward.stewardKey == entity.stewardKey);
    if (index > 0) {
      previousInList = stewards.at(index-1);
    }
    if (index < stewards.length) {
      nextInList = stewards.at(index+1);
    }
  }

  return { previousInList, nextInList };
}

defineShortcuts({
  arrowleft: () => {
    if (previousInList) {
      router.push(previousInList.to);
    }
  },
  arrowright: () => {
    if (nextInList) {
      router.push(nextInList.to);
    }
  }
});

</script>
