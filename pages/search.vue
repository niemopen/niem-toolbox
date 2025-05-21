
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
          <URadioGroup name="radio-scope" :items="scopeItems" v-model="scope"
              legend="Scope" variant="table" orientation="horizontal" indicator="hidden"/>

          <!-- Select NIEM version -->
          <UFormField label="Select NIEM Version">
            <USelect class="w-38" :icon="Icons.version"
                v-model="toolbox.config.selectedNIEMVersionNumber" :items="niemVersionItems"/>
          </UFormField>

          <!-- Search tokens -->
          <ToolboxInput v-model="tokens" :name="tokens" :icon="Icons.search"
              label="Search tokens"
              help="Example: 'arm' returns components with 'Arm' and 'Armed' but does not return 'Alarm' or 'Firearm'."
              @clear="tokens=''" @keyup.enter="search" @keyup.esc="tokens=''"/>

          <div class="flex justify-between">
            <!-- Search button -->
            <UButton color="primary" @click="search">Search</UButton>

            <!-- Reset button -->
            <UButton color="neutral" variant="subtle" @click="reset">Reset</UButton>
          </div>

          <!-- Search substrings -->
          <ToolboxInput v-model="substrings" name="substrings" :icon="Icons.search"
              label="Search substrings"
              help="Example: 'arm' returns all matches, including 'Arm', 'Armed', 'Alarm', 'Firearm', etc."
              @clear="substrings=''" @keyup.enter="search" @keyup.esc="substrings=''"/>

          <!-- Search type names -->
          <ToolboxInput v-if="scope == 'Properties'" v-model="typeNames" name="typeNames"
              :icon="Icons.type"
              label="Search type names"
              help="Example: 'eye color' will restrict results to properties with both 'eye' and 'color' in their type names."
              @clear="typeNames=''" @keyup.enter="search" @keyup.esc="typeNames=''"/>

          <!-- Search namespace prefixes -->
          <ToolboxInput v-model="prefixes" name="prefixes"
              :icon="Icons.namespace"
              label="Search namespace prefixes"
              help="Example: 'nc j' will restrict results to properties in Core or the Justice domain."
              @clear="prefixes=''" @keyup.enter="search" @keyup.esc="prefixes=''"/>

          <!-- Search namespace categories -->
          <UFormField label="Search namespace categories">
            <USelect multiple class="w-full" :icon="Icons.namespace"
                v-model="namespaceCategories" :items="namespaceCategoryItems"/>
          </UFormField>

          <!-- Properties: Select elements vs attribute -->
          <URadioGroup v-if="scope == 'Properties'" name="radio-elementsAttributes"
              :items="elementAttributeItems" v-model="elementAttribute"
              variant="table" orientation="horizontal" indicator="hidden"/>

          <!-- Properties: Select concrete vs abstract -->
          <URadioGroup v-if="scope == 'Properties'" name="radio-concretesAbstract"
              :items="concreteAbstractItems" v-model="concreteAbstract"
              variant="table" orientation="horizontal" indicator="hidden"/>

          <!-- Sort order for results -->
          <UFormField label="Sort results by">
            <USelect :icon="Icons.sort" v-model="sort" :items="sortItems" value-key="id"
                class="w-full"/>
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
        <div class="flex justify-between">
          <span class="font-semibold pb-2">Results</span>
          <span v-if="total" class="text-sm text-dimmed">({{ subtotal }} of {{ total }})</span>
        </div>
        <USeparator class="pb-4"/>

        <ListProperties v-if="scope=='Properties'" :properties="properties"
            :enable-more="!loaded" @load-more="more"/>

        <ListTypes v-else :types="types" :enable-more="!loaded" @load-more="more"/>

        <UCard v-if="empty" class="bg-warning/10">
          <p class="pb-2">No results found.</p>

          <p>Search functionality is still in progress and some matches may be missing at this time.</p>
        </UCard>

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
import type { Type } from '~/utils/niem/Type';
import type { ScopeType, SortType } from '~/utils/Search';

const toolbox = useToolboxStore();

const {
  getPropertyResults,
  getTypeResults,
  addPropertyResults,
  addTypeResults,
  resetPropertyResults,
  resetTypeResults
} = toolbox;

// TODO: Replace with a dynamic list
let niemVersions = ["6.0", "5.2", "5.1", "5.0", "4.2", "4.1", "4.0", "3.2", "3.1", "3.0", "2.1", "2.0", "1.0"];

let niemVersionItems: SelectItem[] = niemVersions.map(version => {
  return {
    value: version,
    label: version,
    type: 'item'
  }
});

// @ts-ignore
let scope: Ref<ScopeType> = ref<RadioGroupValue>("Properties");
let scopeItems = ref<RadioGroupItem[]>(["Properties", "Types"]);

let tokens = ref("");
let substrings = ref("");
let typeNames = ref("");
let prefixes = ref("");

// @ts-ignore
let elementAttribute: Ref<"All" | "Elements" | "Attributes"> = ref<RadioGroupValue>("All");
let elementAttributeItems = ref<RadioGroupItem[]>(["All", "Elements", "Attributes"]);

// TODO: Handle invalid state of Attribute + Abstract

// @ts-ignore
let concreteAbstract: Ref<"All" | "Concrete" | "Abstract"> = ref<RadioGroupValue>("All");
let concreteAbstractItems = ref<RadioGroupItem[]>(["All", "Concrete", "Abstract"]);

// TODO: Add additional namespace categories
let namespaceCategories: Ref<string[]> = ref([]);
let namespaceCategoryItems = ref(["core", "domain", "code", "adapter", "auxiliary", "external"]);

let sortItems: SelectItem[] = [
  {
    type: 'label',
    label: "QNames (prefix then name)"
  },
  {
    id: "rank_qname",
    label: "Namespace rank and qname",
    icon: Icons.sort
  },
  {
    id: "score_qname",
    label: "Score and qname",
    icon: Icons.sort
  },
  {
    id: "qname",
    label: "QName",
    icon: Icons.sort
  },
  {
    type: 'separator'
  },
  {
    type: 'label',
    label: "Names"
  },
  {
    id: "rank_name",
    label: "Namespace rank and name",
    icon: Icons.sort
  },
  {
    id: "score_name",
    label: "Score and name",
    icon: Icons.sort
  },
  {
    id: "name",
    label: "Name",
    icon: Icons.sort
  },
]

let sort = ref<SortType>("rank_qname");

let pageNumber = ref(0);

let total = ref(0);
let subtotal = ref(0);
let loaded = ref(false);
let empty = ref(false);

let properties: Ref<Property[]> = ref([]);
let types: Ref<Type[]> = ref([]);
syncResults();

let route = ref("");

let searchOptions: SearchPropertiesOptions | SearchTypesOptions;

/**
 * Set general search criteria.
 */
function loadSearchOptions() {

  searchOptions = {
    niemVersionNumber: toolbox.config.selectedNIEMVersionNumber
  };

  if (tokens.value) {
    searchOptions.token = asArray(tokens.value);
  }

  if (substrings.value) {
    searchOptions.substring = asArray(substrings.value);
  }

  if (prefixes.value) {
    searchOptions.prefix = asArray(prefixes.value);
  }

  if (namespaceCategories.value.length > 0) {
    searchOptions.namespaceCategory = namespaceCategories.value;
  }

  if (scope.value == "Properties") {
    loadSearchPropertyOptions();
  }

}

/**
 * Set property-specific search criteria.
 */
function loadSearchPropertyOptions() {

  let options = searchOptions as SearchPropertiesOptions;

  if (typeNames.value) {
    options.type = asArray(typeNames.value);
  }

  if (elementAttribute.value != "All") {
    options.isElement = elementAttribute.value == "Elements";
  }

  if (concreteAbstract.value != "All") {
    options.isAbstract = concreteAbstract.value == "Abstract";
  }

  searchOptions = options;

}

async function search() {

  loadSearchOptions();

  route.value = Search.route(scope.value, searchOptions, sort.value, pageNumber.value);

  if (!route.value) {
    return;
  }

  let page: Paginated<Property> | Paginated<Type>;

  if (scope.value == "Properties") {
    page = await Search.properties(route.value);
  }
  else {
    page = await Search.types(route.value);
  }

  if (page.empty) {
    resetResults();
    empty.value = true;
    return;
  }

  if (page.first) {
    resetResults();
    total.value = page.totalElements;
  }

  if (page.last) {
    loaded.value = true;
  }

  subtotal.value += page.numberOfElements;

  if (scope.value == "Properties") {
    let propertyPage = page as Paginated<Property>;
    addPropertyResults(propertyPage.content);
  }
  else {
    let typePage = page as Paginated<Type>;
    addTypeResults(typePage.content);
  }

  syncResults();

}

/**
 * Load more search results with the existing search criteria.
 */
function more() {
  pageNumber.value++;
  search();
}

function reset() {
  resetCriteria();
  resetResults();
}

/**
 * Reset search criteria fields to default values.
 */
function resetCriteria() {
  scope.value = "Properties";
  tokens.value = "";
  substrings.value = "";
  prefixes.value = "";
  typeNames.value = "";
  elementAttribute.value = "All";
  concreteAbstract.value = "All";
  sort.value = "rank_qname";
}

function resetResults() {
  loaded.value = false;
  empty.value = false;
  pageNumber.value = 0;
  subtotal.value = 0;
  total.value = 0;
  resetPropertyResults();
  resetTypeResults();
  syncResults();
}

function syncResults() {
  properties.value = getPropertyResults();
  types.value = getTypeResults();
}

/**
 * Convert space-delimited terms into query parameter values
 */
function asArray(text: string) {
  text = text.trim();
  if (text == "") {
    return [];
  }
  return text.replaceAll(",", " ").split(" ");
}

</script>
