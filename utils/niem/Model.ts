import type { BreadcrumbItem, TabsItem } from "@nuxt/ui";
import { Entity, type EntityTypeCode } from "./Entity";
import { Steward } from "./Steward";
import { Version } from "./Version";
import type { Serializer } from "@vueuse/core";
import { ToolboxApp } from "../ToolboxApp";
import type { Reactive } from "vue";

export class Model extends Entity {

  override "@type": EntityTypeCode = "Model";

  override category?: APIModelCategory;

  description?: string;
  developer?: string;
  fullName?: string;
  keywords?: string;
  modelKey?: string;
  objective?: string;
  purpose?: string;
  repo?: string;
  shortName?: string;
  steward?: APIStewardRef;
  subjects?: string;
  website?: string;

  versionsLoaded = false;
  versionsCount: number | undefined;

  static readonly NIEMModelKey = "model";

  static readonly NIEMModelParams: APIModelParams = {
    stewardKey: Steward.NIEMStewardKey,
    modelKey: Model.NIEMModelKey
  }

  constructor(steward?: Steward, shortName?: string, fullName?: string, category?: APIModelCategory) {
    super();
    this.shortName = shortName;
    this.fullName = fullName;
    this.category = category;

    if (steward) {
      this.steward = Steward.toRef(steward);
    }
  }

  static get NIEMModelID() {
    return Model.id(Steward.NIEMStewardKey, this.NIEMModelKey);
  }

  override get badgeLabel() {
    return this.category;
  }

  override get badgeColor(): ColorType  {
    return this.category == "other" ? "neutral" : "primary";
  }

  override get badgeVariant(): ColorVariantType {
    return this.category == "reference" ? "solid" : "subtle";
  }

  override get documentation() {
    return this.description;
  }

  override get icon() {
    return icons.model;
  }

  override get infoItems() {
    let items: InfoItem[] = [];

    Entity.addInfoItem(items, "Full name", this.fullName);
    Entity.addInfoItem(items, "Description", this.description);
    Entity.addInfoItem(items, "Category", this.category);
    Entity.addInfoItem(items, "Website", this.website, "link");
    Entity.addInfoItem(items, "Repo", this.repo, "link");
    Entity.addInfoItem(items, "Developer", this.developer);
    Entity.addInfoItem(items, "Keywords", this.keywords);
    Entity.addInfoItem(items, "Objective", this.objective);
    Entity.addInfoItem(items, "Purpose", this.purpose);
    Entity.addInfoItem(items, "Subjects", this.subjects);

    return items;
  }

  override get label() {
    return this.shortName || "undefined";
  }

  override get labelQualifier() {
    return this.steward?.shortName;
  }

  override get page() {
    return AppItems.model;
  }

  override get params() {
    return super.params as APIModelParams;
  }

  override get tabsItems(): ToolboxTabsItem[] {
    return [
      {
        icon: icons.version,
        label: "Versions",
        slot: "versions",
        count: this.versionsCount
      }
    ]
  }

  static override apiRoute(params: APIStewardParams | APIModelParams) {
    let route = Steward.apiRoute(params) + "/models";
    if ("modelKey" in params) {
      route += `/${params.modelKey}`;
    }
    return route;
  }

  static override breadcrumbs(params: APIModelParams): BreadcrumbItem[] {
    let breadcrumbs = Steward.breadcrumbs(params).slice(0, -1);
    breadcrumbs.push(...[
      {
        to: Steward.toolboxRoute(params),
        label: params.stewardKey
      },
      {
        label: params.modelKey
      }
    ]);
    return breadcrumbs;
  }

  static override id(stewardID: string, modelKey: string) {
    return `${stewardID}/${modelKey}`;
  }

  static override init() {
    return new Model();
  }

  static override params(model: APIModel | string): APIModelParams {
    if (typeof model == "string") {
      let [stewardKey, modelKey] = model.split("/");
      return {
        stewardKey: stewardKey,
        modelKey: modelKey
      }
    }
    return {
      stewardKey: model.steward.stewardKey,
      modelKey: model.modelKey
    }
  }

  /**
   * Sort by:
   * 1. NIEM reference model
   * 2. Model short name
   * 3. Steward short name
   */
  static override sort(a: Model, b: Model) {
    // Check that sort fields exist
    if (!a.steward?.stewardKey || !a.steward.shortName || !b.steward?.stewardKey || !b.steward.shortName || !a.shortName || !b.shortName) {
      return 0;
    }

    // Return the NIEM reference model first
    if (a.steward.stewardKey == Steward.NIEMStewardKey && a.modelKey == Model.NIEMModelKey) {
      return -1;
    }

    // If model short names match, sort by steward short name
    if (a.shortName == b.shortName) {
      return a.steward.shortName.localeCompare(b.steward.shortName || "");
    }

    // Sort by model short name
    return a.shortName.localeCompare(b.shortName);
  }

  static override toolboxRoute(params: APIModelParams) {
    return Steward.toolboxRoute(params) + "/" + params.modelKey;
  }

  static override toRef(entity: Model): APIModelRef {
    return {
      route: entity.route,
      modelKey: entity.modelKey as string,
      shortName: entity.shortName
    }
  }

  static readonly serializer: Serializer<Model> = {
    read: (raw: string) => Object.assign(new Model(), JSON.parse(raw)),
    write: (value: Model) => JSON.stringify(value)
  }

}
