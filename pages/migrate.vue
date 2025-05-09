
<template>
  <PageHeader :page="AppItems.migrate">
    <template #user>
      <p>
        Migrate a NIEM subset to a more recent version of NIEM.
      </p>

      <p class="font-medium">Use the <ULink to="/transform">Transform</ULink> feature to:</p>

      <ul class="bullets">
        <li>Convert existing NIEM XML schemas to CMF if needed for the migration.</li>
        <li>Convert the migration output to NIEM XML schemas, JSON schema, or another supported output format.</li>
      </ul>

      <p>Note that multi-step migration is possible in a single request.  Any migration issues between versions will be aggregated into a single results file.</p>

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
      label="1. Select a CMF file to migrate (NIEM subsets only)"
      :help="ToolboxForm.fileWarning(inputMode == 'upload')"
      >

        <!-- Upload file input -->
        <span v-if="inputMode=='upload'">
          <UInput type="file" id="uploadFileElement" @change="onFileChange" accept=".cmf,.cmf.xml,.xml" :icon="Icons.upload" :ui="UI.inputFileInGroup">
            <template #trailing>(CMF)</template>
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
      <UFormField name="from" required label="2. Select current version">
        <USelect v-model="state.from" :items="fromItems" :icon="Icons.start" class="w-64"/>
      </UFormField>

      <!-- Select to -->
      <UFormField name="to" required label="3. Select migration version">
        <USelect v-model="state.to" :items="toItems" :icon="Icons.end" class="w-64"/>
      </UFormField>

      <UButton type="submit">Migrate</UButton>

    </UForm>

  </UCard>

  <APIResponsePanel :results="results"/>
</template>

<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui';


// LATER: Support all models available through the API


// *** Input mode ***

type InputMode = "upload" | "valid" | "invalid";

// Allow user to choose between uploading a file and using an available demo file
const inputMode = ref<InputMode>("upload");

type InputModeItem = SelectItem & {
  value?: InputMode,
  icon?: IconType,
  path?: string
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
    path: "demo/migrate/CrashDriver-NIEM-5.0.cmf.xml"
  },
  {
    value: "invalid",
    icon: Icons.error,
    label: "Invalid",
    path: "demo/migrate/CrashDriver-NIEM-5.0-v0.6.cmf.xml"
  }
]

const inputModeItem = computed(() => {
  return inputModeItems.find(item => item.value == inputMode.value)
});

const demoFile = ref();

watch(inputMode, async(value, oldValue) => {
  // Download demo file and update the state
  if (inputModeItem.value && inputMode.value != "upload") {
    state.file = await ToolboxForm.loadPublicFile(inputModeItem.value.path)
    demoFile.value = state.file?.name;
    state.from = "5.0";
  }
  else {
    state.file = undefined;
    state.from = undefined;
  }
});

// *** State ***

type MigrateStateType = {
  from: string,
  to: string,
  file: File
}

const state = reactive<Partial<MigrateStateType>>({});

// LATER: Get all version numbers from API
const allItems = ["1.0", "2.0", "2.1", "3.0", "3.1", "3.2", "4.0", "4.1", "4.2", "5.0", "5.1", "5.2"];

// Include all but the most recent version as the starting point for the migration
const fromItems = ref(allItems.slice(0, -1));

// Include all but the first version by default, or filter based on the selected from value
const toItems = computed(() => {
  if (state.from != undefined) {
    // Return more recent versions than the one selected
    return allItems.slice(1).filter(version => version > (state.from || ""));
  }
  else {
    // Return all but the first version by default
    return allItems.slice(1);
  }
});


// *** File change ***

/**
 * Update the file state since `v-model` doesn't work on file inputs.
 */
function onFileChange(event: Event) {
  fileError.value = "";
  state.file = ToolboxForm.fileInput(event);
  results.request = "unsent";
}



// *** Developer information panel **

const code = computed(() => `curl -i -X POST -H "Content-Type: multipart/form-data" -F from=${ state.from } -F to=${ state.to } -F file=@${ state.file?.name } ${ API.routes.migrate }`);


// *** Form validation ***

const form = useTemplateRef("form");

const fileError = ref<string | undefined>("");

const extension = computed(() => {
  return ToolboxApp.extension(state.file?.name);
});

let validationFinalPass = false;

function validate(state: Partial<MigrateStateType>) {
  const errors = ToolboxForm.initFormErrors();
  fileError.value = undefined;

  // Check that from and to fields have been selected
  ToolboxForm.validateRequiredField(errors, "from", state.from);
  ToolboxForm.validateRequiredField(errors, "to", state.to);

  // Check that a file has been uploaded or selected and has a valid extension
  if (validationFinalPass){
    ToolboxForm.validateRequiredField(errors, "file", state.file);
    ToolboxForm.validateFileExtension(errors, "file", ["cmf", "xml", "cmf.xml"], extension.value);
  }

  return errors;
}


// *** Submit ***

const results = API.initResults();

async function onSubmit() {
  console.log("Sending migration request", state.from, state.to, state.file);

  validationFinalPass = true;
  let validateResults = await form.value?.validate();
  if (validateResults == false) return;

  const response = await API.post(API.routes.migrate, state, results);
  await API.downloadFileResults(response, results);

  // Reset validation checks
  validationFinalPass = false;
}

</script>
