
<template>
  <NuxtLayout>
    <template #header>
      <PageHeader :link="links.search"/>
    </template>

    <div class="flex flex-row flex-nowrap gap-2 divide-x divide-gray-300 h-[500px]">
      <div id="panel-search" class="basis-1/5 panel">

        <h3>SEARCH</h3>
        <USeparator/>
        <span>{{ terms }}</span>

        <div class="spaced mt-4">
          <UFormField label="Select NIEM Version">
            <!-- <USelect v-model="toolbox.config.selectedNIEMVersionNumber" :items="['3.0','4.2','5.2']"/> -->
            <USelect v-model="toolbox.config.selectedNIEMVersionNumber" :items="toolbox.niemVersionNumbers"/>
          </UFormField>

          <ToolboxInputClear v-model="terms" placeholder="Search terms" name="terms" @clear="terms=''"/>

          <UInput name="typeTerms" placeholder="Search type terms" v-model="typeTerms"/>
          <UInput name="prefixes" placeholder="Search namespace prefixes" v-model="prefixes"/>

          <URadioGroup name="matchMode" v-model="matchMode" :items="matchModeItems" legend="Match mode"/>

          <UFormField label="Include:">
            <UCheckbox name="includeElements" label="Elements" v-model="includeElements"/>
            <UCheckbox name="includeAttributes" label="Attributes" v-model="includeAttributes"/>
            <UCheckbox name="includeConcrete" label="Concrete" v-model="includeConcrete"/>
            <UCheckbox name="includeAbstract" label="Abstract" v-model="includeAbstract"/>
          </UFormField>

          <UButton color="primary">Search</UButton>
        </div>
          <!-- <UAccordion :items="accordion" type="multiple">
            <template #default="{ item }">
              <UButton @click="selectedItem = item.label + ' from header'">ADD</UButton>
              {{ item.label }}
            </template>
            <template #content="{ item }">
              <p class="pb-3.5 text-sm text-[var(--ui-text-muted)]">
                {{ item.content }}
                <br/>
                <UButton class="mt-2" @click="selectedItem = item.label">></UButton>
              </p>
            </template>
          </UAccordion> -->
      </div>

      <div id="panel-results" class="basis-2/5 grow panel">
        <h3>RESULTS</h3>
        <USeparator/>
        <div v-for="property in properties" :key="property.id" class="divider-y">
          <div class="flex flex-row w-full">
            <UButton :icon="icons.more" @click="property.expand=!property.expand" :class="UI.button_icon"/>

            <ULink @click="console.log('clicked', property.qname)" class="mr-1 font-medium text-sm text-indigo-800">{{ property.qname }}</ULink>
            <ULink @click="console.log('clicked', 'nc:TextType')" class="font-light text-sm">({{ 'nc:TextType' }})</ULink>

            <UButton @click="property.expand = !property.expand" class="grow justify-end" :ui="UI.button_invisible"/>
            <UButton :icon="icons.add" @click="selectedItem=property.qname" :class="UI.button_icon"/>
          </div>

          <div :class="property.expand">
            <p>{{ property.definition }}</p>
            <ul class="border-l ml-8">
              <li>-- nc:PersonName</li>
              <li>-- nc:PersonBirthDate</li>
              <li>-- nc:PersonAgeMeasure</li>
            </ul>
          </div>
        </div>
      </div>

      <div id="panel-item" class="basis-2/5 panel">
        <h3>ITEMS</h3>
        <USeparator/>
        {{ selectedItem }}
      </div>
    </div>

  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Property } from '~/utils/niem/Property';


const toolbox = useToolboxStore();

let terms = ref("default");
let matchMode = ref("substring");
let prefixes = ref("");
let typeTerms = ref("");
let includeElements = ref(true);
let includeAttributes = ref(true);
let includeAbstract = ref(true);
let includeConcrete = ref(true);


let matchModeItems = ref([
  {
    label: "Substring",
    value: "substring"
  },
  {
    label: "Token",
    value: "token"
  },
]);


let offset = ref(0);

// const selectedNIEMVersion = toolbox.selectedNIEMVersion;

let properties: Property[] = [];


let selectedItem = ref("PROPERTY");


</script>

<style lang="scss" scoped>

.panel {
  height: 100%;
}

</style>
