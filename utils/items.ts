import type { DropdownMenuItem } from "@nuxt/ui";

const TOOLBOX_REPO_URL = "https://github.com/niemopen/niem-toolbox/";

type AppItemsKeyType = keyof typeof AppItemsHelper;

/**
 * Added a helper object to avoid self-referencing errors in getting the keys for the typing.
 * Object AppItem is typed correctly and assigned the value of this object.
 */
const AppItemsHelper = {
  brand: {
    value: "brand",
    to: "/",
    label: "NIEM Toolbox",
    icon: icons.toolbox
  },
  home: {
    value: "home",
    to: "/",
    label: "Home",
    icon: icons.home,
    description: "Use the provided utilities to help manage NIEM data models or to see working demos of NIEM API 2.0 functionality."
  },
  browse: {
    value: "browse",
    to: "/browse",
    label: "Browse NIEM and community content",
    icon: icons.browse,
    description: "Browse NIEM and published models top-down.  Look at highlighted NIEM components."
  },
  search: {
    value: "search",
    to: undefined,
    label: "Search NIEM and community content",
    icon: icons.search,
    description: "Search on specific terms, filter results by namespaces, types, and other options."
  },
  build: {
    value: "build",
    to: undefined,
    label: "Work on models",
    icon: icons.build,
    description: "Build a subset and create extensions.  Reuse components from NIEM and other published models."
  },
  validate: {
    value: "validate",
    to: "/validate",
    label: "Validate models and artifacts",
    icon: icons.validate,
    description: "Check NIEM schemas, sample instances, catalog files, and IEPDs / message specifications."
  },
  transform: {
    value: "transform",
    to: "/transform",
    label: "Transform models",
    icon: icons.transform,
    description: "Convert NIEM models in CMF or NIEM XML Schema into supported formats, including NIEM JSON."
  },
  publish: {
    value: "publish",
    to: undefined,
    label: "Publish a model",
    icon: icons.publish,
    description: "Import a NIEM community model or IEPD / message specification to make available to others."
  },
  migrate: {
    value: "migrate",
    to: "/migrate",
    label: "Migrate a model",
    icon: icons.migrate,
    description: "Update a NIEM subset to a more recent version."
  },
  login: {
    value: "login",
    to: undefined,
    label: "Log in",
    icon: icons.user,
    class: "cursor-not-allowed opacity-50",
    disabled: true
  },
  preferences: {
    value: "preferences",
    to: undefined,
    label: "Site preferences",
    icon: icons.preferences,
    class: "cursor-not-allowed opacity-50",
    disabled: true
  },
  releaseNotes: {
    value: "release_notes",
    to: "/release-notes",
    label: "Release notes",
    icon: icons.releaseNotes
  },
  help: {
    value: "help",
    to: undefined,
    label: "Help",
    icon: icons.help,
    class: "cursor-not-allowed opacity-50",
    disabled: true
  },
  steward: {
    value: "steward",
    label: "Steward",
    icon: icons.steward
  },
  model: {
    value: "model",
    label: "Model",
    icon: icons.model
  },
  version: {
    value: "version",
    label: "Version",
    icon: icons.version
  },
  namespace: {
    value: "namespace",
    label: "Namespace",
    icon: icons.namespace
  },
  property: {
    value: "property",
    label: "Property",
    icon: icons.property
  },
  type: {
    value: "type",
    label: "Type",
    icon: icons.class
  },
  childProperty: {
    value: "childProperty",
    label: "Child Property",
    icon: icons.childProperty
  },
  facet: {
    value: "facet",
    label: "Facet",
    icon: icons.facet
  },
  niemOpenWebsite: {
    value: "niem-open-website",
    to: "https://niemopen.org",
    label: "NIEMOpen",
    icon: icons.niemopen,
    target: "_blank"
  },
  apiRepo: {
    value: "api-repo",
    to: "https://github.com/niemopen/niem-api/",
    label: "NIEM API 2.0",
    icon: icons.github,
    target: "_blank"
  },
  cmfRepo: {
    value: "cmf-repo",
    to: "https://github.com/niemopen/common-model-format",
    label: "CMF",
    icon: icons.cmf,
    target: "_blank"
  },
  cmfToolRepo: {
    value: "cmf-tool-repo",
    to: "https://github.com/niemopen/cmftool",
    label: "CMF Tool",
    icon: icons.github,
    target: "_blank"
  },
  techHub: {
    value: "tech-hub",
    to: "https://niem.github.io",
    label: "niem.github.io",
    icon: icons.book,
    target: "_blank"
  },
  trainingVideos: {
    value: "training-videos",
    to: "https://www.youtube.com/watch?v=LJABuw42EnY&list=PLWEnz1sVMlkqxUzx7mCFSRdOLZhyM4DiV",
    label: "Training",
    icon: icons.youtube,
    target: "_blank"
  },
  contact: {
    value: "contact",
    to: "https://www.niemopen.org/contact/",
    label: "Contact Us",
    icon: icons.help,
    target: "_blank"
  },
  toolboxRepo: {
    value: "toolbox-repo",
    to: TOOLBOX_REPO_URL,
    label: "NIEM Toolbox",
    icon: icons.github,
    target: "_blank"
  },
  apiSwaggerUI: {
    value: "api-swagger-ui",
    to: Config.baseURL + "/swagger-ui/index.html",
    label: "NIEM API 2.0 REST documentation",
    target: "_blank",
    icon: icons.swagger
  },
  toolboxIssues: {
    value: "toolbox-issues",
    to: TOOLBOX_REPO_URL + "issues/",
    label: "Issues",
    icon: icons.issue,
    target: "_blank"
  }
}

export const AppItems: { [key in AppItemsKeyType]: AppLinkType } = AppItemsHelper

export const AppTools = [
  AppItems.browse,
  AppItems.search,
  AppItems.build,
  AppItems.validate,
  AppItems.transform,
  AppItems.publish,
  AppItems.migrate
];

export function AppMenuItem(label: string | undefined, icon: IconType, childrenLinks: AppLinkType[]): DropdownMenuItem {
  let children = childrenLinks as DropdownMenuItem[];
  return {
    label,
    icon,
    children
  }
}
