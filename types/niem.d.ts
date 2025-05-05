
declare global {

  type APIStewardParams = {
    route?: string,
    stewardKey: string
  }

  type APIModelParams = APIStewardParams & {
    modelKey: string
  }

  type APIVersionParams = APIModelParams & {
    versionNumber: string
  }

  type APINamespaceParams = APIVersionParams & {
    prefix: string
  }

  type APIComponentParams = APIVersionParams & {
    qname: string,
    prefix?: string,
    name?: string
  }

  type APIChildPropertyParams = APIVersionParams & {
    prefix?: string,
    typeQName?: string,
    propertyQName?: string
  }

  type APIFacetParams = APIComponentParams & {
    category?: string
  }

  type APIEntity = {
    "@id": string,
    "@type": string,
    localIdentifier: string,
    route: string,
    title: string
  }

  type APIEntityRef = {
    route?: string
  }

  type APIStewardCategory = "Federal" | "State" | "Local" | "Tribal" | "Territorial" | "International" | "Industry" | "Nonprofit" | "SDO" | "Educational" | "Person" | "Other";

  type APISteward = APIEntity & {
    "@type": "Steward",
    address?: string,
    category?: APIStewardCategory,
    contactName?: string,
    country?: string,
    description?: string,
    email?: string,
    fullName?: string,
    phone?: string,
    shortName: string,
    stewardKey: string,
    subunit: string,
    unit: string,
    website: string
  }

  type APIStewardRef = APIEntityRef & {
    stewardKey: string,
    shortName?: string
  }


  type APIModelCategory = "reference" | "message" | "other";

  type APIModel = APIEntity & {
    "@type": "Model",
    category?: APIModelCategory,
    description?: string,
    developer?: string,
    fullName?: string,
    keywords?: string,
    modelKey: string,
    objective?: string,
    purpose?: string,
    repo?: string,
    shortName: string,
    steward: APIStewardRef,
    subjects?: string,
    website?: string
  }

  type APIModelRef = APIEntityRef & {
    modelKey: string,
    shortName?: string
  }

  type APIVersionCategoryType = "major" | "minor" | "patch" | "core_supplement" | "domain_update" | "other";


  type APIVersionRef = APIEntityRef & {
    versionNumber: string,
    niemVersionNumber?: string
  }

  type APIVersion = APIEntity & {
    "@type": "Version";
    category: APIVersionCategoryType;
    conformanceTargets: string;
    draft: string;
    exchangePartners: string;
    exchangePattern: string;
    isCurrent: boolean;
    isPublished: boolean;
    model: APIModelRef;
    niemVersionNumber: string;
    revised: string;
    status: string;
    steward: APIStewardRef;
    uri: string;
    versionNumber: string;
  }

  type APINamespaceCategory = "core" | "domain" | "code" | "adapter" | "auxiliary" | "external" | "utility" | "core_supplement" | "domain_update" | "extension" | "exchange" | "built_in" | "other";

  type APINamespaceRef = APIEntityRef & {
    prefix: string,
    name?: string,
    category?: APINamespaceCategory,
    uri?: string
  }

  type APINamespace = APIEntity & {
    "@type": "Namespace",
    prefix: string,
    name: string,
    uri: string,
    definition: string,
    category: APINamespaceCategory,
    draft: string,
    target: "REF" | "EXT",
    generation: "build" | "static_file" | "none"
    filename: string,
    filepath: string,
    conformanceTarget: string,
    isOriginal: boolean,
    isDeprecated: boolean,
    hasTarget: boolean, // TODO and ?
    version: APIVersionRef,
    model: APIModelRef,
    steward: APIStewardRef
  }

  type APIComponentRef = {
    route: string,
    prefix: string,
    qname: string,
    name: string,
    definition: string,
    category: APIPropertyCategory | APITypeCategory
  }

  type APIComponent = APIEntity & {
    prefix: string,
    qname: string,
    name: string,
    definition: string,
    category: APIPropertyCategory | APITypeCategory,
    terms: string[],
    isOriginal: boolean,
    isDeprecated: boolean,
    namespace: APINamespaceRef,
    version: APIVersionRef,
    model: APIModelRef,
    steward: APIStewardRef
  }

  type APIPropertyCategory = "element" | "abstract_element" | "attribute";

  type APIPropertyRef = APIComponentRef & {
    category: APIPropertyCategory
  }

  type APIProperty = APIComponent & {
    "@type": "Property",
    category: APIPropertyCategory
    alias: string,
    keywords: string,
    exampleContent: string,
    usageInfo: string,
    type?: APITypeRef,
    group?: APIPropertyRef
  }

  type APITypeCategory = "complex_object" | "complex_value" | "simple_value" | undefined;

  type APITypeDerivation = "extension" | "restriction" | undefined;

  type APITypePattern = "object" | "adapter" | "association" | "augmentation" | "metadata" | "complex_value" | "simple_value" | "simple_list" | "simple_union" | undefined;

  type APITypeRef = APIComponentRef & {
    category: APITypeCategory
  }

  type APIType = APIComponent & {
    "@type": "Type",
    category: APITypeCategory,
    derivation: APITypeDerivation,
    pattern: APITypePattern,
    isSimple: boolean,
    isComplexContent: boolean,
    isSimpleContent: boolean,
    base?: APITypeRef | null,
  }

  type APIChildProperty = APIEntity & {
    "@type": "Subproperty",
    type: APITypeRef,
    property: APIPropertyRef,
    min: string,
    max: string,
    sequence: number,
    definition: string,
    namespace: APINamespaceRef,
    version: APIVersionRef,
    model: APIModelRef,
    steward: APIStewardRef
  }

  type APIFacetCategory = "enumeration" | "pattern" | "length" | "minLength" | "maxLength" | "minExclusive" | "maxExclusive" | "minInclusive" | "maxInclusive" | "fractionDigits" | "totalDigits" | "whiteSpace";

  type APIFacet = APIEntity & {
    "@type": "Facet",
    type: APITypeRef,
    category: APIFacetCategory,
    value: string,
    definition: string,
    namespace: APINamespaceRef,
    version: APIVersionRef,
    model: APIModelRef,
    steward: APIStewardRef
  }

}

export {};
