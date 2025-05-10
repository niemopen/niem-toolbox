
<template>
  <PageHeader :page="AppItems.browse">
    <template #preferences>
      <span class="mr-2 mb-2">Clear storage:</span>
      <UButton label="session" @click="resetSessionStorage" size="xs" class="mr-2"/>
      <UButton label="local" @click="resetLocalStorage" size="xs" class="mr-2"/>
      <UButton label="all" @click="resetAllStorage" size="xs"/>
    </template>
  </PageHeader>

  <UCard>
    <UTabs :items="items" v-model="activeTab" color="neutral" class="w-full" variant="link">

      <template #stewards>
        <ListStewards :stewards="stewards"/>
      </template>

      <template #models>
        <ListModels :models="models" :useLabelQualifier="true"/>
      </template>

      <!-- TODO: Highlights -->
      <!-- <template #highlights>
        <ContentPlaceholder label="highlights"/>
        <ContentModel as="list-item" :model="highlights"/>
      </template> -->

      <!-- TODO: Favorites -->
      <!-- <template #favorites>
        <ContentPlaceholder label="favorites"/>
        <ContentModel as="list-item" :model="favorites"/>
      </template> -->

      <!-- TODO: History -->
      <!-- <template #history>
        <ContentPlaceholder label="history"/>
        <ListProperties :properties="propertyHistory"/>
      </template> -->

    </UTabs>
  </UCard>
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui';

const activeTab = ref<"stewards"|"models"|"highlights"|"favorites">("stewards");

const toolbox = useToolboxStore();
// const { highlights, favorites, propertyHistory } = toolbox;

const stewards = await toolbox.stewards();
const models = await toolbox.models();

const router = useRouter();

const items = ref<TabsItem[]>([
  {
    label: "Stewards" + ToolboxApp.labelCount(stewards),
    icon: Icons.steward,
    slot: "stewards",
    value: "stewards"
  },
  {
    label: "Models" + ToolboxApp.labelCount(models),
    icon: Icons.model,
    slot: "models",
    value: "models"
  },
  // {
  //   label: "NIEM highlights",
  //   icon: Icons.niemopen,
  //   slot: "highlights",
  //   value: "highlights"
  // },
  // {
  //   label: "Favorites",
  //   icon: Icons.starFilled,
  //   slot: "favorites",
  //   value: "favorites"
  // },
  // {
  //   label: "History" + ToolboxApp.labelCount(propertyHistory),
  //   icon: Icons.history,
  //   slot: "history",
  //   value: "history"
  // }
]);

function resetLocalStorage() {
  toolbox.resetLocalStorage();
  router.go(0);
}

function resetSessionStorage() {
  toolbox.resetSessionStorage();
  router.go(0);
}

function resetAllStorage() {
  toolbox.$reset();
  router.go(0);
}

</script>
