
<template>
  <PageHeader :page="AppItems.releaseNotes"/>

  <UCard v-for="note in notes" :key="note.header" class="card">
    <template #header>
      <h2>{{ note.header }}</h2>
    </template>

    <div v-if="note.features">
      <h3>Features</h3>
      <ul class="ml-5">
        <li v-for="feature in note.features" class="bullets">
          <span class="feature-summary">{{ feature.summary }}</span>
          <p v-if="feature.description" class="feature-description">
            {{ feature.description }}
          </p>
        </li>
      </ul>
    </div>
  </UCard>
</template>

<script setup lang="ts">

type NoteType = {
  header: string,
  features?: {summary: string, description?: string}[]
  fixes?: string[]
}

const notes: NoteType[] = [
  {
    header: "2025-05-21",
    features: [
      {
        summary: "Migrate NIEM subsets",
        description: "Migrate NIEM subsets in CMF from one version to any later NIEM version in one pass. A migration report is included with the output to identify any issues encountered during the process.  Note: Use the transform tool to convert subsets in NIEM XML Schema to CMF for the migration tool input, and to convert the migration output back to NIEM XML Schema, JSON Schema, or another supported format."
      },
      {
        summary: "NIEM 6.0 data and migration rules",
        description: "This update includes NIEM 6.0 PS02 data and migration rules from the previous version, NIEM 5.2."
      },
      {
        summary: "Browse model content",
        description: "Browse information about stewards, models, versions, namespaces, properties, types, and facets.  While currently only content from the NIEM reference model is available, this tool has been built for multi-model support, allowing for the publication and reuse of community reference models and message models at a component level."
      },
      {
        summary: "Search model content",
        description: "Search for properties and types with token and substring searches.  Filter results by namespace prefixes or categories.  For property searches, filter results by type name tokens, by elements vs attributes, and by concrete vs abstract. Choose the sort order for the results."
      },
      {
        summary: "Updated validation handling for NIEM 3.0 and NIEM 6.0 schemas",
        description: "Updated validation handling for NIEM 3.0 and 6.0 schemas, which were previously returning empty validation reports."
      }
    ]
  },
  {
    header: "2024-11-25",
    features: [
      {
        summary: "Updated validation reports",
        description: "Improved display for validation reports and added a custom report for NDR validation to group results across all files by rule number."
      },
      {
        summary: "Updated demo files",
        description: "Added demo files to the validation page.  Updated the way demo files are access in the transform page for better consistency across the application."
      }
    ]
  },
  {
    header: "2024-11-14",
    features: [
      // {
      //   summary: "Migrate NIEM subsets",
      //   description: "Migrate a NIEM subset in a CMF file to a more recent version of NIEM."
      // },
      {
        summary: "Validate NIEM XSD",
        description: "Validate NIEM XML schemas and check for NDR conformance."
      },
      {
        summary: "Validate NIEM XML",
        description: "Validate NIEM XML instances against their schemas."
      },
      {
        summary: "Validate NIEM message catalogs",
        description: "Validate NIEM IEPD / message catalog XML instances (defined by NIEM's MPD / IEPD specification)."
      },
      {
        summary: "Validate XML catalogs",
        description: "Validate XML catalogs (defined by OASIS), which can be used to override file location paths in XSD import statements."
      }
    ]
  },
  {
    header: "2023-03-31",
    features: [
      {
        summary: "Initial application",
        description: ""
      },
      {
        summary: "Transform NIEM models",
        description: "Transform NIEM models in CMF or XML Schemas to CMF, XML Schemas, JSON Schema, or OWL."
      }
    ]
  }
]

</script>

<style scoped lang="scss">

// TODO: Update styling

  .card {
    margin-bottom: 18px;
  }

  .card:hover {
    background-color: color-mix(in srgb, whitesmoke 50%, transparent);
  }

  .card > :first-child {
    background-color: whitesmoke;
  }

  .feature-description {
    font-weight: 300;
    font-size: smaller;
  }

  li {
    margin-bottom: 12px;
  }

</style>
