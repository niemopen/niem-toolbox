
<template>
  <PageHeader :page="AppItems.build"/>

  <div class="flex flex-row flex-nowrap gap-2 divide-x divide-gray-300 h-[500px]">
    <div id="panel-map" class="basis-1/5 panel">
      <h3>MAP</h3>
      <hr/>
      <UNavigationMenu orientation="vertical" :items="items" class="" />
    </div>

    <div id="panel-search" class="basis-1/5 panel">
      <h3>SEARCH</h3>
      <hr/>
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

    <div id="panel-results" class="basis-1/5 grow panel">
      <h3>RESULTS</h3>
      <hr/>
      <div v-for="property in properties" :key="property.label" class="divider-y">
        <div class="flex flex-row w-full">
          <UButton :icon="icons.more" @click="toggleDisplay(property)" :class="UI.button_icon"/>

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

    <div id="panel-item" class="basis-1/5 panel">
      <h3>ITEMS</h3>
      <hr/>
      {{ selectedItem }}
    </div>

    <div id="panel-model" class="basis-1/5 panel overflow-y-auto">
      <h3>MODEL</h3>
      <hr/>
      <UInput type="text" v-model="sandbox.shortName"/>
      <UInput type="text" v-model="sandbox.modelKey"/>
      <UInput type="text" v-model="sandboxVersion.versionNumber"/>
      <h4 class="mt-2">Properties:</h4>
      <ul class="list-disc list-outside p-5">
        <li v-for="property in toolbox.properties">{{ property.qname }} - {{ property.definition }}</li>
      </ul>
    </div>
  </div>

</template>

<script setup lang="ts">
import { Property } from '~/utils/niem/Property';


const toolbox = useToolboxStore();

const sandbox = toolbox.getModel("user/sandbox");
const sandboxVersion = toolbox.getModelVersion(sandbox?.id, "1.0");

const niem = toolbox.getModel("niem/model");
const niemVersion = toolbox.getModelVersion(niem.id, "5.2");
console.log("NIEM", niemVersion.id);


// let properties = toolbox.properties;
let properties = [];


let selectedItem = ref();

// model.value.properties.push(new ToolboxProperty("nc:Person", "nc:PersonType", "A human being", PropertyCategory.object))

// const p = new ToolboxProperty("nc:Person", "nc:PersonType", "A human being", PropertyCategory.object);
// toolbox.value.addProperty(p);

// const p4 = toolbox.getProperty(sandbox, "nc:PersonMiddleName");
// const p5 = toolbox.getProperty(sandbox, "nc:PersonSurName");


const oldProperties = ref([
  {
    qname: "nc:Person",
    type: "nc:PersonType",
    definition: "A human being",
    category: "object",
    link: "",
    typeLink: "",
    alias: "",
    display: "hidden"
  },
  {
    qname: "nc:PersonName",
    type: "nc:PersonNameType",
    definition: "A name of a person",
    category: "object",
    link: "",
    typeLink: "",
    alias: "",
    display: "hidden"
  },
  {
    qname: "nc:PersonGivenName",
    type: "nc:PersonNameTextType",
    definition: "A first or given name of a person.",
    category: "data property",
    link: "",
    typeLink: "",
    alias: "",
    display: "hidden"
  }
]);

function toggleDisplay(object) {
  object.display = object.display == "hidden" ? "" : "hidden";
}

const accordion = [
  {
    label: 'Icons',
    icon: 'i-heroicons-face-smile',
    content: 'You have nothing to do, @nuxt/icon will handle it automatically.'
  },
  {
    label: 'Colors',
    icon: 'i-heroicons-swatch',
    content: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
  },
  {
    label: 'Components',
    icon: 'i-heroicons-cube-transparent',
    content: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
  }
];

const items = ref([
  [
    {
      label: 'Guide',
      icon: 'i-heroicons-book-open',
      onSelect: (e) => { selectedItem.value = "GUIDE" },
      children: [
        {
          label: 'Introduction',
          description: 'Fully styled and customizable components for Nuxt.',
          icon: 'i-heroicons-home',
          onSelect: (e) => { selectedItem.value = "INTRODUCTION" },
          children: [
            {
              label: 'Child 1',
              description: 'Learn how to install and configure Nuxt UI in your application.',
              icon: 'i-heroicons-cloud-arrow-down',
              onSelect: (e) => { selectedItem.value = "CHILD 1" }
            },
            {
              label: 'Child 2',
              icon: 'i-heroicons-face-smile',
              description: 'You have nothing to do, @nuxt/icon will handle it automatically.'
            },
          ]
        },
        {
          label: 'Installation',
          description: 'Learn how to install and configure Nuxt UI in your application.',
          icon: 'i-heroicons-cloud-arrow-down',
          onSelect: (e) => { selectedItem.value = "INSTALLATION" }
        },
        {
          label: 'Icons',
          icon: 'i-heroicons-face-smile',
          description: 'You have nothing to do, @nuxt/icon will handle it automatically.'
        },
        {
          label: 'Colors',
          icon: 'i-heroicons-swatch',
          description: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
        },
        {
          label: 'Theme',
          icon: 'i-heroicons-cog',
          description: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
        }
      ]
    },
    {
      label: 'Composables',
      icon: 'i-heroicons-circle-stack',
      children: [
        {
          label: 'defineShortcuts',
          icon: 'i-heroicons-document-text',
          description: 'Define shortcuts for your application.',
        },
        {
          label: 'useModal',
          icon: 'i-heroicons-document-text',
          description: 'Display a modal within your application.',
        },
        {
          label: 'useSlideover',
          icon: 'i-heroicons-document-text',
          description: 'Display a slideover within your application.',
        },
        {
          label: 'useToast',
          icon: 'i-heroicons-document-text',
          description: 'Display a toast within your application.',
        }
      ]
    },
    {
      label: 'Components',
      icon: 'i-heroicons-cube-transparent',
      active: true,
      children: [
        {
          label: 'Link',
          icon: 'i-heroicons-document-text',
          description: 'Use NuxtLink with superpowers.',
        },
        {
          label: 'Modal',
          icon: 'i-heroicons-document-text',
          description: 'Display a modal within your application.',
        },
        {
          label: 'NavigationMenu',
          icon: 'i-heroicons-document-text',
          description: 'Display a list of links.',
        },
        {
          label: 'Pagination',
          icon: 'i-heroicons-document-text',
          description: 'Display a list of pages.',
        },
        {
          label: 'Popover',
          icon: 'i-heroicons-document-text',
          description: 'Display a non-modal dialog that floats around a trigger element.',
        },
        {
          label: 'Progress',
          icon: 'i-heroicons-document-text',
          description: 'Show a horizontal bar to indicate task progression.',
        }
      ]
    }
  ]
]);

</script>

<style lang="scss" scoped>

.panel {
  height: 100%;
}

</style>