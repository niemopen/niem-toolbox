
<template>
  <PageHeader :page="AppItems.transform">
    <template #user>
      <p>
        Transform a NIEM subset, schema, IEPD schemas, or message model in either CMF or NIEM XML Schema to another supported format.
      </p>

      <p>
        This functionality leverages the <ToolboxLink :link="AppItems.cmfToolRepo"/> <UKbd>version 0.7-alpha.6</UKbd> which supports <ToolboxLink :link="AppItems.cmfRepo"/> <UKbd>version 0.8</UKbd>.
      </p>

      <p class="font-medium">Tips:</p>

      <ul class="bullets">
        <li>
          CMF inputs have to be the version supported by this tool.
        </li>
        <li>
          CMF version migration is not automated and must be done by hand.
        </li>
        <li>
          NIEM XSD inputs can be a single schema as a XSD file or multiple schemas in a zip file.
        </li>
        <li>
          Validation or conformance errors may lead to transform failure.
        </li>
      </ul>
      <br/>
    </template>

    <template #developer>
      <ToolboxCodePanel title="POST request" :code="code"/>
    </template>
  </PageHeader>

  <UCard>

    <UForm ref="form"
    :state="state"
    :validate="validate" :validate-on="['change']"
    @submit.prevent="onSubmit" enctype="multipart/form-data"
    >

      <!-- Input file -->
      <UFormField
      name="file" required :error="fileError"
      label="1. Select a model input file"
      :help="ToolboxForm.fileWarning(inputMode == 'upload')"
      >

        <!-- Upload file input -->
        <span v-if="inputMode=='upload'">
          <UInput type="file" @change="onFileChange" :accept="accept" :icon="Icons.upload" :ui="UI.inputFileInGroup">
            <template #trailing>(CMF | XSD | ZIP)</template>
          </UInput>
        </span>

        <!-- Demo file input -->
        <span v-else>
          <UInput v-model="demoFile" :ui="UI.inputFileInGroup" :icon="Icons.magic"/>
        </span>

        <!-- Select upload file or demo file option -->
        <USelect v-model="inputMode" :items="inputModeItems" color="neutral" variant="subtle" :ui="UI.inputMode" :icon="inputModeItem?.icon"/>

      </UFormField>

      <!-- Select from -->
      <UFormField name="from" required label="2. Select input file format">
        <USelect v-model="state.from" :items="fromItems" :icon="fromItem?.icon" class="w-64"/>
      </UFormField>

      <!-- Select to -->
      <UFormField name="to" required label="3. Select transformation format">
        <USelect v-model="state.to" :items="toItems" :icon="toItem?.icon" class="w-64"/>
      </UFormField>

      <UButton type="submit">Transform</UButton>

    </UForm>

  </UCard>

  <APIResponsePanel :results="results"/>
</template>

<script setup lang="ts">
import type { Form, SelectItem } from '@nuxt/ui';
import type { ShallowRef, ShallowUnwrapRef } from 'vue';



// *** Input mode ***

type InputMode = "upload" | "cmf" | "xsd" | "cmf-invalid" | "text";

// Allow user to choose between uploading file and using an available demo file
const inputMode = ref<InputMode>("upload");

type InputModeItem = SelectItem & {
  value?: InputMode,
  icon?: IconType,
  from?: "cmf" | "xsd",
  path?: string
}

const inputModeItems: InputModeItem[] = [
  {
    value: "upload",
    label: "Upload",
    icon: Icons.upload
  },
  {
    type: "separator"
  },
  {
    label: "Valid examples",
    type: "label"
  },
  {
    value: "cmf",
    label: "CMF",
    icon: Icons.cmf,
    from: "cmf",
    path: "demo/transform/CrashDriver-5.0.cmf.xml"
  },
  {
    value: "xsd",
    label: "XSD",
    icon: Icons.xml,
    from: "xsd",
    path: "demo/transform/CrashDriver-5.0.zip"
  },
  {
    type: "separator"
  },
  {
    label: "Invalid examples",
    type: "label"
  },
  {
    value: "cmf-invalid",
    label: "CMF 0.6",
    icon: Icons.error,
    from: "cmf",
    path: "demo/transform/CrashDriver-5.0-CMFv0.6.cmf.xml"
  },
  {
    value: "text",
    label: ".txt file",
    icon: Icons.error,
    from: undefined,
    path: "demo/transform/CrashDriver-5.0.txt"
  }
]

const inputModeItem = computed(() => {
  return inputModeItems.find(item => item.value == inputMode.value);
})

const demoFile = ref();

// Reset state when switching input modes
watch(inputMode, async (newValue, oldValue) => {
  if (inputModeItem.value && inputMode.value != "upload") {
    state.file = await ToolboxForm.loadPublicFile(inputModeItem.value.path)
    demoFile.value = state.file?.name;
    state.from = inputModeItem.value?.from;
  }
  else {
    state.file = undefined;
    state.from = undefined;
  }
  form.value.clear();
  results.request = "unsent";
});


// *** State ***

type FromType = "cmf" | "xsd";
type ToType = FromType | "json_schema" | "owl";

type TransformStateType = {
  from: FromType,
  to: ToType,
  file: File
}

const state = reactive<Partial<TransformStateType>>({});

const fromItems = [
  {
    value: "cmf",
    label: "CMF XML",
    icon: Icons.cmf,
    extensions: ["cmf", "xml"]
  },
  {
    value: "xsd",
    label: "NIEM XSD",
    icon: Icons.xml,
    extensions: ["zip", "xsd"]
  }
];

const toItems = [
  ...fromItems,
  {
    value: "json_schema",
    label: "JSON Schema",
    icon: Icons.json,
    extensions: ["schema.json", "jschema", "json"]

  },
  {
    value: "owl",
    label: "OWL",
    icon: Icons.owl,
    extensions: ["ttl"]
  }
];

const fromItem = computed(() => {
  return fromItems.find(item => item.value == state.from);
});

const toItem = computed(() => {
  return toItems.find(item => item.value === state.to);
});

const extension = computed(() => {
  return ToolboxApp.extension(state.file?.name);
});

const fromExtensions = fromItems.flatMap(item => item.extensions);
const accept = fromExtensions.map(extension => "." + extension).join(", ");


// *** File change ***

/**
 * Update the file state since `v-model` doesn't work on file inputs.
 * Set the default state.from value
 */

async function onFileChange(event: Event) {
  fileError.value = "";
  state.file = ToolboxForm.fileInput(event);
  state.from = defaultFrom();
  results.request = "unsent"
  await form.value.validate({name: undefined, silent: true});
}

function defaultFrom() {
  switch (extension.value) {
    case "cmf":
    case "xml":
    case "cmf.xml":
      return "cmf";

    case "xsd":
    case "zip":
      return "xsd";

    default:
      return undefined;
  }
}


// *** Developer information panel ***

const code = computed(() => `curl -i -X POST -H "Content-Type: multipart/form-data" -F from=${ state.from } -F to=${ state.to } -F file=@${ state.file?.name } ${ API.routes.transform }`);


// *** Form validation ***

const form = useTemplateRef("form") as Readonly<ShallowRef<ShallowUnwrapRef<Form<TransformStateType>>>>;

const fileError: Ref<string | undefined> = ref();

let validationFinalPass = false;

function validate(state: Partial<TransformStateType>) {

  const errors = ToolboxForm.initFormErrors();
  fileError.value = undefined;

  // Skip validation until form submission
  if (validationFinalPass) {
    ToolboxForm.validateRequiredField(errors, "from", state.from);
    ToolboxForm.validateRequiredField(errors, "to", state.to);
    ToolboxForm.validateRequiredField(errors, "file", state.file);

    ToolboxForm.validateFileExtension(errors, "file", fromExtensions, extension.value);
  }

  return errors;
}


// *** Submit ***

let results = API.initResults();

async function onSubmit() {
  // Include file in final round of validation check
  validationFinalPass = true;
  let validateResults = await form.value?.validate({name: undefined, silent: true});
  if (validateResults == false) {
    validationFinalPass = false;
    return;
  }

  results.filename = "";
  const response = await API.post(API.routes.transform, state, results);
  await API.downloadFileResults(response, results);

  // Reset validation checks
  validationFinalPass = false;
}

</script>
