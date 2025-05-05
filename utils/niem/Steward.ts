import type { BreadcrumbItem, TabsItem } from "@nuxt/ui";
import { Entity, type EntityTypeCode } from "./Entity"

export class Steward extends Entity {

  override "@type": EntityTypeCode = "Steward";

  override category?: APIStewardCategory;

  address?: string;
  contactName?: string;
  country?: string;
  description?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  shortName?: string;
  stewardKey?: string;
  subunit?: string;
  unit?: string;
  website?: string;

  modelsLoaded = false;
  modelsCount: number | undefined;

  namespacesLoaded = false;

  static readonly NIEMStewardKey = "niem";

  constructor(shortName?: string, fullName?: string, category?: APIStewardCategory) {
    super();
    this.shortName = shortName;
    this.fullName = fullName;
    this.category = category;
  }

  override get apiRoute() {
    return Steward.apiRoute(this.params);
  }

  override get badgeLabel() {
    let label = "";

    // TODO-API: Update NIEM steward to remove country
    label += this.stewardKey == "niem" ? "" : this.country;
    label += label.length > 0 && this.category ? " | " : "";
    label += this.category;

    return label;
  }

  override get badgeColor(): ColorType {
    return "neutral";
  }

  override get breadcrumbs() {
    return Steward.breadcrumbs(this.params);
  }

  override get documentation() {
    return this.description;
  }

  override get icon() {
    return icons.steward;
  }

  override get infoItems() {
    let items: InfoItem[] = [];

    let unit = this.unit + (this.unit && this.subunit ? " | " : "") + this.subunit;

    Entity.addInfoItem(items, "Full name", this.fullName);
    Entity.addInfoItem(items, "Unit", unit);
    Entity.addInfoItem(items, "Description", this.description);
    Entity.addInfoItem(items, "Category", this.category);
    Entity.addInfoItem(items, "Contact", this.contactName);
    Entity.addInfoItem(items, "Address", this.address);
    Entity.addInfoItem(items, "Country", this.country);
    Entity.addInfoItem(items, "Website", this.website, "link");
    Entity.addInfoItem(items, "Email", this.email, "email");
    Entity.addInfoItem(items, "Phone", this.phone);

    return items;
  }

  override get label() {
    return this.shortName || "undefined";
  }

  override get page() {
    return AppItems.steward;
  }

  override get params() {
    return super.params as APIStewardParams;
  }

  override get tabsItems(): ToolboxTabsItem[] {
    return [
      {
        icon: icons.model,
        label: "Models",
        slot: "models",
        count: this.modelsCount
      },
      {
        icon: icons.namespace,
        label: "Namespaces",
        slot: "namespaces"
      }
    ];
  }

  override get toolboxRoute() {
    return Steward.toolboxRoute(this.params);
  }

  static override apiRoute(params?: APIStewardParams) {
    let route = Config.baseURL + "stewards";
    if (params) {
      route += `/${params.stewardKey}`;
    }
    return route;
  }

  static override breadcrumbs(params: APIStewardParams): BreadcrumbItem[] {
    return [
      {
        to: "/",
        label: "Home"
      },
      {
        to: "/browse",
        label: "Browse"
      },
      {
        label: params.stewardKey
      }
    ]
  }

  static override id(stewardKey: string | undefined) {
    return stewardKey || "";
  }

  static override init() {
    return new Steward();
  }

  static override params(steward: APISteward | string): APIStewardParams {
    if (typeof steward == "string") {
      return {
        stewardKey: steward
      }
    }
    return {
      stewardKey: steward.stewardKey
    }
  }

  /**
   * Sort by NIEM first, then short name.
   */
  static override sort(a: Steward, b: Steward): number {
    if (b.stewardKey == "niem") {
      return 1;
    }
    return a.stewardKey?.localeCompare(b.stewardKey || "") || 0;
  }

  static override toolboxRoute(params: APIStewardParams) {
    return `/browse/${params.stewardKey}`;
  }

  static override toRef(entity: Steward): APIStewardRef {
    return {
      route: entity.route,
      stewardKey: entity.stewardKey as string,
      shortName: entity.shortName
    }
  }

}
