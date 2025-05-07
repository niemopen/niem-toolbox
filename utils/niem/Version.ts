import { Entity, type EntityTypeCode } from "./Entity";
import { Model } from "./Model";
import { Steward } from "./Steward";
import { ToolboxApp } from "../ToolboxApp";

export class Version extends Entity {

  override "@type": EntityTypeCode = "Version";

  override category?: APIVersionCategoryType;

  conformanceTargets?: string;
  draft?: string;
  exchangePartners?: string;
  exchangePattern?: string;
  isCurrent?: boolean;
  isPublished?: boolean;
  model?: APIModelRef;
  niemVersionNumber?: string;
  revised?: string;
  status?: string;
  steward?: APIStewardRef;
  uri?: string;
  versionNumber?: string;
  description?: string;
  link?: string;

  namespacesLoaded = false;
  namespacesCount: number | undefined;

  propertiesLoaded = false;
  propertiesCount: number | undefined;

  typesLoaded = false;
  typesCount: number | undefined;

  override disabled = true;

  // LATER: Simple NIEM rendering options
  /**
   * Rendering options for simplified NIEM message format schemas
   */
  simpleOptions = {
    inlineSubstitutions: false,
    flattenInheritance: false,
    flattenDatatypes: false,
    useAliases: false,
    defaultMin: "0",
    defaultMax: "unbounded",
    defaultAttributeUse: "optional",
    removePrefixes: false
  }

  constructor(model?: Model, versionNumber?: string, niemVersionNumber?: string, category?: APIVersionCategoryType) {
    super();
    this.versionNumber = versionNumber;
    this.niemVersionNumber = niemVersionNumber;
    this.category = category;

    if (model) {
      this.model = Model.toRef(model);
      if (model.steward) {
        this.steward = model.steward;
      }
    }
  }

  override get badgeLabel() {
    let separator = " | ";
    if (this.isCurrent) return ToolboxApp.join(separator, this.category, "current");
    if (!this.isPublished) return ToolboxApp.join(separator, this.category, "draft");
    return this.category;
  }

  override get badgeColor(): ColorType {
    if (this.isCurrent) return "success";
    if (!this.isPublished) return "warning";
    if (this.category == "major") return "primary";
    return "neutral";
  }

  override get documentation() {
    return this.description;
  }

  override get icon() {
    return icons.version;
  }

  override get infoItems() {
    let items: InfoItem[] = [];

    Entity.addInfoItem(items, "Version Number", this.versionNumber);

    Entity.addInfoItem(items, "Category", this.category);
    Entity.addInfoItem(items, "Conformance targets", this.conformanceTargets);
    Entity.addInfoItem(items, "Draft", this.draft);
    Entity.addInfoItem(items, "Exchange partners", this.exchangePartners);
    Entity.addInfoItem(items, "Exchange pattern", this.exchangePattern);
    Entity.addInfoItem(items, "Is current?", this.isCurrent + "");
    Entity.addInfoItem(items, "Is published?", this.isPublished + "");
    Entity.addInfoItem(items, "NIEM version number", this.niemVersionNumber);
    Entity.addInfoItem(items, "Revised date", this.revised);
    Entity.addInfoItem(items, "Status", this.status);
    Entity.addInfoItem(items, "URI", this.uri, "link");
    Entity.addInfoItem(items, "Description", this.description);
    Entity.addInfoItem(items, "Website", this.link, "link");

    return items;
  }

  override get label() {
    return this.versionNumber || "undefined";
  }

  override get page() {
    return AppItems.version;
  }

  override get params() {
    return super.params as APIVersionParams;
  }

  override get tabsItems(): ToolboxTabsItem[] {
    return [
      {
        icon: icons.namespace,
        label: "Namespaces",
        slot: "namespaces",
        count: this.namespacesCount
      },
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
      }
    ];
  }

  static override apiRoute(params: APIModelParams | APIVersionParams) {
    let route = `${Model.apiRoute(params)}/versions`;
    if ("versionNumber" in params) {
      return `${route}/${params.versionNumber}`;
    }
    return route;
  }

  static override breadcrumbs(params: APIVersionParams) {
    let breadcrumbs = Model.breadcrumbs(params).slice(0, -1);
    breadcrumbs.push(...[
      {
        to: Model.toolboxRoute(params),
        label: params.modelKey
      },
      {
        label: params.versionNumber
      }
    ]);
    return breadcrumbs;
  }

  static override fromAPI(apiData: APIVersion) {
    return Object.assign(new Version(), apiData) as Version;
  }

  static override fromAPIList(apiData: APIVersion[]) {
    return apiData.map(apiVersion => Version.fromAPI(apiVersion));
  }

  static override id(modelID: string, versionNumber: string) {
    return `${modelID}/${versionNumber}`;
  }

  static override init() {
    return new Version();
  }

  static override params(version: APIVersion | string): APIVersionParams {
    if (typeof version == "string") {
      let [stewardKey, modelKey, versionNumber] = version.split("/");
      return {
        stewardKey,
        modelKey,
        versionNumber
      }
    }
    return {
      stewardKey: version.steward.stewardKey,
      modelKey: version.model.modelKey,
      versionNumber: version.versionNumber
    }
  }

  /**
   * Sort by version number descending.
   */
  static override sort(a: Version, b:Version) {
    if (!a.versionNumber || !b.versionNumber) {
      return 0;
    }
    return b.versionNumber.localeCompare(a.versionNumber);
  }

  static override toolboxRoute(params: APIVersionParams) {
    return Model.toolboxRoute(params) + "/" + params.versionNumber;
  }

  static override toRef(entity: Version): APIVersionRef {
    return {
      route: entity.route,
      versionNumber: entity.versionNumber as string,
      niemVersionNumber: entity.niemVersionNumber
    }
  }

}
