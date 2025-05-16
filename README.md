
# NIEM Toolbox

NIEM Toolbox is an open source tool that provides a front-end for [NIEM API 2.0](https://github.com/niemopen/niem-api/tree/dev).  It is a replacement for legacy NIEM tools, including the Schema Subset Generation Tool (SSGT), Migration Tool, and the Conformance Testing Assistant (ConTesA).

NIEM Toolbox and NIEM API 2.0 provide multi-model support, allowing community references and message models to be added in the future.  This will make community content more easily discovered an reused in new message specifications.

This is a single page application (SPA) built with [Nuxt](https://nuxt.com/), which is an open source JavaScript library based on [Vue](https://vuejs.org/).

## Notes

- CMF:  This tool currently supports an older version of the [Common Model Format (CMF)](https://github.com/niemopen/common-model-format) - version 0.8.  There is no support provided for migrating CMF files between 0.8 and a later version.  Support for the latest version of CMF is expected summer 2025.

- Validation:  6.0 NDR rules are still from an older draft based on 5.0 rules with updates for 6.0 namespaces and rule numbers.  6.0 NDR validation with the latest set of 6.0 validation rules is still pending. See [niemopen/niem-api#74](https://github.com/niemopen/niem-api/issues/74) for the latest updates.

## Features

### Transforms

Transform a model in [CMF](https://github.com/niemopen/common-model-format) or NIEM-conformant XML schema into one of the supported output formats:

- CMF
- XML Schema
- JSON Schema
- OWL

Transforms leverage the [CMF Tool](https://github.com/niemopen/cmftool) to read in the model and to run the transform.

### Migrations

Migrate a NIEM subset from one version to any later version in one call.

- Requires the availability of migration rules in the NIEM API database linking components in one version to the next version.

- Uses CMF as the input and output format.  Existing subsets in XML Schema can be converted to CMF via a transformation.  The CMF output can similarly be converted to the desired format in another transformation.

### Validation

Validate NIEM artifacts.

**NDR conformance validation**

- Validate XML schemas against NIEM [Naming and Design Rules (NDR)](https://github.com/niemopen/niem-naming-design-rules).

**XML Schema validation**

- Check that the given files are well-formed and valid XML Schema documents.

**XML instance validation**

- Check that the given files (sample messages) are well-formed and valid against the provided XML schemas.

**Message catalog validation**

- Check that the given mpd or iepd catalog file is valid against the [Model Package Description (MPD) 3.0](https://reference.niem.gov/niem/specification/model-package-description/3.0.1/model-package-description-3.0.1.html) or [Information Exchange Package Description (IEPD) 5.0](https://reference.niem.gov/niem/specification/model-package-description/5.0/niem-iepd-spec-5.0.html) catalog schema.

**CMF validation**

- Check that the given CMF file is valid against the CMF schemas.

**XML catalog validation**

- Check that the given XML catalog file is valid against the OASIS XML Catalog schema.

### Browse

- **Stewards** - Stewards are authoritative sources for models and namespaces.

- **Models** - Models can be reference models (designed for reusability) or message models (custom-tailored for specific information exchanges).

- **Versions** - Individual instances or releases of a model.

- **Namespaces** - A collection of properties and types managed by a steward.

- **Properties** - A representation of a concept, idea, or thing.  They define semantics and are usually represented as field labels or tags in messages.

- **Types** - A structure representing a class or constraints on a value (datatype).

- **Facets** - Constraints on values (a datatype), such as enumerations, patterns, and length.

### Search

Search for properties and types.

- **NIEM version number** - Select the NIEM version number in which to search.  Defaults to the current version of NIEM if not provided.

- **token** - Search for full tokens in component names and definitions with stemming.

    Example: "arm" returns property names with "Arm", "Armed", and "Arming" but does not return "Alarm", "Firearm", "Harm", etc.

- **substring** - Search for partial text in component names and definitions.

    Example: "arm" returns property names with "Arm", "Armed", "Arming", "Alarm", "Firearm", "Harm", etc.

- **prefix** - Filter results to the namespaces with the given prefixes.

- **namespace category** - Filter results to the namespaces with the given categories, such as core, domain, code, adapter, extension, etc.

Additional property search criteria:

- **type** - Filter results to properties with types that have names that match the given type substrings.

- **is abstract** - Filter results to include or exclude abstract properties.

- **is element** - Filter results to return only elements or only attributes.

## Developers

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

### Setup

Install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

### Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

### Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
