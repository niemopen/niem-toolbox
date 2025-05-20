
<template>
  <PageHeader :page="AppItems.search">
    <template #developer>
      <div v-if="route">
        <div class="font-medium">Route:</div>
        <div>{{ route }}</div>
      </div>
      <div v-else>
        Perform a search to see the route used to get results...
      </div>
    </template>
  </PageHeader>

  <UCard>
    <div class="flex flex-row flex-nowrap gap-2 divide-x divide-gray-300 min-h-[500px]">
      <div id="panel-search" class="basis-2/5 panel pr-4">

        <!-- Search criteria panel -->
        <div class="font-semibold pb-2">Search criteria</div>
        <USeparator/>

        <div class="spaced mt-4">

          <!-- Search scope -->
          <URadioGroup name="scope" :items="scopes" v-model="scope" default-value="Properties"
              legend="Scope" variant="table" orientation="horizontal" indicator="hidden"
              :ui="{item: 'py-2 px-3'}"/>

          <!-- Select NIEM version -->
          <UFormField label="Select NIEM Version">
            <USelect
                :icon="Icons.version"
                v-model="toolbox.config.selectedNIEMVersionNumber"
                :items="niemVersionItems"/>
          </UFormField>

          <!-- Search tokens -->
          <ToolboxInput v-model="tokens" :name="tokens"
              :icon="Icons.search"
              label="Search tokens"
              help="Example: 'arm' returns components with 'Arm' and 'Armed' but does not return 'Alarm' or 'Firearm'."
              @clear="tokens=''"/>

          <!-- Search button -->
          <UButton color="primary" @click="search">Search</UButton>

          <!-- Search substrings -->
          <ToolboxInput v-model="substrings" name="substrings"
              :icon="Icons.search"
              label="Search substrings"
              help="Example: 'arm' returns all matches, including 'Arm', 'Armed', 'Alarm', 'Firearm', etc."
              @clear="substrings=''"/>

          <!-- Search type names -->
          <ToolboxInput v-if="scope == 'Properties'" v-model="typeNames" name="typeNames"
              :icon="Icons.type"
              label="Search type names"
              help="Example: 'person official' will restrict results to properties with 'person' or 'official' in the name of their type."
              @clear="typeNames=''"/>

          <!-- Search namespace prefixes -->
          <ToolboxInput v-model="prefixes" name="prefixes"
              :icon="Icons.namespace"
              label="Search namespace prefixes"
              help="Example: 'nc j' will restrict results to properties in Core or the Justice domain."
              @clear="prefixes=''"/>

          <UFormField label="Include:">
            <UCheckbox name="includeElements" label="Elements" v-model="includeElements"/>
            <UCheckbox name="includeAttributes" label="Attributes" v-model="includeAttributes"/>
            <UCheckbox name="includeConcrete" label="Concrete" v-model="includeConcrete"/>
            <UCheckbox name="includeAbstract" label="Abstract" v-model="includeAbstract"/>
          </UFormField>

        </div>
          <!-- <UAccordion :items="accordion" type="multiple">
            <template #default="{ item }">
              <UButton @click="selectedItem = item.label + ' from header'">ADD</UButton>
              {{ item.label }}
            </template>
            <template #content="{ item }">
              <p class="pb-3.5 text-sm text-muted">
                {{ item.content }}
                <br/>
                <UButton class="mt-2" @click="selectedItem = item.label">></UButton>
              </p>
            </template>
          </UAccordion> -->
      </div>

      <!-- Results panel -->
      <div id="panel-results" class="basis-2/5 grow panel pl-4">
        <div class="font-semibold pb-2">Results</div>
        <USeparator class="pb-4"/>

        <ListProperties :properties="properties" :enable-more="true"/>

        <!-- <div v-for="property in properties" :key="property.id" class="divider-y">
          <div class="flex flex-row w-full" v-if="property.qname">
            <UButton :icon="Icons.more" @click="property.expand=!property.expand" :class="UI.button_icon"/>

            <ULink @click="console.log('clicked', property.qname)" class="mr-1 font-medium text-sm text-indigo-800">{{ property.qname }}</ULink>
            <ULink @click="console.log('clicked', 'nc:TextType')" class="font-light text-sm">({{ 'nc:TextType' }})</ULink>

            <UButton @click="property.expand = !property.expand" class="grow justify-end" :ui="UI.button_invisible"/>
            <UButton :icon="Icons.add" @click="selectedItem=property.qname" :class="UI.button_icon"/>
          </div>

          <div :class="property.expand">
            <p>{{ property.definition }}</p>
            <ul class="border-l ml-8">
              <li>-- nc:PersonName</li>
              <li>-- nc:PersonBirthDate</li>
              <li>-- nc:PersonAgeMeasure</li>
            </ul>
          </div>
        </div> -->
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { RadioGroupItem, RadioGroupValue, SelectItem } from '@nuxt/ui';
import type { Property } from '~/utils/niem/Property';

const toolbox = useToolboxStore();

// TODO: Replace with a dynamic list
let niemVersions = ["6.0", "5.2", "5.1", "5.0", "4.2", "4.1", "4.0", "3.2", "3.1", "3.0", "2.1", "2.0", "1.0"];

let niemVersionItems: SelectItem[] = niemVersions.map(version => {
  return {
    value: version,
    label: version,
    type: 'item'
  }
});

let scope = ref<RadioGroupValue>("Properties");
let scopes = ref<RadioGroupItem[]>(["Properties", "Types"]);

let tokens = ref("");
let substrings = ref("");
let typeNames = ref("");

let matchMode = ref("substring");
let prefixes = ref("");
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

let selectedItem = ref("PROPERTY");

let total = ref(0);
let subtotal = ref(0);
let properties: Ref<Property[]> = ref([]);
let loaded = ref(false);

let route = ref("");

async function search() {

  let options: SearchPropertiesOptions = {
    token: asArray(tokens.value),
    niemVersionNumber: toolbox.config.selectedNIEMVersionNumber,
    substring: asArray(substrings.value),
    type: asArray(typeNames.value),
    prefix: asArray(prefixes.value)
  };

  route.value = Search.route(options);

  let page = await Search.properties(options);

  if (page.first) {
    total.value = page.totalElements;
  }

  if (page.last) {
    loaded.value = true;
  }

  subtotal.value += page.numberOfElements;

  properties.value = page.content;

}

function asArray(text: string) {
  text = text.trim();
  if (text == "") {
    return [];
  }
  return text.replaceAll(",", " ").split(" ");
}

</script>
