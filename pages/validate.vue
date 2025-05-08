
<template>
  <PageHeader :page="AppItems.validate">
    <template #user>
      <p>
        Validate NIEM artifacts and check NDR conformance.
      </p>

      <p class="font-semibold">Notes:</p>

      <ul class="bullets spaced-sm">
        <li>
          Use the <ULink to="/transform">Transform</ULink> feature to convert a CMF model to XSD to check NDR conformance.
        </li>
        <li>
          JSON instance and schema validation is not yet available.
        </li>
        <li>
          CSV results are download-only at this time and cannot be displayed.
        </li>
      </ul>

      <div v-for="[key, kinds] of Object.entries(groupedValidationItems)">
        <p class="font-semibold mb-3">{{ key }} validation options:</p>

        <ul class="bullets spaced-sm">
          <li v-for="kind in kinds">
            <span class="font-semibold">{{ kind.label }}</span> -
            <span>{{ kind.description }}</span>
            <span v-if="kind.note" class="font-light"><br/>{{ kind.note }}</span>
          </li>
        </ul>

        <br/>

      </div>

    </template>

    <template #developer>
      <ToolboxCodePanel title="POST request" :code="code"/>
    </template>
  </PageHeader>

  <UCard>

    <UForm ref="form"
    :state="state"
    :validate="validate"
    @submit.prevent="onSubmit" enctype="multipart/form-data"
    >

      <!-- 1. Select validation type -->
      <UFormField
      name="kind" required
      label="1. Select validation kind"
      :help="validationItem?.description"
      >
        <!-- @vue-expect-error -->
        <USelect v-model="state.kind" :items="validationMenuItems" @change="onValidationKindChange" :icon="validationItem?.icon" class="w-64"/>
      </UFormField>

      <!-- 2. Select result format -->
      <UFormField
      name="mediaType" required
      label="2. Select results format"
      >
        <USelect v-model="state.mediaType" :items="mediaTypeItems" :icon="mediaTypeIcon"  class="w-64"/>
      </UFormField>

      <!-- 3. Required File 1 -->
      <UFormField name="file1" required label="3. Select a file to validate" :help="fileHelp(validationItem?.file1?.description)">

        <!-- File 1 as upload -->
        <span v-if="inputMode=='upload'">
          <UInput type="file" @change="onFile1Change" :accept="validationItem?.file1?.validExtensions" :icon="validationItem?.file1?.icon || Icons.upload" :ui="UI.inputFileInGroup">
            <template #trailing>{{ file1TypeLabel }}</template>
          </UInput>
        </span>

        <!-- File 1 as demo file -->
        <span v-else>
          <UInput v-model="demoFile1" :ui="UI.inputFileInGroup" :icon="Icons.magic"/>
        </span>

        <!-- Select upload file or demo file option -->
        <!-- @vue-expect-error -->
        <USelect v-model="inputMode" :items="inputModeItems" color="neutral" variant="subtle" :ui="UI.inputMode" :icon="inputModeSelectedItem?.icon"/>

      </UFormField>

      <!-- 4. Optional File 2 -->
      <UFormField
      v-if="validationItem?.file2"
      name="file2"
      label="4. Select supporting file for validation"
      :help="fileHelp(validationItem.file2.description)"
      >

        <!-- File 2 as upload -->
        <UInput v-if="inputMode=='upload'" type="file" @change="onFile2Change" :accept="validationItem.file2.validExtensions" :icon="validationItem?.file2?.icon || Icons.upload" :ui="UI.inputFileInGroup">
          <template #trailing>{{ file2TypeLabel }}</template>
        </UInput>

        <!-- File 2 as demo file -->
        <span v-else>
          <UInput v-model="demoFile2" :ui="UI.inputFileInGroup" :icon="Icons.magic"/>
        </span>
      </UFormField>

      <UButton type="submit">Validate</UButton>

    </UForm>

  </UCard>

  <APIResponsePanel :results="results" :kind="state.kind"/>

</template>

<script setup lang="ts">

import type { SelectItem } from "@nuxt/ui";
import type { InputFileType } from "../utils/toolbox/validation";
import { validationMenuItems } from "../utils/toolbox/validation";

// *** Input mode ***

type InputMode = "upload" | "valid" | "invalid";

// Allow user to choose between uploading file and using an available demo file
const inputMode: Ref<InputMode> = ref("upload");

type InputModeItem = SelectItem & {
  value?: InputMode,
  icon?: IconType
}

const inputModeItems: InputModeItem[] = [
  {
    value: "upload",
    icon: Icons.upload,
    label: "Upload"
  },
  {
    type: "separator"
  },
  {
    type: "label",
    label: "Demo files"
  },
  {
    value: "valid",
    icon: Icons.success,
    label: "Valid",

  },
  {
    value: "invalid",
    icon: Icons.error,
    label: "Invalid"
  }
]

const inputModeSelectedItem = computed(() => {
  return inputModeItems.find(item => item.value == inputMode.value);
});

// Reset state when switching input modes
watch(inputMode, async (newValue, oldValue) => {
  await updateFiles();
});

const demoFile1 = ref();
const demoFile2 = ref();


async function onValidationKindChange() {
  await updateFiles();
}

// *** File change ***

/**
 * Update the file state since `v-model` doesn't work on file inputs.
 */
function onFile1Change(event: Event) {
  file1Error.value = "";
  state.file1 = ToolboxForm.fileInput(event);
  results.request = "unsent";
}

/**
 * Update the file state since `v-model` doesn't work on file inputs.
 */
function onFile2Change(event: Event) {
  file2Error.value = "";
  state.file2 = ToolboxForm.fileInput(event);
  results.request = "unsent";
}

async function updateFiles() {
  results.request = "unsent";
  if (inputMode.value == "valid") {
    state.file1 = await ToolboxForm.loadPublicFile(validationItem.value?.file1?.pathValidExample);

    if (validationItem.value?.file2) {
      state.file2 = await ToolboxForm.loadPublicFile(validationItem.value?.file2.pathValidExample);
    }
  }
  else if (inputMode.value == "invalid") {
    state.file1 = await ToolboxForm.loadPublicFile(validationItem.value?.file1?.pathInvalidExample);

    if (validationItem.value?.file2) {
      state.file2 = await ToolboxForm.loadPublicFile(validationItem.value?.file2.pathInvalidExample);
    }
  }

  if (inputMode.value != "upload") {
    demoFile1.value = state.file1?.name;
    demoFile2.value = state.file2?.name;
  }
}


// *** State ***

type ValidateStateType = {
  kind: APITypes.ValidationKindType,
  file1: File
  file2?: File,
  mediaType: "json" | "csv"
}

const state = reactive<Partial<ValidateStateType>>({
  mediaType: "json"
});

const validationItems = reactive(validationMenuItems.filter(item => item.type == "item"));

const groupedValidationItems = reactive({
  XSD: validationItems.filter(item => item.group == "XSD"),
  XML: validationItems.filter(item => item.group == "XML")
});

const validationItem = computed(() => {
  return validationItems.find(item => item.value == state.kind);
})

const file1TypeLabel = computed(() => fileTypeLabelHelper(validationItem.value?.file1));
const file2TypeLabel = computed(() => fileTypeLabelHelper(validationItem.value?.file2));

function fileTypeLabelHelper(file: InputFileType | undefined) {
  if (!file) return "";
  let extensions = file.validExtensions;
  let text = extensions.join(" | ").replaceAll(".", "").toUpperCase();
  return `(${text})`
}

const mediaTypeItems = API.reportMediaTypes;

const mediaTypeIcon = computed(() => {
  return API.mediaTypeIcon(state.mediaType);
})

const mediaTypeQueryString = computed(() => {
  return API.mediaTypeQueryString(state.mediaType)
});

function fileHelp(fileDescription: string | undefined) {
  if (inputMode.value == "upload") {
    return `${ToolboxForm.UPLOAD_WARNING} | ${fileDescription || "(pending)"}`;
  }
  return ToolboxForm.DEMO_FILE_MESSAGE;
}

const extension1 = computed(() => {
  return ToolboxApp.extension(validationItem.value?.file1?.file?.name);
})

const extension2 = computed(() => {
  return ToolboxApp.extension(validationItem.value?.file2?.file?.name);
})



// *** Developer information panel ***

// Compute the second file parameter if applicable
const codeFileParam2 = computed(() => validationItem.value?.file2 != undefined ? `-F ${validationItem.value?.file2?.paramName}=@${ state.file2?.name }` : "");

// Compute the curl statement for the developer information panel
const code = computed(() => `curl -i -X POST -H "Content-Type: multipart/form-data" -F ${validationItem.value?.file1?.paramName}=@${ state.file1?.name } ${codeFileParam2.value} ${ validationItem.value?.route}${mediaTypeQueryString.value}`);


// *** Form validation ***

const form = useTemplateRef("form");

const file1Error = ref("");
const file2Error = ref("");

let validationFinalPass = false;

function validate(state: Partial<ValidateStateType>) {

  const errors = ToolboxForm.initFormErrors();

  // Check required fields
  ToolboxForm.validateRequiredField(errors, "kind", state.kind);
  ToolboxForm.validateRequiredField(errors, "resultFormat", state.mediaType);

  // Check that the file(s) have been uploaded or selected and have a valid extension
  if (validationFinalPass) {
    ToolboxForm.validateRequiredField(errors, "file1", state.file1);
    ToolboxForm.validateFileExtension(errors, "file1", validationItem.value?.file1?.validExtensions || [], extension1.value);

    if (validationItem.value?.file2) {
      ToolboxForm.validateRequiredField(errors, "file2", state.file2);
      ToolboxForm.validateFileExtension(errors, "file2", validationItem.value?.file2?.validExtensions || [], extension2.value);
    }
  }

  return errors;
}


// *** Submit ***

const results = API.initResults();

async function onSubmit() {

  // Include files in final round of validation check
  validationFinalPass = true;
  let validateResults = await form.value?.validate();
  if (validateResults == false
        || !validationItem.value?.file1
        || !validationItem.value.route
        || !state.file1
  ) {
    return;
  }

  // Add first file
  let customState: {[key: string]: any} = {};
  customState[validationItem.value.file1?.paramName] = state.file1;

  // Add optional second file
  if (validationItem.value.file2) {
    customState[validationItem.value.file2.paramName] = state.file2;
  }

  // Add the media type
  customState.mediaType = state.mediaType;

  // Set the filename for the download results, with qualifier to distinguish kinds of validation.
  let baseName = state.file1.name.split(".").slice(0, -1).join(".").replaceAll(" ", "-");
  let qualifier = validationItem.value.value == "message-catalog" || validationItem.value.value == "xml-catalog" ? "" : validationItem.value.value + "-";
  results.filename = `${baseName}-${qualifier}validation-report.${state.mediaType}`;

  // Make the validation request from the NIEM API and download the results
  const response = await API.post(validationItem.value.route, customState, results, false);
  await API.downloadReportResults(state.mediaType as APIMediaType, response, results);

  // Reset validation checks
  validationFinalPass = false;

}

</script>
