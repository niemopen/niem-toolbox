import type { SelectItem } from "@nuxt/ui"

export type InputFileType = {
  description: string,
  icon: string,
  paramName: string,
  file?: File,
  validExtensions: string[],
  pathValidExample: string,
  pathInvalidExample: string
}

export type ValidationItemType = SelectItem & {
  value?: APITypes.ValidationKindType,
  description?: string,
  note?: string,
  group: "display" | "XSD" | "XML",
  extensions?: string[],
  route?: string,
  file1?: InputFileType,
  file2?: InputFileType
}

export const validationMenuItems: ValidationItemType[] = [
  {
    label: "XML schemas",
    type: "label",
    group: "display",
  },
  {
    value: "ndr",
    label: "Validate NDR conformance",
    type: "item",
    description: "Check one or more NIEM XML schemas against the NIEM Naming and Design Rules (NDR)",
    extensions: ["xsd", "zip"],
    icon: Icons.book,
    group: "XSD",
    route: API.routes.validate_ndr,
    file1: {
      icon: Icons.xml,
      description: "NIEM XSD",
      paramName: "file",
      validExtensions: [".xsd", ".zip"],
      pathValidExample: "demo/validate/ndr/CrashDriver-6.0.zip",
      pathInvalidExample : "demo/validate/ndr/Crash Driver IEPD 5.0 invalid.zip"
    }
  },
  {
    value: "xsd",
    label: "Validate XSD",
    type: "item",
    description: "Validate one or more XML schemas to check that the basic syntax is correct.",
    extensions: ["xsd", "zip"],
    icon: Icons.xml,
    group: "XSD",
    route: API.routes.validate_xsd,
    file1: {
      icon: Icons.xml,
      description: "XSD",
      paramName: "file",
      validExtensions: [".xsd", ".zip"],
      pathValidExample: "demo/validate/xml/single/person.xsd",
      pathInvalidExample : "demo/validate/xml/single/person-invalid.xsd"
    }
  },
  {
    type: "separator",
    group: "display"
  },
  {
    label: "XML instances",
    type: "label",
    group: "display"
  },
  {
    value: "cmf",
    label: "Validate CMF",
    type: "item",
    description: "Validate a CMF file (an XML instance file) against its NIEM CMF XML schema.",
    note: "Note that this does not check NDR conformance of the content.",
    extensions: ["xml", "cmf"],
    icon: Icons.xml,
    group: "XML",
    route: API.routes.validate_cmf,
    file1: {
      icon: Icons.xml,
      description: "CMF",
      paramName: "file",
      validExtensions: [".cmf", ".xml"],
      pathValidExample: "demo/validate/xml/cmf/CrashDriver-5.0.cmf.xml",
      pathInvalidExample : "demo/validate/xml/cmf/CrashDriver-5.0-invalid.cmf.xml"
    }
  },
  {
    value: "xml",
    label: "Validate XML",
    type: "item",
    description: "Validate one or more XML instances against its user-provided XML schemas.",
    extensions: ["xml"],
    icon: Icons.xml,
    group: "XML",
    route: API.routes.validate_xml,
    file1: {
      icon: Icons.xml,
      description: "XML instance",
      paramName: "xml",
      validExtensions: [".xml"],
      pathValidExample: "demo/validate/xml/single/person.xml",
      pathInvalidExample : "demo/validate/xml/single/person-invalid.xml"

    },
    file2: {
      icon: Icons.zip,
      description: "NIEM XSD",
      paramName: "xsd",
      validExtensions: [".xsd", ".zip"],
      pathValidExample: "demo/validate/xml/single/person.xsd",
      pathInvalidExample: "demo/validate/xml/single/person.xsd"
    }
  },
  {
    value: "message-catalog",
    label: "Validate message catalog",
    type: "item",
    description: "Validate an IEPD or message catalog (an XML instance file) against its NIEM IEPD / message catalog schema.",
    extensions: ["xml"],
    icon: Icons.xml,
    group: "XML",
    route: API.routes.validate_message_catalog,
    file1: {
      icon: Icons.xml,
      description: "message-catalog.xml or iepd-catalog.xml",
      paramName: "file",
      validExtensions: [".xml"],
      pathValidExample: "demo/validate/xml/message-catalog/valid-5.0/iepd-catalog.xml",
      pathInvalidExample : "demo/validate/xml/message-catalog/invalid-5.0/iepd-catalog.xml"
    }
  },
  {
    value: "xml-catalog",
    label: "Validate XML catalog",
    type: "item",
    description: "Validate an XML catalog (an XML instance file) against the OASIS schema specification for XML catalogs.",
    extensions: ["xml"],
    icon: Icons.xml,
    group: "XML",
    route: API.routes.validate_xml_catalog,
    file1: {
      icon: Icons.xml,
      description: "xml-catalog.xml",
      paramName: "file",
      validExtensions: [".xml"],
      pathValidExample: "demo/validate/xml/xml-catalog/xml-catalog-valid.xml",
      pathInvalidExample : "demo/validate/xml/xml-catalog/xml-catalog-invalid.xml"
    }
  }
]
