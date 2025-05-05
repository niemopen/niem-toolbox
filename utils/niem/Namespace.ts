import type { BreadcrumbItem } from "@nuxt/ui";
import { Entity, type EntityTypeCode } from "./Entity";
import { Version } from "./Version";

export class Namespace extends Entity {

  override "@type": EntityTypeCode = "Namespace";

  override category?: APINamespaceCategory = undefined;

  prefix?: string;
  name?: string;
  uri?: string;
  definition?: string;
  draft?: string;
  target?: "REF" | "EXT";
  generation?: "build" | "static_file" | "none";
  filename?: string;
  filepath?: string;
  conformanceTarget?: string;
  isOriginal?: boolean;
  isDeprecated?: boolean;
  hasTarget?: boolean; // TODO: Review hasTarget
  steward?: APIStewardRef;
  model?: APIModelRef;
  version?: APIVersionRef;

  propertiesLoaded = false;
  typesLoaded = false;
  localTermsLoaded = false;

  propertiesCount: number | undefined = undefined;
  typesCount: number | undefined = undefined;
  localTermsCount: number | undefined = undefined;

  override get badgeLabel() {
    return this.category;
  }

  override get badgeColor(): ColorType {
    return "neutral";
  }

  override get documentation() {
    return this.definition;
  }

  override get icon() {
    return icons.namespace;
  }

  override get infoItems(): InfoItem[] {
    let items: InfoItem[] = [];

    Entity.addInfoItem(items, "Prefix", this.prefix);
    Entity.addInfoItem(items, "Name", this.name);
    Entity.addInfoItem(items, "URI", this.uri, "link");
    Entity.addInfoItem(items, "Definition", this.definition);
    Entity.addInfoItem(items, "Category", this.category);
    Entity.addInfoItem(items, "Draft", this.draft);
    Entity.addInfoItem(items, "Target", this.target);
    Entity.addInfoItem(items, "Generation", this.generation);
    Entity.addInfoItem(items, "Filename", this.filename);
    Entity.addInfoItem(items, "Filepath", this.filepath);
    Entity.addInfoItem(items, "Conformance target", this.conformanceTarget, "link");
    Entity.addInfoItem(items, "Deprecated?", this.isDeprecated + "");

    return items;
  }

  override get label() {
    return this.prefix || "undefined";
  }

  override get labelQualifier() {
    if (this.name) return this.name;
  }

  override get page() {
    return AppItems.namespace;
  }

  override get params() {
    return super.params as APINamespaceParams;
  }

  override get tabsItems(): ToolboxTabsItem[] {
    return [
      {
        icon: icons.property,
        label: "Properties",
        slot: "properties",
        count: this.propertiesCount,
        more: !this.propertiesLoaded
      },
      {
        icon: icons.type,
        label: "Types",
        slot: "types",
        count: this.typesCount,
        more: !this.typesLoaded
      },
      {
        icon: icons.term,
        label: "Local terms",
        slot: "terms"
      }
    ];
  }

  static override apiRoute(params: APIVersionParams | APINamespaceParams) {
    let route = Version.apiRoute(params) + "/namespaces";
    if ("prefix" in params) {
      route += "/" + params.prefix;
    }
    return route;
  }

  static override breadcrumbs(params: APINamespaceParams): BreadcrumbItem[] {
    let breadcrumbs = Version.breadcrumbs(params).slice(0, -1);
    breadcrumbs.push(...[
      {
        to: Version.toolboxRoute(params),
        label: params.versionNumber
      },
      {
        label: params.prefix
      }
    ])
    return breadcrumbs;
  }

  static override id(versionID: string, prefix: string) {
    return `${versionID}/${prefix}`;
  }

  static override init() {
    return new Namespace();
  }

  static override params(namespace: APINamespace | string): APINamespaceParams {
    if (typeof namespace == "string") {
      let [stewardKey, modelKey, versionNumber, prefix] = namespace.split("/");
      return {
        stewardKey,
        modelKey,
        versionNumber,
        prefix
      }
    }
    return {
      stewardKey: namespace.steward.stewardKey,
      modelKey: namespace.model.modelKey,
      versionNumber: namespace.version.versionNumber,
      prefix: namespace.prefix
    }
  }

  static override sort(a: Namespace, b: Namespace) {
    if (!a.prefix || !b.prefix) {
      return 0;
    }
    return a.prefix.localeCompare(b.prefix);
  }

  static override toolboxRoute(params: APINamespaceParams) {
    return Version.toolboxRoute(params) + "/" + params.prefix;
  }


  private static readonly CATEGORY_SORT_ORDER: APINamespaceCategory[] = ["core", "core_supplement", "domain", "domain_update", "exchange", "extension", "code", "adapter", "auxiliary", "built_in", "external", "other", "utility"]

  static sortCategories(a: APINamespaceCategory, b: APINamespaceCategory) {
    return Namespace.CATEGORY_SORT_ORDER.indexOf(a) - Namespace.CATEGORY_SORT_ORDER.indexOf(b);
  }

  static sortByCategoryName(a: { category: APINamespaceCategory, name: string }, b: { category: APINamespaceCategory, name: string }) {
    if (a.category != b.category) {
      return Namespace.CATEGORY_SORT_ORDER.indexOf(a.category) - Namespace.CATEGORY_SORT_ORDER.indexOf(b.category);
    }
    return a.name.localeCompare(b.name);
  }

  static sortByCategoryPrefix(a: { category: APINamespaceCategory, prefix: string }, b: { category: APINamespaceCategory, prefix: string }) {
    if (a.category != b.category) {
      return Namespace.CATEGORY_SORT_ORDER.indexOf(a.category) - Namespace.CATEGORY_SORT_ORDER.indexOf(b.category);
    }
    return a.prefix.localeCompare(b.prefix);
  }

}
